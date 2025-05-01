--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.x_course_tee_types DROP CONSTRAINT x_course_tee_types_course_id_fkey;
ALTER TABLE ONLY public.x_course_holes DROP CONSTRAINT x_course_holes_course_id_fkey;
ALTER TABLE ONLY public.player_cards DROP CONSTRAINT player_cards_tee_id_fkey;
ALTER TABLE ONLY public.player_cards DROP CONSTRAINT player_cards_player_id_fkey;
ALTER TABLE ONLY public.player_cards DROP CONSTRAINT player_cards_course_id_fkey;
DROP INDEX public.idx_x_course_tee_types_tee_id;
DROP INDEX public.idx_x_course_tee_types_course_id;
DROP INDEX public.idx_x_course_names_name;
DROP INDEX public.idx_x_course_names_course_id;
DROP INDEX public.idx_x_course_holes_course_id;
DROP INDEX public.idx_x_course_data_by_tee_tee_id;
DROP INDEX public.idx_x_course_data_by_tee_course_id;
DROP INDEX public.idx_users_username;
DROP INDEX public.idx_users_matricula;
DROP INDEX public.idx_users_is_editor;
DROP INDEX public.idx_users_is_admin;
DROP INDEX public.idx_users_first_name;
DROP INDEX public.idx_users_email;
DROP INDEX public.idx_users_category;
DROP INDEX public.idx_player_cards_verified;
DROP INDEX public.idx_player_cards_tarj;
DROP INDEX public.idx_player_cards_player_id;
DROP INDEX public.idx_player_cards_play_date;
DROP INDEX public.idx_player_cards_differential;
DROP INDEX public.idx_player_cards_course_id;
DROP INDEX public.idx_password_reset_tokens_user_id;
DROP INDEX public.idx_password_reset_tokens_token;
ALTER TABLE ONLY public.x_course_tee_types DROP CONSTRAINT x_course_tee_types_tee_id_key;
ALTER TABLE ONLY public.x_course_tee_types DROP CONSTRAINT x_course_tee_types_pkey;
ALTER TABLE ONLY public.x_course_names DROP CONSTRAINT x_course_names_pkey;
ALTER TABLE ONLY public.x_course_names DROP CONSTRAINT x_course_names_course_id_key;
ALTER TABLE ONLY public.x_course_holes DROP CONSTRAINT x_course_holes_pkey;
ALTER TABLE ONLY public.x_course_holes DROP CONSTRAINT x_course_holes_course_id_hole_number_key;
ALTER TABLE ONLY public.x_course_data_by_tee DROP CONSTRAINT x_course_data_by_tee_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
ALTER TABLE ONLY public.player_cards DROP CONSTRAINT player_cards_pkey;
ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
ALTER TABLE ONLY public.golf_quotes DROP CONSTRAINT golf_quotes_pkey;
ALTER TABLE public.x_course_tee_types ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.x_course_names ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.x_course_holes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.x_course_data_by_tee ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.player_cards ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.password_reset_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.golf_quotes ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.x_course_tee_types_id_seq;
DROP TABLE public.x_course_tee_types;
DROP SEQUENCE public.x_course_names_id_seq;
DROP TABLE public.x_course_names;
DROP SEQUENCE public.x_course_holes_id_seq;
DROP TABLE public.x_course_holes;
DROP SEQUENCE public.x_course_data_by_tee_id_seq;
DROP TABLE public.x_course_data_by_tee;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.player_cards_id_seq;
DROP TABLE public.player_cards;
DROP SEQUENCE public.password_reset_tokens_id_seq;
DROP TABLE public.password_reset_tokens;
DROP SEQUENCE public.golf_quotes_id_seq;
DROP TABLE public.golf_quotes;
DROP EXTENSION pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: golf_quotes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.golf_quotes (
    id integer NOT NULL,
    quote text NOT NULL,
    author character varying(255) NOT NULL
);


ALTER TABLE public.golf_quotes OWNER TO admin;

--
-- Name: golf_quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.golf_quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.golf_quotes_id_seq OWNER TO admin;

--
-- Name: golf_quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.golf_quotes_id_seq OWNED BY public.golf_quotes.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(100) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    used boolean DEFAULT false
);


