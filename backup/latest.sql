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

ALTER TABLE ONLY public.todos DROP CONSTRAINT todos_user_id_fkey;
ALTER TABLE ONLY public.tee_boxes DROP CONSTRAINT tee_boxes_course_id_fkey;
ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_user_id_fkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_created_by_fkey;
ALTER TABLE ONLY public.course_holes DROP CONSTRAINT course_holes_course_id_fkey;
ALTER TABLE ONLY public.course_attachments DROP CONSTRAINT course_attachments_uploaded_by_fkey;
ALTER TABLE ONLY public.course_attachments DROP CONSTRAINT course_attachments_course_id_fkey;
DROP INDEX public.idx_users_username;
DROP INDEX public.idx_users_matricula;
DROP INDEX public.idx_users_is_admin;
DROP INDEX public.idx_users_email;
DROP INDEX public.idx_todos_user_id;
DROP INDEX public.idx_tee_boxes_course_id;
DROP INDEX public.idx_password_reset_tokens_user_id;
DROP INDEX public.idx_password_reset_tokens_token;
DROP INDEX public.idx_courses_website;
DROP INDEX public.idx_courses_name;
DROP INDEX public.idx_courses_country;
DROP INDEX public.idx_course_holes_course_id;
DROP INDEX public.idx_course_attachments_course_id;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
ALTER TABLE ONLY public.todos DROP CONSTRAINT todos_pkey;
ALTER TABLE ONLY public.tee_boxes DROP CONSTRAINT tee_boxes_pkey;
ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
ALTER TABLE ONLY public.golf_quotes DROP CONSTRAINT golf_quotes_pkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_website_key;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
ALTER TABLE ONLY public.course_holes DROP CONSTRAINT course_holes_pkey;
ALTER TABLE ONLY public.course_holes DROP CONSTRAINT course_holes_course_id_hole_number_key;
ALTER TABLE ONLY public.course_attachments DROP CONSTRAINT course_attachments_pkey;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.todos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tee_boxes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.password_reset_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.golf_quotes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.courses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.course_holes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.course_attachments ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.todos_id_seq;
DROP TABLE public.todos;
DROP SEQUENCE public.tee_boxes_id_seq;
DROP TABLE public.tee_boxes;
DROP SEQUENCE public.password_reset_tokens_id_seq;
DROP TABLE public.password_reset_tokens;
DROP SEQUENCE public.golf_quotes_id_seq;
DROP TABLE public.golf_quotes;
DROP SEQUENCE public.courses_id_seq;
DROP TABLE public.courses;
DROP SEQUENCE public.course_holes_id_seq;
DROP TABLE public.course_holes;
DROP SEQUENCE public.course_attachments_id_seq;
DROP TABLE public.course_attachments;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: course_attachments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.course_attachments (
    id integer NOT NULL,
    course_id integer NOT NULL,
    attachment_type character varying(50) NOT NULL,
    file_path character varying(255) NOT NULL,
    original_filename character varying(255) NOT NULL,
    mime_type character varying(100) NOT NULL,
    file_size integer NOT NULL,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    uploaded_by integer
);


ALTER TABLE public.course_attachments OWNER TO admin;

--
-- Name: course_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.course_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_attachments_id_seq OWNER TO admin;

--
-- Name: course_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.course_attachments_id_seq OWNED BY public.course_attachments.id;


--
-- Name: course_holes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.course_holes (
    id integer NOT NULL,
    course_id integer NOT NULL,
    hole_number integer NOT NULL,
    par integer NOT NULL,
    stroke_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT course_holes_hole_number_check CHECK (((hole_number >= 1) AND (hole_number <= 18))),
    CONSTRAINT course_holes_par_check CHECK (((par >= 3) AND (par <= 6))),
    CONSTRAINT course_holes_stroke_index_check CHECK (((stroke_index >= 1) AND (stroke_index <= 18)))
);


ALTER TABLE public.course_holes OWNER TO admin;

--
-- Name: course_holes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.course_holes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_holes_id_seq OWNER TO admin;

--
-- Name: course_holes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.course_holes_id_seq OWNED BY public.course_holes.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country character varying(2) NOT NULL,
    city_province character varying(100) NOT NULL,
    website character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    is_verified boolean DEFAULT false
);


