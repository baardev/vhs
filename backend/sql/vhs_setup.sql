-- Drop database if it exists
DROP DATABASE IF EXISTS vhsdb;

-- Create database
CREATE DATABASE vhsdb;

-- Connect to the database
\c vhsdb

-- Drop tables if they exist (in correct order due to foreign key constraints)
-- DROP TABLE IF EXISTS password_reset_tokens;
-- DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100),
    family_name VARCHAR(100),
    matricula VARCHAR(50),
    handicap DECIMAL(4,1)
);

-- Create indexes for users table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_matricula ON users(matricula);

-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

-- Create index for tokens
CREATE INDEX idx_tokens_token ON password_reset_tokens(token);

-- Insert admin user (password is '1q2w3e' hashed with bcrypt)
INSERT INTO users (username, email, password)
VALUES ('admin', 'admin@example.com', '$2b$10$rK.2NppRGAcXBoQPxcmZoO5fY7RDwzIi69le.YYXlFwLCTfUBKfGC');


-- Create table
CREATE TABLE golf_quotes (
    id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author VARCHAR(255) NOT NULL
);

-- Insert quotes
INSERT INTO golf_quotes (quote, author) VALUES
('I regard golf as an expensive way of playing marbles.', 'G.K. Chesterton'),
('Golf, like measles, should be caught young.', 'P.G. Wodehouse'),
('The uglier a man''s legs are, the better he plays golf. It''s almost a law.', 'H.G. Wells'),
('Golf: A plague invented by the Calvinistic Scots as a punishment for man''s sins.', 'James Barrett Reston'),
('Although golf was originally restricted to wealthy, overweight Protestants, today it''s open to anybody who owns hideous clothing.', 'Dave Berry'),
('I don''t let birdies and pars get in the way of having a good time', 'Angelo Spagnolo'),
('It took me seventeen years to get three thousand hits in baseball. It took one afternoon on the golf course.', 'Hank Aaron'),
('Golf… is the infallible test. The man who can go into a patch of rough alone, with the knowledge that only God is watching him, and play his ball where it lies, is the man who will serve you faithfully and well.', 'P.G. Wodehouse'),
('Mistakes are part of the game. It''s how well you recover from them, that''s the mark of a great player.', 'Alice Cooper'),
('Golf is a compromise between what your ego wants you to do, what experience tells you to do, and what your nerves let you do.', 'Bruce Crampton'),
('There are no shortcuts on the quest for perfection.', 'Ben Hogan'),
('You swing your best when you have the fewest things to think about.', 'Bobby Jones'),
('A shot that goes in the cup is pure luck, but a shot to within two feet of the flag is skill.', 'Ben Hogan'),
('A perfectly straight shot with a big club is a fluke.', 'Jack Nicklaus'),
('Forget your opponents; always play against par.', 'Sam Snead'),
('Putts get real difficult the day they hand out the money.', 'Lee Trevino'),
('Golf is about how well you accept, respond to, and score with your misses much more so than it is a game of your perfect shots.', 'Dr. Bob Rotella'),
('Never concede the putt that beats you.', 'Harry Vardon'),
('Every shot counts. The three-foot putt is as important as the 300-yard drive.', 'Henry Cotton'),
('You know what they say about big hitters…the woods are full of them.', 'Jimmy Demaret'),
('When you lip out several putts in a row, you should never think that means that you''re putting well. When you''re putting well, the only question is what part of the hole it''s going to fall in, not if it''s going in.', 'Jack Nicklaus'),
('The mind messes up more shots than the body.', 'Tommy Bolt'),
('One of the most fascinating things about golf is how it reflects the cycle of life. No matter what you shoot – the next day you have to go back to the first tee and begin all over again and make yourself into something.', 'Peter Jacobsen'),
('Golf is a game you can never get too good at. You can improve, but you can never get to where you master the game.', 'Gay Brewer'),
('A leading difficulty with the average player is that he totally misunderstands what is meant by concentration. He may think he is concentrating hard when he is merely worrying.', 'Bobby Jones'),
('Golf is the loneliest sport. You''re completely alone with every conceivable opportunity to defeat yourself. Golf brings out your assets and liabilities as a person. The longer you play, the more certain you are that a man''s performance is the outward manifestation of who, in his heart, he really thinks he is.', 'Hale Irwin'),
('Nobody asked how you looked, just what you shot.', 'Sam Snead'),
('I have found the game to be, in all factualness, a universal language wherever I traveled at home or abroad.', 'Ben Hogan'),
('Golf is the only sport I know of where a player pays for every mistake. A man can muff a serve in tennis, miss a strike in baseball, or throw an incomplete pass in football and still have another chance to square himself. In golf, every swing counts against you.', 'Lloyd Mangrum'),
('Concentration comes out of a combination of confidence and hunger.', 'Arnold Palmer'),
('Mulligan: invented by an Irishman who wanted to hit one more twenty yard grounder.', 'Jim Bishop'),
('For this game you need, above all things, to be in a tranquil frame of mind.', 'Harry Vardon'),
('You don''t know what pressure is until you play for five bucks with only two bucks in your pocket.', 'Lee Trevino'),
('The secret of golf is to turn three shots into two.', 'Bobby Jones'),
('Of all the hazards, fear is the worst.', 'Sam Snead'),
('Golf is a good walk spoiled', 'Mark Twain'),
('No matter how good you get, you can always get better — and that''s the exciting part.', 'Tiger Woods'),
('The woods are full of long drivers.', 'Harvey Penick'),
('I don''t think it''s healthy to take yourself too seriously.', 'Payne Stewart'),
('If profanity had an influence on the flight of the ball, the game of golf would be played far better than it is.', 'Horace G. Hutchinson'),
('If a lot of people gripped a knife and fork the way they do a golf club, they''d starve to death.', 'Sam Snead'),
('What other people may find in poetry or art museums, I find in the flight of a good drive.', 'Arnold Palmer'),
('The golf swing is like a suitcase into which we are trying to pack one too many things.', 'John Updike'),
('Golf is not, on the whole, a game for realists. By its exactitude''s of measurements, it invites the attention of perfectionists.', 'Heywood Hale Broun'),
('If you wish to hide your character, do not play golf.', 'Percey Boomer'),
('Golf is deceptively simple and endlessly complicated.', 'Arnold Palmer'),
('Golf tips are like Aspirin: One may do you good, but if you swallow the whole bottle you''ll be lucky to survive.', 'Harvey Penick'),
('I never learned anything from a match that I won.', 'Bobby Jones'),
('It''s how you deal with failure that determines how you achieve success.', 'David Feherty'),
('Golf is a game whose aim is to hit a very small ball into an even smaller hole, with weapons singularly ill-designed for the purpose.', 'Winston Churchill'),
('Golf is played by twenty million mature American men whose wives think they are out having fun.', 'Jim Bishop'),
('My swing is so bad, I look like a caveman killing his lunch.', 'Lee Trevino'),
('You''ve got to have the guts not to be afraid to screw up.', 'Fuzzy Zoeller'),
('Golf appeals to the idiot in us and the child. Just how childlike golfers become is proven by their frequent inability to count past five.', 'John Updike'),
('Tempo is the glue that sticks all elements of the golf swing together.', 'Nick Faldo'),
('Don''t play too much golf. Two rounds a day are plenty.', 'Harry Vardon'),
('The only time my prayers are never answered is on the golf course.', 'Billy Graham'),
('Confidence is the most important single factor in this game, and no matter how great your natural talent, there is only one way to obtain and sustain it: work.', 'Jack Nicklaus'),
('Golf is the hardest game in the world. There is no way you can ever get it. Just when you think you do, the game jumps up and puts you in your place.', 'Ben Crenshaw'),
('The ardent golfer would play Mount Everest if somebody put a flagstick on top.', 'Pete Dye'),
('They call it golf because all the other four letter words were taken.', 'Raymond Floyd'),
('Success in golf depends less on strength of body than upon strength of mind and character.', 'Arnold Palmer'),
('I look into eyes, shake their hand, pat their back, and wish them luck, but I am thinking, I am going to bury you.', 'Seve Ballesteros'),
('Watching Phil Mickelson play golf is like watching a drunk chasing a balloon near the edge of a cliff.', 'David Feherty'),
('Golf is the most fun you can have without taking your clothes off.', 'Chi Chi Rodriguez'),
('If you''re caught on a golf course during a storm and are afraid of lightning, hold up a 1-iron. Not even God can hit a 1-iron.', 'Lee Trevino'),
('The more I practice, the luckier I get.', 'Gary Player'),
('Life is not fair, so why should I make a course that is fair.', 'Pete Dye'),
('A great shot is when you pull it off. A smart shot is when you don''t have the guts to try it.', 'Phil Mickelson'),
('A bad attitude is worse than a bad swing.', 'Payne Stewart'),
('Don''t be too proud to take lessons. I''m not.', 'Jack Nicklaus'),
('Happiness is a long walk with a putter', 'Greg Norman'),
('The most important shot in golf is the next one.', 'Ben Hogan'),
('Golf is assuredly a mystifying game. It would seem that if a person has hit a golf ball correctly a thousand times, he should be able to duplicate the performance at will. But such is certainly not the case.', 'Bobby Jones'),
('Golf can best be defined as an endless series of tragedies obscured by the occasional miracle.', 'Anonymous');





SELECT * FROM golf_quotes ORDER BY RANDOM() LIMIT 1;

SELECT * FROM users;

-- docker exec -i vhs-db-1 psql -U user -d postgres < backend/sql/vhs_setup.sql