ALTER TABLE public.password_reset_tokens OWNER TO admin;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO admin;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: player_cards; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.player_cards (
    id integer NOT NULL,
    player_id integer NOT NULL,
    play_date date NOT NULL,
    course_id integer NOT NULL,
    ext_id integer NOT NULL,
    clima character varying(255),
    week_day character varying(20),
    category character varying(50),
    g_differential numeric,
    post text,
    judges text,
    hcpi numeric,
    hcp numeric,
    ida integer,
    vta integer,
    gross integer,
    net integer,
    tarj character varying(10),
    bir character varying(50),
    par character varying(50),
    bog integer,
    bg2 integer,
    bg3g integer,
    plus_bg3 character varying(50),
    putts character varying(50),
    tee_id character varying(50),
    h01 integer,
    h02 integer,
    h03 integer,
    h04 integer,
    h05 integer,
    h06 integer,
    h07 integer,
    h08 integer,
    h09 integer,
    h10 integer,
    h11 integer,
    h12 integer,
    h13 integer,
    h14 integer,
    h15 integer,
    h16 integer,
    h17 integer,
    h18 integer,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.player_cards OWNER TO admin;

--
-- Name: player_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.player_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.player_cards_id_seq OWNER TO admin;

--
-- Name: player_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.player_cards_id_seq OWNED BY public.player_cards.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    first_name character varying(100),
    family_name character varying(100),
    gender character varying(20),
    matricula character varying(50),
    birthday date,
    category character varying(50),
    handicap numeric(4,1),
    is_admin boolean DEFAULT false,
    is_editor boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: x_course_data_by_tee; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.x_course_data_by_tee (
    id integer NOT NULL,
    course_id integer NOT NULL,
    tee_id character varying(50),
    par integer,
    length integer,
    slope_rating integer,
    slope_back integer,
    slope_front integer,
    bogey_rating numeric(4,1),
    bogey_rating_back numeric(4,1),
    bogey_rating_front numeric(4,1),
    course_rating numeric(4,1),
    course_rating_back numeric(4,1),
    course_rating_front numeric(4,1)
);


ALTER TABLE public.x_course_data_by_tee OWNER TO admin;

--
-- Name: x_course_data_by_tee_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.x_course_data_by_tee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.x_course_data_by_tee_id_seq OWNER TO admin;

--
-- Name: x_course_data_by_tee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.x_course_data_by_tee_id_seq OWNED BY public.x_course_data_by_tee.id;


--
-- Name: x_course_holes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.x_course_holes (
    id integer NOT NULL,
    course_id integer NOT NULL,
    hole_number integer NOT NULL,
    par integer,
    men_stroke_index integer,
    women_stroke_index integer,
    CONSTRAINT x_course_holes_hole_number_check CHECK (((hole_number >= 1) AND (hole_number <= 18)))
);


ALTER TABLE public.x_course_holes OWNER TO admin;

--
-- Name: x_course_holes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.x_course_holes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.x_course_holes_id_seq OWNER TO admin;

--
-- Name: x_course_holes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.x_course_holes_id_seq OWNED BY public.x_course_holes.id;


--
-- Name: x_course_names; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.x_course_names (
    id integer NOT NULL,
    course_id integer,
    course_name text,
    address1 text,
    address2 text,
    city text,
    province character varying(15),
    country_code character varying(5),
    telephone character varying(50),
    email text
);


ALTER TABLE public.x_course_names OWNER TO admin;

--
-- Name: x_course_names_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.x_course_names_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.x_course_names_id_seq OWNER TO admin;

--
-- Name: x_course_names_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.x_course_names_id_seq OWNED BY public.x_course_names.id;


--
-- Name: x_course_tee_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.x_course_tee_types (
    id integer NOT NULL,
    course_id integer NOT NULL,
    tee_id character varying(50),
    tee_color character varying(50),
    tee_name character varying(50),
    tee_desc text
);


ALTER TABLE public.x_course_tee_types OWNER TO admin;

--
-- Name: x_course_tee_types_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.x_course_tee_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.x_course_tee_types_id_seq OWNER TO admin;

--
-- Name: x_course_tee_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.x_course_tee_types_id_seq OWNED BY public.x_course_tee_types.id;


--
-- Name: golf_quotes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.golf_quotes ALTER COLUMN id SET DEFAULT nextval('public.golf_quotes_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: player_cards id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards ALTER COLUMN id SET DEFAULT nextval('public.player_cards_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: x_course_data_by_tee id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_data_by_tee ALTER COLUMN id SET DEFAULT nextval('public.x_course_data_by_tee_id_seq'::regclass);


--
-- Name: x_course_holes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_holes ALTER COLUMN id SET DEFAULT nextval('public.x_course_holes_id_seq'::regclass);


--
-- Name: x_course_names id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_names ALTER COLUMN id SET DEFAULT nextval('public.x_course_names_id_seq'::regclass);


--
-- Name: x_course_tee_types id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_tee_types ALTER COLUMN id SET DEFAULT nextval('public.x_course_tee_types_id_seq'::regclass);


--
-- Data for Name: golf_quotes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.golf_quotes (id, quote, author) FROM stdin;
1	I regard golf as an expensive way of playing marbles.	G.K. Chesterton
2	Golf, like measles, should be caught young.	P.G. Wodehouse
3	The uglier a man's legs are, the better he plays golf. It's almost a law.	H.G. Wells
4	Golf: A plague invented by the Calvinistic Scots as a punishment for man's sins.	James Barrett Reston
5	Although golf was originally restricted to wealthy, overweight Protestants, today it's open to anybody who owns hideous clothing.	Dave Berry
6	I don't let birdies and pars get in the way of having a good time	Angelo Spagnolo
7	It took me seventeen years to get three thousand hits in baseball. It took one afternoon on the golf course.	Hank Aaron
8	Golf… is the infallible test. The man who can go into a patch of rough alone, with the knowledge that only God is watching him, and play his ball where it lies, is the man who will serve you faithfully and well.	P.G. Wodehouse
9	Mistakes are part of the game. It's how well you recover from them, that's the mark of a great player.	Alice Cooper
10	Golf is a compromise between what your ego wants you to do, what experience tells you to do, and what your nerves let you do.	Bruce Crampton
11	There are no shortcuts on the quest for perfection.	Ben Hogan
12	You swing your best when you have the fewest things to think about.	Bobby Jones
13	A shot that goes in the cup is pure luck, but a shot to within two feet of the flag is skill.	Ben Hogan
14	A perfectly straight shot with a big club is a fluke.	Jack Nicklaus
15	Forget your opponents; always play against par.	Sam Snead
16	Putts get real difficult the day they hand out the money.	Lee Trevino
17	Golf is about how well you accept, respond to, and score with your misses much more so than it is a game of your perfect shots.	Dr. Bob Rotella
18	Never concede the putt that beats you.	Harry Vardon
19	Every shot counts. The three-foot putt is as important as the 300-yard drive.	Henry Cotton
20	You know what they say about big hitters…the woods are full of them.	Jimmy Demaret
21	When you lip out several putts in a row, you should never think that means that you're putting well. When you're putting well, the only question is what part of the hole it's going to fall in, not if it's going in.	Jack Nicklaus
22	The mind messes up more shots than the body.	Tommy Bolt
23	One of the most fascinating things about golf is how it reflects the cycle of life. No matter what you shoot – the next day you have to go back to the first tee and begin all over again and make yourself into something.	Peter Jacobsen
24	Golf is a game you can never get too good at. You can improve, but you can never get to where you master the game.	Gay Brewer
25	A leading difficulty with the average player is that he totally misunderstands what is meant by concentration. He may think he is concentrating hard when he is merely worrying.	Bobby Jones
26	Golf is the loneliest sport. You're completely alone with every conceivable opportunity to defeat yourself. Golf brings out your assets and liabilities as a person. The longer you play, the more certain you are that a man's performance is the outward manifestation of who, in his heart, he really thinks he is.	Hale Irwin
27	Nobody asked how you looked, just what you shot.	Sam Snead
28	I have found the game to be, in all factualness, a universal language wherever I traveled at home or abroad.	Ben Hogan
29	Golf is the only sport I know of where a player pays for every mistake. A man can muff a serve in tennis, miss a strike in baseball, or throw an incomplete pass in football and still have another chance to square himself. In golf, every swing counts against you.	Lloyd Mangrum
30	Concentration comes out of a combination of confidence and hunger.	Arnold Palmer
31	Mulligan: invented by an Irishman who wanted to hit one more twenty yard grounder.	Jim Bishop
32	For this game you need, above all things, to be in a tranquil frame of mind.	Harry Vardon
33	You don't know what pressure is until you play for five bucks with only two bucks in your pocket.	Lee Trevino
34	The secret of golf is to turn three shots into two.	Bobby Jones
35	Of all the hazards, fear is the worst.	Sam Snead
36	Golf is a good walk spoiled	Mark Twain
37	No matter how good you get, you can always get better — and that's the exciting part.	Tiger Woods
38	The woods are full of long drivers.	Harvey Penick
39	I don't think it's healthy to take yourself too seriously.	Payne Stewart
40	If profanity had an influence on the flight of the ball, the game of golf would be played far better than it is.	Horace G. Hutchinson
41	If a lot of people gripped a knife and fork the way they do a golf club, they'd starve to death.	Sam Snead
42	What other people may find in poetry or art museums, I find in the flight of a good drive.	Arnold Palmer
43	The golf swing is like a suitcase into which we are trying to pack one too many things.	John Updike
44	Golf is not, on the whole, a game for realists. By its exactitude's of measurements, it invites the attention of perfectionists.	Heywood Hale Broun
45	If you wish to hide your character, do not play golf.	Percey Boomer
46	Golf is deceptively simple and endlessly complicated.	Arnold Palmer
47	Golf tips are like Aspirin: One may do you good, but if you swallow the whole bottle you'll be lucky to survive.	Harvey Penick
48	I never learned anything from a match that I won.	Bobby Jones
49	It's how you deal with failure that determines how you achieve success.	David Feherty
50	Golf is a game whose aim is to hit a very small ball into an even smaller hole, with weapons singularly ill-designed for the purpose.	Winston Churchill
51	Golf is played by twenty million mature American men whose wives think they are out having fun.	Jim Bishop
52	My swing is so bad, I look like a caveman killing his lunch.	Lee Trevino
53	You've got to have the guts not to be afraid to screw up.	Fuzzy Zoeller
54	Golf appeals to the idiot in us and the child. Just how childlike golfers become is proven by their frequent inability to count past five.	John Updike
55	Tempo is the glue that sticks all elements of the golf swing together.	Nick Faldo
56	Don't play too much golf. Two rounds a day are plenty.	Harry Vardon
57	The only time my prayers are never answered is on the golf course.	Billy Graham
58	Confidence is the most important single factor in this game, and no matter how great your natural talent, there is only one way to obtain and sustain it: work.	Jack Nicklaus
59	Golf is the hardest game in the world. There is no way you can ever get it. Just when you think you do, the game jumps up and puts you in your place.	Ben Crenshaw
60	The ardent golfer would play Mount Everest if somebody put a flagstick on top.	Pete Dye
61	They call it golf because all the other four letter words were taken.	Raymond Floyd
62	Success in golf depends less on strength of body than upon strength of mind and character.	Arnold Palmer
63	I look into eyes, shake their hand, pat their back, and wish them luck, but I am thinking, I am going to bury you.	Seve Ballesteros
64	Watching Phil Mickelson play golf is like watching a drunk chasing a balloon near the edge of a cliff.	David Feherty
65	Golf is the most fun you can have without taking your clothes off.	Chi Chi Rodriguez
66	If you're caught on a golf course during a storm and are afraid of lightning, hold up a 1-iron. Not even God can hit a 1-iron.	Lee Trevino
67	The more I practice, the luckier I get.	Gary Player
68	Life is not fair, so why should I make a course that is fair.	Pete Dye
69	A great shot is when you pull it off. A smart shot is when you don't have the guts to try it.	Phil Mickelson
70	A bad attitude is worse than a bad swing.	Payne Stewart
71	Don't be too proud to take lessons. I'm not.	Jack Nicklaus
72	Happiness is a long walk with a putter	Greg Norman
73	The most important shot in golf is the next one.	Ben Hogan
74	Golf is assuredly a mystifying game. It would seem that if a person has hit a golf ball correctly a thousand times, he should be able to duplicate the performance at will. But such is certainly not the case.	Bobby Jones
75	Golf can best be defined as an endless series of tragedies obscured by the occasional miracle.	Anonymous
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, created_at, used) FROM stdin;
\.


--
-- Data for Name: player_cards; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.player_cards (id, player_id, play_date, course_id, ext_id, clima, week_day, category, g_differential, post, judges, hcpi, hcp, ida, vta, gross, net, tarj, bir, par, bog, bg2, bg3g, plus_bg3, putts, tee_id, h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, verified, created_at) FROM stdin;
13	1	2023-05-04	2	26803	\N	4	Unica	73.4	6	\N	20.3	22	51	48	99	77	OK	\N	2	10	3	3	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
4	1	2024-10-30	6	26816	\N	lad	Unica	70.8	\N	\N	20.9	21	51	49	100	79	OK	1	1	7	5	4	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
21	1	2022-08-18	6	26816	\N	4	Unica	71.3	2	\N	20.9	22	52	48	100	78	OK	\N	\N	11	5	1	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
18	1	2022-10-20	3	26821	\N	4	Unica	73.4	5	\N	21.4	25	50	46	96	71	OK	\N	4	7	5	1	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
25	1	2022-03-20	3	26821	\N	7	Unica	73.4	\N	\N	27	31	50	47	97	66	OK	\N	\N	\N	\N	2	16	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
26	1	2021-12-12	3	26821	\N	7	Unica	73.4	\N	\N	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
30	1	2021-03-21	3	26821	\N	7	Unica	73.4	\N	\N	27	25	51	46	97	72	OK	1	2	6	8	\N	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
5	1	2024-10-17	4	26832	\N	4	-8.0-54.0	72.2	\N	\N	20.9	20	49	50	99	79	OK	\N	5	6	4	2	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
6	1	2024-07-12	5	26853	\N	5	Unica	73.1	20	\N	20.4	22	54	57	111	89	OK	\N	2	6	5	2	3	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
12	1	2023-07-02	10	28287	\N	7	Unificada	73.9	4	\N	20.3	25	52	50	102	77	OK	\N	lad	4	8	2	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
11	1	2023-08-27	10	28749	\N	7	Unica	70.7	34	\N	20.3	19	54	46	100	81	OK	\N	5	5	3	3	2	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
3	1	2024-11-24	11	28759	\N	7	Unica	73.2	\N	18 (17/1)	21	24	47	0	0	0	DES	1	\N	2	3	2	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
22	1	2022-08-03	11	28759	\N	lad	Unica	73.2	\N	5 (4/1)	19.9	23	50	55	105	82	OK	1	2	5	3	6	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
27	1	2021-12-01	11	28759	\N	lad	Unica	73.2	\N	14 (13/1)	27	31	53	52	105	74	OK	\N	\N	8	8	\N	2	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
31	1	2016-10-30	11	28759	\N	7	Unica	74	\N	59 (52/7)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
32	1	2016-09-11	11	28759	\N	7	Unica	74	\N	lad8 (36/2)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
33	1	2016-08-15	11	28759	\N	1	Unica	74	\N	74 (60/14)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
34	1	2016-04-24	11	28759	\N	7	Unica	74.4	\N	104 (99/5)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
35	1	2016-03-26	11	28759	\N	6	Unica	74.4	\N	71 (63/8)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
36	1	2016-02-20	11	28759	\N	6	Unica	74.4	\N	128 (121/7)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
37	1	2016-02-09	11	28759	\N	2	Unica	74.4	\N	99 (88/11)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
38	1	2016-02-07	11	28759	\N	7	Unica	74.4	\N	46 (39/7)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
39	1	2016-01-31	11	28759	\N	7	Unica	74.4	\N	65 (59/6)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
40	1	2016-01-27	11	28759	\N	lad	Unificada	74.4	\N	lad1 (24/7)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
41	1	2016-01-03	11	28759	\N	7	Unica	74.4	\N	40 (36/4)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
42	1	2015-12-07	11	28759	\N	1	Unica	74.4	\N	112 (99/13)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
43	1	2015-07-26	11	28759	\N	7	Unica	74.4	\N	51 (48/3)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
44	1	2015-05-03	11	28759	\N	7	Unica	74	\N	58 (52/6)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
45	1	2015-04-12	11	28759	\N	7	Unica	74	\N	65 (61/4)	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
46	1	2015-03-17	11	28759	\N	2	Unificada	74	\N	0 (0/0)	28	28	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
47	1	2015-03-14	11	28759	\N	6	Unica	74	\N	68 (66/2)	28	28	50	51	101	73	OK	\N	2	11	1	2	2	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
48	1	2014-12-06	11	28759	\N	6	Unica	74	\N	106 (94/12)	28	28	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
49	1	2014-02-23	11	28759	\N	7	19-36	74.4	\N	54 (47/7)	28	28	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
50	1	2013-12-29	11	28759	\N	7	Unificada	74.4	\N	42 (38/4)	28	28	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
20	1	2022-08-28	7	29047	\N	7	Unica	72.2	\N	\N	20.4	23	55	50	105	82	OK	\N	2	7	3	4	2	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
28	1	2021-05-09	8	29052	\N	7	Unica	71.9	\N	\N	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
2	1	2025-02-23	13	29156	\N	7	Unica	74.1	\N	\N	20.7	23	48	50	98	75	OK	\N	1	12	4	1	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
8	1	2024-03-17	13	29156	\N	7	Unica	74.1	\N	\N	20.4	23	46	53	99	76	OK	\N	lad	8	6	\N	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
7	1	2024-06-02	12	29211	\N	7	Unica	73.5	\N	\N	20.3	20.3	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
10	1	2023-11-12	12	29211	\N	7	Unica	73.5	\N	\N	20.4	20.4	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
14	1	2023-04-16	12	29211	\N	7	Unificada	73.5	\N	\N	20.1	20.1	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
15	1	2023-03-19	12	29211	\N	7	Unificada	73.5	\N	\N	20.2	20.2	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
16	1	2022-11-13	12	29211	\N	7	Unica	73.5	\N	\N	20.2	20.2	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
17	1	2022-10-23	12	29211	\N	7	17.7-54.0	73.5	4	\N	21.4	26	47	48	95	69	OK	\N	lad	8	6	1	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
29	1	2021-04-11	12	29211	\N	7	17.0-54.0	73.5	\N	\N	27	27	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
19	1	2022-09-08	9	33846	\N	4	Unificada	72.7	8	\N	21.4	23	55	46	101	78	OK	\N	lad	6	7	1	1	\N	ladies	4	5	3	4	5	3	4	5	4	5	4	3	5	4	5	3	4	4	t	2025-04-30 21:52:56.230602+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password, first_name, family_name, gender, matricula, birthday, category, handicap, is_admin, is_editor, created_at) FROM stdin;
1	victoria	ns.victoria@gmail.com	$2a$06$jBl1sCT.oJfbGFQRj3Jd8.XYW.O1QiJ5tpnlUbmkQqrlraBCXUNvy	Victoria	Saravia	\N	\N	\N	\N	\N	t	t	2025-04-30 21:52:55.377674
2	adminuser	admin@example.com	$2a$06$DHRggD6Q9u./tT.8NThsT.Fzl7U4rJg5k8yeeBdnFVOhz6qz0q48q	Admin	User	\N	\N	\N	\N	\N	t	t	2025-04-30 21:52:55.377674
3	jwx	jeff.milton@gmail.com	$2a$06$CUO8r2vjSV69QpmCwr5U4udvlB9WkpwuwCt1KV6Dx5udlI.yD0el6	Jeff	Milton	\N	\N	\N	\N	\N	t	t	2025-04-30 21:52:55.377674
4	editor	editor@example.com	$2a$06$uPR7LimAKHyPaDJmPWHi1Ok8D7WItHx0.NIwxvlahH0W5OPg.Jgbu	Editor	User	\N	\N	\N	\N	\N	f	t	2025-04-30 21:52:55.377674
\.


