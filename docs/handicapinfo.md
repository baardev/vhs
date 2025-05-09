 

I've added the page for the golf handicap calculator.

https://libronico.com/handicap

The relevant files are:

# Backend

**`backend/src/index.ts`**

- `import handicapCalcRouter from './routes/handicapCalc';`
- `app.use('/api/handicap-calc', handicapCalcRouter);`
  - test with https://libronico.com/api/handicap-calc

**`backend/src/routes/handicapCalc.ts`**

- This has the calculator functions `calculateHandicap_v2()`. The original function was `calculateHandicap()`, that should never be used. The `calculateHandicap_v2()` calculates the handicap using the `adj_gross` value from the `player_cards` table, but that field is mock data, and needs to be recalculated according to the official formulas. For now, `adj_gross` is calculated as 12 less than `gross`.

# Frontend

**`frontend/pages/handicap.tsx`**

- this is the red bordered main page at https://libronico.com/handicap
  - *to remove red border, remove `style` declaration in top DIV*
- `import HandicapCalculator from '../components/handicap/HandicapCalculator';`

**`frontend/components/handicap/HandicapCalculator.tsx`**

- This is the green-bordered box inside the parent div
  - *to remove border, delete, replace "border border-green-500" with '' as there are multiple instances*

- The local React state manages our handicap data. `handicapData` stores the JSON response from the `/api/handicap-calc` endpoint, and `setHandicapData` is the updater function provided by `useState` to change that state. This state is held internally by the component and is not passed in from any parent.

There is also the handicap display on the dashboard https://libronico.com/dashboard, which is a bit of a mess, because we have three sources for handicap data: 1) the user profile, 2) the table VIEW of `current_handicap_indexes`, and the realtime handicap calculator.  What (probably) needs to happen is we need to update `users` and the `current_handicap_indexes` (or maybe just delete this?) wherever the handicap is calculated.  For soem reason, teh dashboard handicap on the live site says "N/A" but on my local site it says 20.1 :/

# Database

Any changes to the table must be reflected in the CSV and SQL files because REBUILD_TABLES drops the entire database and rebuilds from scratch.

**`backend/db/csv/200_player_cards.csv`**

- Hold the CSV data that populates the `player_cards` table when `REBUILD_TABLES` is run.

**`backend/db/sql/200_create_player_cards_table.sql`**

- The SQL that builds `players_cards` table and imports the CSV  when `REBUILD_TABLES` is run.

**`backend/db/200_create_player_cards_table.sh`**

- The script that rebuilds and repopulates the `player_cards` table, which is called  when `REBUILD_TABLES` is run.