ALTER TABLE public.courses OWNER TO admin;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO admin;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


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
-- Name: tee_boxes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tee_boxes (
    id integer NOT NULL,
    course_id integer NOT NULL,
    name character varying(50) NOT NULL,
    gender character varying(10) NOT NULL,
    course_rating numeric(4,1) NOT NULL,
    slope_rating integer NOT NULL,
    yardage integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tee_boxes OWNER TO admin;

--
-- Name: tee_boxes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tee_boxes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tee_boxes_id_seq OWNER TO admin;

--
-- Name: tee_boxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tee_boxes_id_seq OWNED BY public.tee_boxes.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    user_id integer NOT NULL,
    text character varying(255) NOT NULL,
    completed boolean DEFAULT false,
    category character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.todos OWNER TO admin;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todos_id_seq OWNER TO admin;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    name character varying(100),
    family_name character varying(100),
    matricula character varying(50),
    handicap numeric(4,1),
    is_admin boolean DEFAULT false,
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
-- Name: course_attachments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_attachments ALTER COLUMN id SET DEFAULT nextval('public.course_attachments_id_seq'::regclass);


--
-- Name: course_holes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_holes ALTER COLUMN id SET DEFAULT nextval('public.course_holes_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: golf_quotes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.golf_quotes ALTER COLUMN id SET DEFAULT nextval('public.golf_quotes_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: tee_boxes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tee_boxes ALTER COLUMN id SET DEFAULT nextval('public.tee_boxes_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: course_attachments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.course_attachments (id, course_id, attachment_type, file_path, original_filename, mime_type, file_size, uploaded_at, uploaded_by) FROM stdin;
\.


--
-- Data for Name: course_holes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.course_holes (id, course_id, hole_number, par, stroke_index, created_at) FROM stdin;
1	1	1	4	9	2025-04-20 06:40:17.206132+00
2	1	2	5	11	2025-04-20 06:40:17.206132+00
3	1	3	4	7	2025-04-20 06:40:17.206132+00
4	1	4	3	17	2025-04-20 06:40:17.206132+00
5	1	5	4	5	2025-04-20 06:40:17.206132+00
6	1	6	3	15	2025-04-20 06:40:17.206132+00
7	1	7	4	3	2025-04-20 06:40:17.206132+00
8	1	8	5	13	2025-04-20 06:40:17.206132+00
9	1	9	4	1	2025-04-20 06:40:17.206132+00
10	1	10	4	2	2025-04-20 06:40:17.206132+00
11	1	11	4	8	2025-04-20 06:40:17.206132+00
12	1	12	3	16	2025-04-20 06:40:17.206132+00
13	1	13	5	12	2025-04-20 06:40:17.206132+00
14	1	14	4	10	2025-04-20 06:40:17.206132+00
15	1	15	5	14	2025-04-20 06:40:17.206132+00
16	1	16	3	18	2025-04-20 06:40:17.206132+00
17	1	17	4	6	2025-04-20 06:40:17.206132+00
18	1	18	4	4	2025-04-20 06:40:17.206132+00
19	2	1	4	10	2025-04-20 06:40:17.213851+00
20	2	2	4	14	2025-04-20 06:40:17.213851+00
21	2	3	4	2	2025-04-20 06:40:17.213851+00
22	2	4	4	8	2025-04-20 06:40:17.213851+00
23	2	5	5	12	2025-04-20 06:40:17.213851+00
24	2	6	4	4	2025-04-20 06:40:17.213851+00
25	2	7	4	6	2025-04-20 06:40:17.213851+00
26	2	8	3	16	2025-04-20 06:40:17.213851+00
27	2	9	4	18	2025-04-20 06:40:17.213851+00
28	2	10	4	9	2025-04-20 06:40:17.213851+00
29	2	11	3	17	2025-04-20 06:40:17.213851+00
30	2	12	4	5	2025-04-20 06:40:17.213851+00
31	2	13	4	1	2025-04-20 06:40:17.213851+00
32	2	14	5	11	2025-04-20 06:40:17.213851+00
33	2	15	4	7	2025-04-20 06:40:17.213851+00
34	2	16	4	15	2025-04-20 06:40:17.213851+00
35	2	17	4	3	2025-04-20 06:40:17.213851+00
36	2	18	4	13	2025-04-20 06:40:17.213851+00
37	3	1	4	9	2025-04-20 06:40:17.219671+00
38	3	2	4	7	2025-04-20 06:40:17.219671+00
39	3	3	4	15	2025-04-20 06:40:17.219671+00
40	3	4	4	3	2025-04-20 06:40:17.219671+00
41	3	5	4	13	2025-04-20 06:40:17.219671+00
42	3	6	3	17	2025-04-20 06:40:17.219671+00
43	3	7	5	5	2025-04-20 06:40:17.219671+00
44	3	8	4	11	2025-04-20 06:40:17.219671+00
45	3	9	4	1	2025-04-20 06:40:17.219671+00
46	3	10	4	2	2025-04-20 06:40:17.219671+00
47	3	11	4	10	2025-04-20 06:40:17.219671+00
48	3	12	4	4	2025-04-20 06:40:17.219671+00
49	3	13	3	18	2025-04-20 06:40:17.219671+00
50	3	14	5	12	2025-04-20 06:40:17.219671+00
51	3	15	4	6	2025-04-20 06:40:17.219671+00
52	3	16	4	14	2025-04-20 06:40:17.219671+00
53	3	17	3	16	2025-04-20 06:40:17.219671+00
54	3	18	5	8	2025-04-20 06:40:17.219671+00
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.courses (id, name, country, city_province, website, created_at, created_by, is_verified) FROM stdin;
1	Augusta National Golf Club	US	Augusta, Georgia	https://www.augustanational.com	2025-04-20 06:40:17.160985+00	\N	f
2	St Andrews Links (Old Course)	GB	St Andrews, Fife	https://www.standrews.com	2025-04-20 06:40:17.160985+00	\N	f
3	Club de Golf Los Cedros	MX	Monterrey, Nuevo León	https://www.loscedros.mx	2025-04-20 06:40:17.160985+00	\N	f
\.


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
-- Data for Name: tee_boxes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tee_boxes (id, course_id, name, gender, course_rating, slope_rating, yardage, created_at) FROM stdin;
1	1	Championship	male	78.1	137	7475	2025-04-20 06:40:17.176958+00
2	1	Tournament	male	76.2	132	7270	2025-04-20 06:40:17.176958+00
3	1	Member	male	73.5	128	6835	2025-04-20 06:40:17.176958+00
4	1	Ladies	female	76.2	135	6365	2025-04-20 06:40:17.176958+00
5	2	Championship	male	73.1	132	7305	2025-04-20 06:40:17.183035+00
6	2	White	male	72.3	127	6721	2025-04-20 06:40:17.183035+00
7	2	Green	other	70.8	125	6416	2025-04-20 06:40:17.183035+00
8	2	Red	female	74.2	129	6095	2025-04-20 06:40:17.183035+00
9	3	Azul	male	72.8	133	7105	2025-04-20 06:40:17.199032+00
10	3	Blanco	male	71.4	129	6825	2025-04-20 06:40:17.199032+00
11	3	Amarillo	other	69.5	122	6355	2025-04-20 06:40:17.199032+00
12	3	Rojo	female	72.7	130	5901	2025-04-20 06:40:17.199032+00
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.todos (id, user_id, text, completed, category, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password, name, family_name, matricula, handicap, is_admin, created_at) FROM stdin;
1	adminuser	admin@example.com	$2b$10$gOTzGjab4wD32g0758A4UOEPAFKrgYC3vx0wgOWAUnqt3MVuT3fMa	\N	\N	\N	\N	t	2025-04-20 06:40:17.435599
\.


--
-- Name: course_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.course_attachments_id_seq', 1, false);


--
-- Name: course_holes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.course_holes_id_seq', 54, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.courses_id_seq', 3, true);


--
-- Name: golf_quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.golf_quotes_id_seq', 75, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- Name: tee_boxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.tee_boxes_id_seq', 12, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.todos_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: course_attachments course_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_attachments
    ADD CONSTRAINT course_attachments_pkey PRIMARY KEY (id);


--
-- Name: course_holes course_holes_course_id_hole_number_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_holes
    ADD CONSTRAINT course_holes_course_id_hole_number_key UNIQUE (course_id, hole_number);


--
-- Name: course_holes course_holes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_holes
    ADD CONSTRAINT course_holes_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_website_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_website_key UNIQUE (website);


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
-- Name: tee_boxes tee_boxes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tee_boxes
    ADD CONSTRAINT tee_boxes_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


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
-- Name: idx_course_attachments_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_course_attachments_course_id ON public.course_attachments USING btree (course_id);


--
-- Name: idx_course_holes_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_course_holes_course_id ON public.course_holes USING btree (course_id);


--
-- Name: idx_courses_country; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_courses_country ON public.courses USING btree (country);


--
-- Name: idx_courses_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_courses_name ON public.courses USING btree (name);


--
-- Name: idx_courses_website; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_courses_website ON public.courses USING btree (website);


--
-- Name: idx_password_reset_tokens_token; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens USING btree (token);


--
-- Name: idx_password_reset_tokens_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_tee_boxes_course_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_tee_boxes_course_id ON public.tee_boxes USING btree (course_id);


--
-- Name: idx_todos_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_todos_user_id ON public.todos USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_is_admin; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_is_admin ON public.users USING btree (is_admin);


--
-- Name: idx_users_matricula; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_matricula ON public.users USING btree (matricula);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: course_attachments course_attachments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_attachments
    ADD CONSTRAINT course_attachments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_attachments course_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_attachments
    ADD CONSTRAINT course_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: course_holes course_holes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_holes
    ADD CONSTRAINT course_holes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: courses courses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tee_boxes tee_boxes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tee_boxes
    ADD CONSTRAINT tee_boxes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: todos todos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT ALL ON TABLES TO admin;


--
-- PostgreSQL database dump complete
--