--
-- Data for Name: x_course_data_by_tee; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.x_course_data_by_tee (id, course_id, tee_id, par, length, slope_rating, slope_back, slope_front, bogey_rating, bogey_rating_back, bogey_rating_front, course_rating, course_rating_back, course_rating_front) FROM stdin;
26	1	senior	72	5709	113	115	115	87.5	43.4	44.1	66.6	33.2	33.4
30	1	forward	72	5451	113	111	111	97.3	49.1	48.2	70.7	35.6	35.1
28	1	regular	72	6385	121	124	124	92.1	45.7	46.4	69.6	34.7	34.9
29	1	professional	72	7360	126	129	129	98.7	48.7	50.0	75.4	37.4	38.0
27	1	skilled	72	6956	118	119	119	94.9	46.9	48.0	73.0	36.1	36.9
9	3	skilled	72	6887	119	115	115	94.3	47.5	46.8	72.3	36.2	36.1
8	3	senior	72	6343	119	115	115	91.8	46.4	45.4	69.8	35.1	34.7
12	3	beginner	72	5396	118	118	118	98.3	49.3	49.0	70.5	35.4	35.1
10	3	regular	72	6624	121	118	118	93.4	46.9	46.5	71.0	35.5	35.5
11	3	forward	72	5875	122	125	125	102.0	50.4	51.6	73.4	36.5	36.9
16	4	regular	72	6402	116	114	114	91.1	47.2	43.9	69.5	36.2	33.3
19	4	ladies	73	5699	123	117	117	101.2	53.0	48.2	72.2	37.8	34.4
18	4	ladies	71	5699	114	112	112	87.6	45.4	42.2	66.5	34.7	31.8
15	4	skilled	72	6618	122	116	116	93.8	48.8	45.0	71.1	36.9	34.2
14	4	senior	73	5952	124	118	118	102.7	53.9	48.8	73.5	38.6	34.9
17	4	professional	72	6878	128	119	119	95.8	49.9	45.9	72.1	37.3	34.8
13	4	senior	72	5941	116	112	112	88.8	46.4	42.4	67.3	35.3	32.0
20	5	skilled	73	6629	129	128	128	95.8	48.5	47.3	71.9	36.5	35.4
23	5	forward	74	5751	129	127	127	103.4	52.2	51.2	73.1	36.9	36.2
22	5	ladies	73	5751	115	112	112	88.6	44.7	43.9	67.3	33.8	33.5
21	5	regular	73	6433	126	124	124	94.3	47.9	46.4	70.9	36.0	34.9
4	6	regular	72	6203	123	117	117	92.6	46.6	46.0	69.7	34.6	35.1
5	6	professional	72	6714	124	118	118	95.6	48.4	47.2	72.5	36.3	36.2
1	6	senior	72	5742	122	119	119	89.8	45.0	44.8	67.2	33.5	33.7
2	6	senior	72	5742	125	122	122	102.5	51.4	51.1	73.1	36.4	36.7
3	6	skilled	72	6461	123	119	119	93.9	47.0	46.9	71.1	35.3	35.8
7	6	ladies	72	5389	121	119	119	99.3	49.5	49.8	70.8	35.0	35.8
6	6	ladies	72	5389	113	113	113	86.5	43.0	43.5	65.5	32.5	33.0
38	7	ladies	72	5670	114	116	116	87.8	43.8	44.0	66.6	33.4	33.2
39	7	forward	72	5670	126	126	126	101.7	50.8	50.9	72.2	36.1	36.1
35	7	senior	72	6261	124	124	124	92.5	46.2	46.3	69.6	34.8	34.8
37	7	regular	72	6608	126	126	126	94.7	47.0	47.7	71.4	35.4	36.0
36	7	skilled	72	7041	125	125	125	96.9	47.8	49.1	73.8	36.3	37.5
40	8	senior	72	6283	123	121	121	92.5	46.3	46.2	69.8	34.8	35.0
44	8	ladies	72	5596	125	123	123	101.2	50.9	50.3	71.9	36.1	35.8
42	8	regular	72	6625	127	127	127	95.2	47.7	47.5	71.7	36.0	35.7
41	8	skilled	72	7070	125	126	126	97.3	49.0	48.3	74.1	37.5	36.6
43	8	ladies	72	5596	115	113	113	87.5	44.0	43.5	66.2	33.2	33.0
25	10	forward	72	5787	123	120	120	102.2	51.7	50.5	73.3	37.0	36.3
24	10	regular	72	6369	115	117	117	91.8	45.9	45.9	70.5	35.5	35.0
33	11	forward	73	5698	129	127	127	103.6	52.4	51.2	73.2	37.0	36.2
32	11	professional	72	6611	134	142	142	96.4	47.3	49.1	71.5	35.6	35.9
34	11	skilled	72	7052	139	140	140	99.6	49.8	49.8	73.8	37.0	36.8
31	11	regular	72	6318	128	131	131	93.9	46.7	47.2	70.1	35.1	35.0
45	12	senior	72	5978	121	126	126	91.0	44.7	46.3	68.5	33.9	34.6
49	12	forward	72	5869	130	130	130	104.0	51.5	52.5	73.5	36.3	37.2
48	12	professional	72	7001	129	131	131	97.6	49.1	48.5	73.7	37.4	36.3
47	12	regular	72	6493	126	126	126	94.3	46.9	47.4	71.0	35.3	35.7
46	12	skilled	72	6694	126	127	127	95.4	47.5	47.9	72.0	35.9	36.1
\.


