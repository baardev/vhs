#!/usr/bin/env python3
"""
Handicap Calculator
This script calculates golf handicaps using the World Handicap System
based on data from the handicap_calculator view in PostgreSQL.
"""

import os
import sys
import psycopg2
import pandas as pd
from tabulate import tabulate
from datetime import datetime

# Database connection parameters
DB_PARAMS = {
    'dbname': 'vhsdb',
    'user': 'admin',
    'password': 'ABeoAuNKL5f',
    'host': 'localhost',
    'port': '6541'
}

def connect_to_db():
    """Connect to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to the database: {e}")
        sys.exit(1)

def get_player_handicap(player_id=None, player_name=None):
    """Get the pre-calculated handicap for a specific player or all players."""
    conn = connect_to_db()
    cursor = conn.cursor()
    
    query = "SELECT player_id, player_name, handicap_index, total_rounds, last_play_date FROM current_handicap_indexes"
    params = []
    
    if player_id:
        query += " WHERE player_id = %s"
        params.append(player_id)
    elif player_name:
        query += " WHERE LOWER(player_name) LIKE LOWER(%s)"
        params.append(f"%{player_name}%")
    
    query += " ORDER BY handicap_index"
    
    try:
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        if not results:
            print(f"No handicap data found for the specified player.")
            return None
        
        # Convert to pandas DataFrame for easier manipulation
        df = pd.DataFrame(results, columns=['Player ID', 'Player Name', 'Handicap Index', 'Rounds Used', 'Last Play Date'])
        return df
    
    except psycopg2.Error as e:
        print(f"Error retrieving handicap data: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def get_player_rounds(player_id, limit=20):
    """Get the most recent rounds for a player."""
    conn = connect_to_db()
    cursor = conn.cursor()
    
    query = """
    SELECT card_id, play_date, course_name, tee_name, gross, par, 
           course_rating, slope_rating, calculated_differential, recency_rank
    FROM handicap_calculator
    WHERE player_id = %s AND recency_rank <= %s
    ORDER BY play_date DESC
    """
    
    try:
        cursor.execute(query, (player_id, limit))
        results = cursor.fetchall()
        
        if not results:
            print(f"No round data found for player ID {player_id}")
            return None
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(results, columns=[
            'Card ID', 'Date', 'Course', 'Tee', 'Gross Score', 'Par', 
            'Course Rating', 'Slope Rating', 'Differential', 'Recency'
        ])
        return df
    
    except psycopg2.Error as e:
        print(f"Error retrieving round data: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def calculate_handicap(player_id):
    """Calculate handicap manually and show the calculation process."""
    rounds_df = get_player_rounds(player_id)
    if rounds_df is None or len(rounds_df) == 0:
        return None
    
    # Use the correctly calculated differential, not the stored one
    # Re-calculate it to be sure
    rounds_df['Recalculated_Diff'] = (rounds_df['Gross Score'] - rounds_df['Course Rating']) * 113 / rounds_df['Slope Rating']
    
    # Sort by recalculated differential
    rounds_df = rounds_df.sort_values('Recalculated_Diff')
    
    # Determine how many differentials to use based on available rounds
    total_rounds = len(rounds_df)
    differentials_to_use = 0
    
    if total_rounds >= 20:
        differentials_to_use = 8
    elif total_rounds >= 16:
        differentials_to_use = 8
    elif total_rounds >= 14:
        differentials_to_use = 6
    elif total_rounds >= 12:
        differentials_to_use = 5
    elif total_rounds >= 9:
        differentials_to_use = 4
    elif total_rounds >= 7:
        differentials_to_use = 3
    elif total_rounds >= 6:
        differentials_to_use = 2
    elif total_rounds >= 5:
        differentials_to_use = 1
    
    # Get best differentials
    best_rounds = rounds_df.iloc[:differentials_to_use]
    
    # Calculate handicap with corrected values
    if differentials_to_use > 0:
        avg_differential = best_rounds['Recalculated_Diff'].mean()
        handicap_index = round(avg_differential * 0.96, 1)
    else:
        handicap_index = None
    
    # Add a 'Used for Handicap' column to show which rounds were used
    rounds_df['Used for Handicap'] = False
    if len(best_rounds) > 0:
        rounds_df.loc[best_rounds.index, 'Used for Handicap'] = True
    
    return {
        'rounds': rounds_df,
        'best_rounds': best_rounds,
        'total_rounds': total_rounds,
        'differentials_to_use': differentials_to_use,
        'handicap_index': handicap_index
    }

def get_manual_handicap(player_id):
    """Calculate handicap directly without relying on the database view's calculations."""
    handicap_details = calculate_handicap(player_id)
    if not handicap_details or handicap_details['handicap_index'] is None:
        return None
    
    # Get name and other data from original function
    basic_data = get_player_handicap(player_id)
    
    if basic_data is None:
        return None
    
    # Create a new dataframe with correct handicap
    corrected_data = pd.DataFrame({
        'Player ID': [player_id],
        'Player Name': [basic_data['Player Name'].iloc[0]],
        'Handicap Index': [handicap_details['handicap_index']],
        'Rounds Used': [handicap_details['total_rounds']],
        'Last Play Date': [basic_data['Last Play Date'].iloc[0]]
    })
    
    return corrected_data