--
-- Data for Name: x_course_holes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.x_course_holes (id, course_id, hole_number, par, men_stroke_index, women_stroke_index) FROM stdin;
1	11	1	4	5	3
2	11	2	5	1	1
3	11	3	4	17	15
4	11	4	3	9	13
5	11	5	4	13	11
6	11	6	5	15	7
7	11	7	4	7	5
8	11	8	4	3	17
9	11	9	3	11	9
10	11	10	5	6	6
11	11	11	4	10	12
12	11	12	4	8	8
13	11	13	4	2	2
14	11	14	4	4	4
15	11	15	3	18	18
16	11	16	4	12	10
17	11	17	3	16	16
18	11	18	5	14	14
19	12	1	4	3	3
20	12	2	4	9	9
21	12	3	3	13	13
22	12	4	5	11	11
23	12	5	4	7	7
24	12	6	4	15	15
25	12	7	5	5	5
26	12	8	4	1	1
27	12	9	3	17	17
28	12	10	4	14	14
29	12	11	5	2	2
30	12	12	4	18	18
31	12	13	3	10	10
32	12	14	4	12	12
33	12	15	3	16	16
34	12	16	5	4	4
35	12	17	4	6	6
36	12	18	4	8	8
37	13	1	4	17	17
38	13	2	5	3	3
39	13	3	4	15	15
40	13	4	3	1	1
41	13	5	4	7	7
42	13	6	3	9	9
43	13	7	4	5	5
44	13	8	5	11	11
45	13	9	4	13	13
46	13	10	4	12	12
47	13	11	4	8	8
48	13	12	5	2	2
49	13	13	3	18	18
50	13	14	4	4	4
51	13	15	3	10	10
52	13	16	5	6	6
53	13	17	4	16	16
54	13	18	4	14	14
\.


--
-- Data for Name: x_course_names; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.x_course_names (id, course_id, course_name, address1, address2, city, province, country_code, telephone, email) FROM stdin;
1	1	GOLF SAN SEBASTIAN	AGUSTIN GARCIA 9501	\N	BENAVIDEZ	AR-B	11	\N	\N
2	2	GOLF CLUB ARGENTINO	RUTA 8 KM. 41,500	\N	JOSE C. PAZ	AR-B	11	\N	\N
3	3	HIGHLAND PARK COUNTRY CLUB	AV LOS JAZMINES Y LAS CAMPANILLAS	\N	DEL VISO	AR-B	11	\N	\N
4	4	LOS LAGARTOS COUNTRY CLUB - 120	LOS LAGARTOS COUNTRY CLUB (Agua - Larga)	RUTA PANAM. KM 45,500 ACC. NORTE	PILAR	AR-B	11	\N	\N
5	5	RANELAGH GOLF CLUB	AV. ESTE 901 Y CALLE 359	\N	RANELAGH	AR-B	11	\N	\N
6	6	TORTUGAS COUNTRY CLUB	AU PANAM. KM 37,500 ACC. A PILAR	\N	TORTUGUITAS	AR-B	11	\N	\N
7	7	CLUB C. DE G. LAS PRADERAS DE LUJAN - 132	CLUB C. DE G. LAS PRADERAS DE LUJAN (Betula - Lujan)	RUTA 192 KM. 6,500	LUJAN	AR-B	11	\N	\N
8	8	CLUB C. DE G. LAS PRADERAS DE LUJAN - 132	CLUB C. DE G. LAS PRADERAS DE LUJAN (Cañada - Betulas)	RUTA 192 KM. 6,500	LUJAN	AR-B	11	\N	\N
9	9	CLUB NEWMAN	AV DE LOS CONSTITUYENTES 7245	\N	BENAVIDEZ	AR-B	11	\N	\N
10	10	LARENA COUNTRY CLUB	RUTA PROV. 6 KM 176	\N	PILAR	AR-B	11	\N	\N
11	11	CAMPO DE GOLF LA ORQUIDEA	600 M. DE RUTA 6 CNO.CAP. DEL SENOR	\N	LOS CARDALES	AR-B	11	\N	\N
12	12	LA COLINA GOLF CLUB	RUTA 6 RIO LUAN OPEN DOOR	\N	LUJAN	AR-B	11	\N	\N
13	13	EVERLINKS CLUB DE GOLF	BESCHEDT 4200	\N	LUJAN	AR-B	11	\N	\N
\.