def display_player_handicap(player_id=None, player_name=None, verbose=False):
    """Display handicap information for a player."""
    if player_id:
        # Use manual calculation for specific player
        handicap_df = get_manual_handicap(player_id)
    else:
        # Use database view for listing all players
        handicap_df = get_player_handicap(player_name=player_name)
    
    if handicap_df is None:
        return
    
    print("\n=== Player Handicap Summary ===")
    print(tabulate(handicap_df, headers='keys', tablefmt='psql'))
    
    # If verbose mode and specific player, show calculation details
    if verbose and player_id:
        handicap_details = calculate_handicap(player_id)
        
        if handicap_details:
            print("\n=== Handicap Calculation Details ===")
            print(f"Total Rounds: {handicap_details['total_rounds']}")
            print(f"Differentials Used: {handicap_details['differentials_to_use']}")
            print(f"Calculated Handicap Index: {handicap_details['handicap_index']}")
            
            print("\n=== Rounds Used for Handicap Calculation ===")
            best_rounds = handicap_details['best_rounds'][['Date', 'Course', 'Gross Score', 'Course Rating', 'Slope Rating', 'Recalculated_Diff']]
            print(tabulate(best_rounds, headers='keys', tablefmt='psql'))
            
            print("\n=== All Recent Rounds ===")
            all_rounds = handicap_details['rounds'][['Date', 'Course', 'Gross Score', 'Recalculated_Diff', 'Used for Handicap']]
            print(tabulate(all_rounds, headers='keys', tablefmt='psql'))

def main():
    """Main function to parse arguments and display handicap information."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Calculate and display golf handicaps')
    
    player_group = parser.add_mutually_exclusive_group()
    player_group.add_argument('-i', '--id', type=int, help='Player ID')
    player_group.add_argument('-n', '--name', type=str, help='Player name (partial match)')
    
    parser.add_argument('-v', '--verbose', action='store_true', help='Show detailed calculation')
    
    args = parser.parse_args()
    
    # OVERRIDE DATABASE CALCULATION
    if args.id:
        # Calculate manually and show corrected result
        handicap_details = calculate_handicap(args.id)
        if handicap_details:
            print("\n=== CORRECTED Handicap Calculation ===")
            print(f"Player ID: {args.id}")
            print(f"Corrected Handicap Index: {handicap_details['handicap_index']}")
    
    # Show original (incorrect) calculation for comparison
    display_player_handicap(args.id, args.name, args.verbose)

def debug_handicap_calculation(player_id):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT player_id, gross, course_rating, slope_rating, g_differential, calculated_differential
        FROM handicap_calculator
        WHERE player_id = %s
        LIMIT 5
    """, (player_id,))
    results = cursor.fetchall()
    for row in results:
        print(f"Raw data: {row}")
        print(f"Manual check: ({row[1]} - {row[2]}) * 113 / {row[3]} = {(row[1] - row[2]) * 113 / row[3]}")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
    debug_handicap_calculation(1)