--
-- Data for Name: x_course_tee_types; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.x_course_tee_types (id, course_id, tee_id, tee_color, tee_name, tee_desc) FROM stdin;
1	11	professional	black	Negro	tournaments (hardest) | Longest (Championship) 
2	11	skilled	blue	Azul	Men (regular, strong amateurs)     | Long 
3	11	senior	gold	Amarillo	 Senior men / Low-handicap amateurs | Slightly shorter
4	11	regular	white	Blanco	Men (standard amateur play)        | Medium
5	11	beginner	green	Verde	 Beginners / Very seniors           | Short (optional, not always present)
6	11	ladies	red	Rojo	Women                             | Shortest 
\.


--
-- Name: golf_quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.golf_quotes_id_seq', 75, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- Name: player_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.player_cards_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: x_course_data_by_tee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.x_course_data_by_tee_id_seq', 1, false);


--
-- Name: x_course_holes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.x_course_holes_id_seq', 1, false);


--
-- Name: x_course_names_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.x_course_names_id_seq', 1, false);


--
-- Name: x_course_tee_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.x_course_tee_types_id_seq', 1, false);


--
-- Name: golf_quotes golf_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.golf_quotes
    ADD CONSTRAINT golf_quotes_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: player_cards player_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards
    ADD CONSTRAINT player_cards_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: x_course_data_by_tee x_course_data_by_tee_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_data_by_tee
    ADD CONSTRAINT x_course_data_by_tee_pkey PRIMARY KEY (id);


--
-- Name: x_course_holes x_course_holes_course_id_hole_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_holes
    ADD CONSTRAINT x_course_holes_course_id_hole_number_key UNIQUE (course_id, hole_number);


--
-- Name: x_course_holes x_course_holes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_holes
    ADD CONSTRAINT x_course_holes_pkey PRIMARY KEY (id);


--
-- Name: x_course_names x_course_names_course_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_names
    ADD CONSTRAINT x_course_names_course_id_key UNIQUE (course_id);


--
-- Name: x_course_names x_course_names_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_names
    ADD CONSTRAINT x_course_names_pkey PRIMARY KEY (id);


--
-- Name: x_course_tee_types x_course_tee_types_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_tee_types
    ADD CONSTRAINT x_course_tee_types_pkey PRIMARY KEY (id);


--
-- Name: x_course_tee_types x_course_tee_types_tee_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_tee_types
    ADD CONSTRAINT x_course_tee_types_tee_id_key UNIQUE (tee_id);


--
-- Name: idx_password_reset_tokens_token; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens USING btree (token);


--
-- Name: idx_password_reset_tokens_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_player_cards_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_course_id ON public.player_cards USING btree (course_id);


--
-- Name: idx_player_cards_differential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_differential ON public.player_cards USING btree (g_differential);


--
-- Name: idx_player_cards_play_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_play_date ON public.player_cards USING btree (play_date);


--
-- Name: idx_player_cards_player_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_player_id ON public.player_cards USING btree (player_id);


--
-- Name: idx_player_cards_tarj; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_tarj ON public.player_cards USING btree (tarj);


--
-- Name: idx_player_cards_verified; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_verified ON public.player_cards USING btree (verified);


--
-- Name: idx_users_category; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_category ON public.users USING btree (category);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_first_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_first_name ON public.users USING btree (first_name);


--
-- Name: idx_users_is_admin; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_is_admin ON public.users USING btree (is_admin);


--
-- Name: idx_users_is_editor; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_is_editor ON public.users USING btree (is_editor);


--
-- Name: idx_users_matricula; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_matricula ON public.users USING btree (matricula);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_x_course_data_by_tee_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_data_by_tee_course_id ON public.x_course_data_by_tee USING btree (course_id);


--
-- Name: idx_x_course_data_by_tee_tee_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_data_by_tee_tee_id ON public.x_course_data_by_tee USING btree (tee_id);


--
-- Name: idx_x_course_holes_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_holes_course_id ON public.x_course_holes USING btree (course_id);


--
-- Name: idx_x_course_names_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_names_course_id ON public.x_course_names USING btree (course_id);


--
-- Name: idx_x_course_names_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_names_name ON public.x_course_names USING btree (course_name);


--
-- Name: idx_x_course_tee_types_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_tee_types_course_id ON public.x_course_tee_types USING btree (course_id);


--
-- Name: idx_x_course_tee_types_tee_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_x_course_tee_types_tee_id ON public.x_course_tee_types USING btree (tee_id);


--
-- Name: player_cards player_cards_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards
    ADD CONSTRAINT player_cards_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.x_course_names(course_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: player_cards player_cards_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards
    ADD CONSTRAINT player_cards_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: player_cards player_cards_tee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards
    ADD CONSTRAINT player_cards_tee_id_fkey FOREIGN KEY (tee_id) REFERENCES public.x_course_tee_types(tee_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: x_course_holes x_course_holes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_holes
    ADD CONSTRAINT x_course_holes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.x_course_names(course_id);


--
-- Name: x_course_tee_types x_course_tee_types_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.x_course_tee_types
    ADD CONSTRAINT x_course_tee_types_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.x_course_names(course_id);


--
-- PostgreSQL database dump complete
--

