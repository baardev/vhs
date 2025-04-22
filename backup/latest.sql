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
ALTER TABLE ONLY public.player_cards DROP CONSTRAINT player_cards_course_id_fkey;
ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_user_id_fkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_created_by_fkey;
ALTER TABLE ONLY public.course_holes DROP CONSTRAINT course_holes_course_id_fkey;
ALTER TABLE ONLY public.course_data DROP CONSTRAINT course_data_course_id_fkey;
ALTER TABLE ONLY public.course_attachments DROP CONSTRAINT course_attachments_uploaded_by_fkey;
ALTER TABLE ONLY public.course_attachments DROP CONSTRAINT course_attachments_course_id_fkey;
DROP INDEX public.idx_users_username;
DROP INDEX public.idx_users_matricula;
DROP INDEX public.idx_users_is_admin;
DROP INDEX public.idx_users_first_name;
DROP INDEX public.idx_users_email;
DROP INDEX public.idx_users_category;
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
ALTER TABLE ONLY public.player_cards DROP CONSTRAINT player_cards_pkey;
ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
ALTER TABLE ONLY public.golf_quotes DROP CONSTRAINT golf_quotes_pkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_website_key;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
ALTER TABLE ONLY public.course_names DROP CONSTRAINT course_names_pkey;
ALTER TABLE ONLY public.course_names DROP CONSTRAINT course_names_courseid_key;
ALTER TABLE ONLY public.course_holes DROP CONSTRAINT course_holes_pkey;
ALTER TABLE ONLY public.course_holes DROP CONSTRAINT course_holes_course_id_hole_number_key;
ALTER TABLE ONLY public.course_data DROP CONSTRAINT course_data_pkey;
ALTER TABLE ONLY public.course_attachments DROP CONSTRAINT course_attachments_pkey;
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.todos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.tee_boxes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.player_cards ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.password_reset_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.golf_quotes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.courses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.course_names ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.course_holes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.course_data ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.course_attachments ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.users_id_seq;
DROP TABLE public.users;
DROP SEQUENCE public.todos_id_seq;
DROP TABLE public.todos;
DROP SEQUENCE public.tee_boxes_id_seq;
DROP TABLE public.tee_boxes;
DROP SEQUENCE public.player_cards_id_seq;
DROP TABLE public.player_cards;
DROP SEQUENCE public.password_reset_tokens_id_seq;
DROP TABLE public.password_reset_tokens;
DROP SEQUENCE public.golf_quotes_id_seq;
DROP TABLE public.golf_quotes;
DROP SEQUENCE public.courses_id_seq;
DROP TABLE public.courses;
DROP SEQUENCE public.course_names_id_seq;
DROP TABLE public.course_names;
DROP SEQUENCE public.course_holes_id_seq;
DROP TABLE public.course_holes;
DROP SEQUENCE public.course_data_id_seq;
DROP TABLE public.course_data;
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
-- Name: course_data; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.course_data (
    id integer NOT NULL,
    course_id integer,
    sel integer,
    tee_name text,
    gender character(1),
    par smallint,
    course_rating numeric(4,1),
    bogey_rating numeric(4,1),
    slope_rating smallint,
    rating_f numeric(4,1),
    rating_b numeric(4,1),
    front character varying(50),
    back character varying(50),
    bogey_rating_f numeric(4,1),
    bogey_rating_b numeric(4,1),
    slope_f smallint,
    slope_b smallint,
    tee_id integer,
    length integer
);


ALTER TABLE public.course_data OWNER TO admin;

--
-- Name: course_data_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.course_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_data_id_seq OWNER TO admin;

--
-- Name: course_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.course_data_id_seq OWNED BY public.course_data.id;


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
-- Name: course_names; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.course_names (
    id integer NOT NULL,
    sel integer,
    courseid integer,
    empty1 text,
    coursename text,
    facilityid integer,
    empty2 text,
    facilityname text,
    empty3 text,
    fullname text,
    address1 text,
    address2 text,
    city text,
    state character varying(15),
    country character varying(5),
    entcountrycode character varying(10),
    entstatecode character varying(10),
    legacycrpcourseid integer,
    telephone character varying(50),
    email text,
    ratings jsonb,
    statedisplay character varying(10),
    extra_column text
);


ALTER TABLE public.course_names OWNER TO admin;

--
-- Name: course_names_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.course_names_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_names_id_seq OWNER TO admin;

--
-- Name: course_names_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.course_names_id_seq OWNED BY public.course_names.id;


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
-- Name: player_cards; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.player_cards (
    id integer NOT NULL,
    player_id character varying(20),
    date date,
    course_id integer,
    clima character varying(50),
    day smallint,
    category character varying(50),
    differential numeric(5,1),
    post integer,
    judges character varying(50),
    hcpi numeric(5,1),
    hcp numeric(5,1),
    ida integer,
    vta integer,
    gross integer,
    net integer,
    tarj character varying(10),
    bir integer,
    par integer,
    bog integer,
    bg2 integer,
    bg3g integer,
    plus_bg3 integer,
    putts integer
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
    first_name character varying(100),
    family_name character varying(100),
    gender character varying(20),
    matricula character varying(50),
    birthday date,
    category character varying(50),
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
-- Name: course_data id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_data ALTER COLUMN id SET DEFAULT nextval('public.course_data_id_seq'::regclass);


--
-- Name: course_holes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_holes ALTER COLUMN id SET DEFAULT nextval('public.course_holes_id_seq'::regclass);


--
-- Name: course_names id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_names ALTER COLUMN id SET DEFAULT nextval('public.course_names_id_seq'::regclass);


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
-- Name: player_cards id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards ALTER COLUMN id SET DEFAULT nextval('public.player_cards_id_seq'::regclass);


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
-- Data for Name: course_data; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.course_data (id, course_id, sel, tee_name, gender, par, course_rating, bogey_rating, slope_rating, rating_f, rating_b, front, back, bogey_rating_f, bogey_rating_b, slope_f, slope_b, tee_id, length) FROM stdin;
1	26816	1	Amarillo Caballeros	M	72	67.2	89.8	122	33.7	33.5	33.7 / 119	33.5 / 124	44.8	45.0	119	119	369059	5742
2	26816	1	Amarillo Damas	F	72	73.1	102.5	125	36.7	36.4	36.7 / 122	36.4 / 127	51.1	51.4	122	122	725336	5742
3	26816	1	Azul	M	72	71.1	93.9	123	35.8	35.3	35.8 / 119	35.3 / 126	46.9	47.0	119	119	725321	6461
4	26816	1	Blanco	M	72	69.7	92.6	123	35.1	34.6	35.1 / 117	34.6 / 129	46.0	46.6	117	117	369058	6203
5	26816	1	Negro	M	72	72.5	95.6	124	36.2	36.3	36.2 / 118	36.3 / 130	47.2	48.4	118	118	369057	6714
6	26816	1	Rojo Caballeros	M	72	65.5	86.5	113	33.0	32.5	33.0 / 113	32.5 / 113	43.5	43.0	113	113	725396	5389
7	26816	1	Rojo Damas	F	72	70.8	99.3	121	35.8	35.0	35.8 / 119	35.0 / 123	49.8	49.5	119	119	395760	5389
8	26821	1	Amarillo	M	72	69.8	91.8	119	34.7	35.1	34.7 / 115	35.1 / 122	45.4	46.4	115	115	369023	6343
9	26821	1	Azul	M	72	72.3	94.3	119	36.1	36.2	36.1 / 115	36.2 / 122	46.8	47.5	115	115	369021	6887
10	26821	1	Blanco	M	72	71.0	93.4	121	35.5	35.5	35.5 / 118	35.5 / 123	46.5	46.9	118	118	369022	6624
11	26821	1	Rojo	F	72	73.4	102.0	122	36.9	36.5	36.9 / 125	36.5 / 118	51.6	50.4	125	125	382996	5875
12	26821	1	Verde	F	72	70.5	98.3	118	35.1	35.4	35.1 / 118	35.4 / 118	49.0	49.3	118	118	382997	5396
13	26832	1	Amarillo Caballeros	M	72	67.3	88.8	116	32.0	35.3	32.0 / 112	35.3 / 119	42.4	46.4	112	112	369043	5941
14	26832	1	Amarillo Damas	F	73	73.5	102.7	124	34.9	38.6	34.9 / 118	38.6 / 130	48.8	53.9	118	118	695565	5952
15	26832	1	Azul	M	72	71.1	93.8	122	34.2	36.9	34.2 / 116	36.9 / 128	45.0	48.8	116	116	648371	6618
16	26832	1	Blanco	M	72	69.5	91.1	116	33.3	36.2	33.3 / 114	36.2 / 118	43.9	47.2	114	114	341976	6402
17	26832	1	Negro	M	72	72.1	95.8	128	34.8	37.3	34.8 / 119	37.3 / 136	45.9	49.9	119	119	395902	6878
18	26832	1	Rojo Caballeros	M	71	66.5	87.6	114	31.8	34.7	31.8 / 112	34.7 / 115	42.2	45.4	112	112	683508	5699
19	26832	1	Rojo Damas	F	73	72.2	101.2	123	34.4	37.8	34.4 / 117	37.8 / 129	48.2	53.0	117	117	611983	5699
20	26853	1	Azul	M	73	71.9	95.8	129	35.4	36.5	35.4 / 128	36.5 / 129	47.3	48.5	128	128	344726	6629
21	26853	1	Blanco	M	73	70.9	94.3	126	34.9	36.0	34.9 / 124	36.0 / 128	46.4	47.9	124	124	344727	6433
22	26853	1	Rojo - Caballeros	M	73	67.3	88.6	115	33.5	33.8	33.5 / 112	33.8 / 117	43.9	44.7	112	112	648697	5751
23	26853	1	Rojo	F	74	73.1	103.4	129	36.2	36.9	36.2 / 127	36.9 / 130	51.2	52.2	127	127	343019	5751
24	28287	1	Blanco	M	72	70.5	91.8	115	35.0	35.5	35.0 / 117	35.5 / 112	45.9	45.9	117	117	369068	6369
25	28287	1	Rojo	F	72	73.3	102.2	123	36.3	37.0	36.3 / 120	37.0 / 125	50.5	51.7	120	120	369069	5787
26	28749	1	Amarillo	M	72	66.6	87.5	113	33.4	33.2	33.4 / 115	33.2 / 110	44.1	43.4	115	115	657873	5709
27	28749	1	Azul	M	72	73.0	94.9	118	36.9	36.1	36.9 / 119	36.1 / 116	48.0	46.9	119	119	399543	6956
28	28749	1	Blanco	M	72	69.6	92.1	121	34.9	34.7	34.9 / 124	34.7 / 118	46.4	45.7	124	124	657951	6385
29	28749	1	Negro	M	72	75.4	98.7	126	38.0	37.4	38.0 / 129	37.4 / 122	50.0	48.7	129	129	399541	7360
30	28749	1	Rojo	F	72	70.7	97.3	113	35.1	35.6	35.1 / 111	35.6 / 114	48.2	49.1	111	111	399545	5451
31	28759	1	Blanco	M	72	70.1	93.9	128	35.0	35.1	35.0 / 131	35.1 / 125	47.2	46.7	131	131	399824	6318
32	28759	1	Campeonato	M	72	71.5	96.4	134	35.9	35.6	35.9 / 142	35.6 / 126	49.1	47.3	142	142	399823	6611
33	28759	1	Rojo	F	73	73.2	103.6	129	36.2	37.0	36.2 / 127	37.0 / 131	51.2	52.4	127	127	399825	5698
34	28759	1	Scratch	M	72	73.8	99.6	139	36.8	37.0	36.8 / 140	37.0 / 138	49.8	49.8	140	140	399822	7052
35	29047	1	Amarillo	M	72	69.6	92.5	124	34.8	34.8	34.8 / 124	34.8 / 123	46.3	46.2	124	124	415966	6261
36	29047	1	Azul	M	72	73.8	96.9	125	37.5	36.3	37.5 / 125	36.3 / 124	49.1	47.8	125	125	415963	7041
37	29047	1	Blanco	M	72	71.4	94.7	126	36.0	35.4	36.0 / 126	35.4 / 125	47.7	47.0	126	126	415965	6608
38	29047	1	Rojo - Caballeros	M	72	66.6	87.8	114	33.2	33.4	33.2 / 116	33.4 / 112	44.0	43.8	116	116	648695	5670
39	29047	1	Rojo	F	72	72.2	101.7	126	36.1	36.1	36.1 / 126	36.1 / 125	50.9	50.8	126	126	415968	5670
40	29052	1	Amarillo	M	72	69.8	92.5	123	35.0	34.8	35.0 / 121	34.8 / 124	46.2	46.3	121	121	416095	6283
41	29052	1	Azul	M	72	74.1	97.3	125	36.6	37.5	36.6 / 126	37.5 / 124	48.3	49.0	126	126	416092	7070
42	29052	1	Blanco	M	72	71.7	95.2	127	35.7	36.0	35.7 / 127	36.0 / 126	47.5	47.7	127	127	416094	6625
43	29052	1	Rojo Caballeros	M	72	66.2	87.5	115	33.0	33.2	33.0 / 113	33.2 / 116	43.5	44.0	113	113	709801	5596
44	29052	1	Rojo Damas	F	72	71.9	101.2	125	35.8	36.1	35.8 / 123	36.1 / 126	50.3	50.9	123	123	416096	5596
45	29211	1	Amarillo	M	72	68.5	91.0	121	34.6	33.9	34.6 / 126	33.9 / 116	46.3	44.7	126	126	428115	5978
46	29211	1	Azul	M	72	72.0	95.4	126	36.1	35.9	36.1 / 127	35.9 / 125	47.9	47.5	127	127	428118	6694
47	29211	1	Blanco	M	72	71.0	94.3	126	35.7	35.3	35.7 / 126	35.3 / 125	47.4	46.9	126	126	428119	6493
48	29211	1	Negro	M	72	73.7	97.6	129	36.3	37.4	36.3 / 131	37.4 / 126	48.5	49.1	131	131	428104	7001
49	29211	1	Rojo	F	72	73.5	104.0	130	37.2	36.3	37.2 / 130	36.3 / 129	52.5	51.5	130	130	428116	5869
\.


--
-- Data for Name: course_holes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.course_holes (id, course_id, hole_number, par, stroke_index, created_at) FROM stdin;
1	1	1	4	9	2025-04-21 05:03:55.102764+00
2	1	2	5	11	2025-04-21 05:03:55.102764+00
3	1	3	4	7	2025-04-21 05:03:55.102764+00
4	1	4	3	17	2025-04-21 05:03:55.102764+00
5	1	5	4	5	2025-04-21 05:03:55.102764+00
6	1	6	3	15	2025-04-21 05:03:55.102764+00
7	1	7	4	3	2025-04-21 05:03:55.102764+00
8	1	8	5	13	2025-04-21 05:03:55.102764+00
9	1	9	4	1	2025-04-21 05:03:55.102764+00
10	1	10	4	2	2025-04-21 05:03:55.102764+00
11	1	11	4	8	2025-04-21 05:03:55.102764+00
12	1	12	3	16	2025-04-21 05:03:55.102764+00
13	1	13	5	12	2025-04-21 05:03:55.102764+00
14	1	14	4	10	2025-04-21 05:03:55.102764+00
15	1	15	5	14	2025-04-21 05:03:55.102764+00
16	1	16	3	18	2025-04-21 05:03:55.102764+00
17	1	17	4	6	2025-04-21 05:03:55.102764+00
18	1	18	4	4	2025-04-21 05:03:55.102764+00
19	2	1	4	10	2025-04-21 05:03:55.12079+00
20	2	2	4	14	2025-04-21 05:03:55.12079+00
21	2	3	4	2	2025-04-21 05:03:55.12079+00
22	2	4	4	8	2025-04-21 05:03:55.12079+00
23	2	5	5	12	2025-04-21 05:03:55.12079+00
24	2	6	4	4	2025-04-21 05:03:55.12079+00
25	2	7	4	6	2025-04-21 05:03:55.12079+00
26	2	8	3	16	2025-04-21 05:03:55.12079+00
27	2	9	4	18	2025-04-21 05:03:55.12079+00
28	2	10	4	9	2025-04-21 05:03:55.12079+00
29	2	11	3	17	2025-04-21 05:03:55.12079+00
30	2	12	4	5	2025-04-21 05:03:55.12079+00
31	2	13	4	1	2025-04-21 05:03:55.12079+00
32	2	14	5	11	2025-04-21 05:03:55.12079+00
33	2	15	4	7	2025-04-21 05:03:55.12079+00
34	2	16	4	15	2025-04-21 05:03:55.12079+00
35	2	17	4	3	2025-04-21 05:03:55.12079+00
36	2	18	4	13	2025-04-21 05:03:55.12079+00
37	3	1	4	9	2025-04-21 05:03:55.125302+00
38	3	2	4	7	2025-04-21 05:03:55.125302+00
39	3	3	4	15	2025-04-21 05:03:55.125302+00
40	3	4	4	3	2025-04-21 05:03:55.125302+00
41	3	5	4	13	2025-04-21 05:03:55.125302+00
42	3	6	3	17	2025-04-21 05:03:55.125302+00
43	3	7	5	5	2025-04-21 05:03:55.125302+00
44	3	8	4	11	2025-04-21 05:03:55.125302+00
45	3	9	4	1	2025-04-21 05:03:55.125302+00
46	3	10	4	2	2025-04-21 05:03:55.125302+00
47	3	11	4	10	2025-04-21 05:03:55.125302+00
48	3	12	4	4	2025-04-21 05:03:55.125302+00
49	3	13	3	18	2025-04-21 05:03:55.125302+00
50	3	14	5	12	2025-04-21 05:03:55.125302+00
51	3	15	4	6	2025-04-21 05:03:55.125302+00
52	3	16	4	14	2025-04-21 05:03:55.125302+00
53	3	17	3	16	2025-04-21 05:03:55.125302+00
54	3	18	5	8	2025-04-21 05:03:55.125302+00
\.


--
-- Data for Name: course_names; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.course_names (id, sel, courseid, empty1, coursename, facilityid, empty2, facilityname, empty3, fullname, address1, address2, city, state, country, entcountrycode, entstatecode, legacycrpcourseid, telephone, email, ratings, statedisplay, extra_column) FROM stdin;
1	1	28749	56	GOLF SAN SEBASTIAN	23595	56	GOLF SAN SEBASTIAN	56	GOLF SAN SEBASTIAN	AGUSTIN GARCIA 9501	\N	BENAVIDEZ	AR-B	ARG	11	200052	48544	\N	\N	[]	AR-B	
2	1	26803	109	GOLF CLUB ARGENTINO	22169	109	GOLF CLUB ARGENTINO	109	GOLF CLUB ARGENTINO	RUTA 8 KM. 41,500	\N	JOSE C. PAZ	AR-B	ARG	11	200052	47399	\N	\N	[]	AR-B	
3	1	26821	113	HIGHLAND PARK COUNTRY CLUB	22175	113	HIGHLAND PARK COUNTRY CLUB	113	HIGHLAND PARK COUNTRY CLUB	AV LOS JAZMINES Y LAS CAMPANILLAS	\N	DEL VISO	AR-B	ARG	11	200052	47418	\N	\N	[]	AR-B	
4	1	26832	120	LOS LAGARTOS COUNTRY CLUB (Agua - Larga)	22177	120	LOS LAGARTOS COUNTRY CLUB	120	LOS LAGARTOS COUNTRY CLUB - 120	LOS LAGARTOS COUNTRY CLUB (Agua - Larga)	RUTA PANAM. KM 45,500 ACC. NORTE	\N	PILAR	AR-B	ARG	11	200052	47428	\N	\N	[]	AR-B
5	1	26853	122	RANELAGH GOLF CLUB	22181	122	RANELAGH GOLF CLUB	122	RANELAGH GOLF CLUB	AV. ESTE 901 Y CALLE 359	\N	RANELAGH	AR-B	ARG	11	200052	47451	\N	\N	[]	AR-B	
6	1	26816	127	TORTUGAS COUNTRY CLUB	22171	127	TORTUGAS COUNTRY CLUB	127	TORTUGAS COUNTRY CLUB	AU PANAM. KM 37,500 ACC. A PILAR	\N	TORTUGUITAS	AR-B	ARG	11	200052	47412	\N	\N	[]	AR-B	
7	1	29047	132	CLUB C. DE G. LAS PRADERAS DE LUJAN (Betula - Lujan)	23719	132	CLUB C. DE G. LAS PRADERAS DE LUJAN	132	CLUB C. DE G. LAS PRADERAS DE LUJAN - 132	CLUB C. DE G. LAS PRADERAS DE LUJAN (Betula - Lujan)	RUTA 192 KM. 6,500	\N	LUJAN	AR-B	ARG	11	200052	48857	\N	\N	[]	AR-B
8	1	29052	132	CLUB C. DE G. LAS PRADERAS DE LUJAN (Cañada - Betulas)	23719	132	CLUB C. DE G. LAS PRADERAS DE LUJAN	132	CLUB C. DE G. LAS PRADERAS DE LUJAN - 132	CLUB C. DE G. LAS PRADERAS DE LUJAN (Cañada - Betulas)	RUTA 192 KM. 6,500	\N	LUJAN	AR-B	ARG	11	200052	48862	\N	\N	[]	AR-B
9	1	33846	135	CLUB NEWMAN	22204	135	CLUB NEWMAN	135	CLUB NEWMAN	AV DE LOS CONSTITUYENTES 7245	\N	BENAVIDEZ	AR-B	ARG	11	200052	\N	\N	\N	[]	AR-B	
10	1	28287	136	LARENA COUNTRY CLUB	23378	136	LARENA COUNTRY CLUB	136	LARENA COUNTRY CLUB	RUTA PROV. 6 KM 176	\N	PILAR	AR-B	ARG	11	200052	47965	\N	\N	[]	AR-B	
11	1	28759	158	CAMPO DE GOLF LA ORQUIDEA	23602	158	CAMPO DE GOLF LA ORQUIDEA	158	CAMPO DE GOLF LA ORQUIDEA	600	M. DE RUTA 6 CNO.CAP. DEL SENOR	\N	LOS CARDALES	AR-B	ARG	11	200052	48554	\N	\N	[]	AR-B
12	1	29211	180	LA COLINA GOLF CLUB	23847	180	LA COLINA GOLF CLUB	180	LA COLINA GOLF CLUB	RUTA 6 RIO LUAN OPEN DOOR	\N	LUJAN	AR-B	ARG	11	200052	49019	\N	\N	[]	AR-B	
13	1	29156	197	EVERLINKS CLUB DE GOLF	23815	197	EVERLINKS CLUB DE GOLF	197	EVERLINKS CLUB DE GOLF	BESCHEDT 4200	\N	LUJAN	AR-B	ARG	11	200052	48965	\N	\N	[]	AR-B	
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.courses (id, name, country, city_province, website, created_at, created_by, is_verified) FROM stdin;
1	Augusta National Golf Club	US	Augusta, Georgia	https://www.augustanational.com	2025-04-21 05:03:55.07085+00	\N	f
2	St Andrews Links (Old Course)	GB	St Andrews, Fife	https://www.standrews.com	2025-04-21 05:03:55.07085+00	\N	f
3	Club de Golf Los Cedros	MX	Monterrey, Nuevo León	https://www.loscedros.mx	2025-04-21 05:03:55.07085+00	\N	f
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
-- Data for Name: player_cards; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.player_cards (id, player_id, date, course_id, clima, day, category, differential, post, judges, hcpi, hcp, ida, vta, gross, net, tarj, bir, par, bog, bg2, bg3g, plus_bg3, putts) FROM stdin;
2	vns	2025-02-23	29156	\N	7	Unica	74.1	\N	\N	20.7	23.0	48	50	98	75	OK	\N	1	12	4	1	\N	\N
3	vns	2024-11-24	28759	\N	7	Unica	73.2	\N	18 (17/1)	21.0	24.0	47	0	0	0	DES	1	\N	2	3	2	\N	\N
4	vns	2024-10-30	26816	\N	3	Unica	70.8	\N	\N	20.9	21.0	51	49	100	79	OK	1	1	7	5	4	\N	\N
5	vns	2024-10-17	26832	\N	4	-8.0-54.0	72.2	\N	\N	20.9	20.0	49	50	99	79	OK	\N	5	6	4	2	1	\N
6	vns	2024-07-12	26853	\N	5	Unica	73.1	20	\N	20.4	22.0	54	57	111	89	OK	\N	2	6	5	2	3	\N
7	vns	2024-06-12	26853	\N	3	Unica	73.1	5	\N	20.3	22.0	54	52	106	84	OK	\N	\N	7	8	3	\N	\N
8	vns	2024-06-02	29211	\N	7	Unica	73.5	\N	\N	20.3	20.3	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
9	vns	2024-03-17	29156	\N	7	Unica	74.1	\N	\N	20.4	23.0	46	53	99	76	OK	\N	3	8	6	\N	1	\N
10	vns	2023-11-12	29211	\N	7	Unica	73.5	\N	\N	20.4	20.4	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
11	vns	2023-08-27	28749	\N	7	Unica	70.7	34	\N	20.3	19.0	54	46	100	81	OK	\N	5	5	3	3	2	\N
12	vns	2023-07-02	28287	\N	7	Unificada	73.9	4	\N	20.3	25.0	52	50	102	77	OK	\N	3	4	8	2	1	\N
13	vns	2023-05-04	26803	\N	4	Unica	73.4	6	\N	20.3	22.0	51	48	99	77	OK	\N	2	10	3	3	\N	\N
14	vns	2023-04-16	29211	\N	7	Unificada	73.5	\N	\N	20.1	20.1	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
15	vns	2023-03-19	29211	\N	7	Unificada	73.5	\N	\N	20.2	20.2	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
16	vns	2022-11-13	29211	\N	7	Unica	73.5	\N	\N	20.2	20.2	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
17	vns	2022-10-23	29211	\N	7	17.7-54.0	73.5	4	\N	21.4	26.0	47	48	95	69	OK	\N	3	8	6	1	\N	\N
18	vns	2022-10-20	26821	\N	4	Unica	73.4	5	\N	21.4	25.0	50	46	96	71	OK	\N	4	7	5	1	1	\N
19	vns	2022-09-08	33846	\N	4	Unificada	72.7	8	\N	21.4	23.0	55	46	101	78	OK	\N	3	6	7	1	1	\N
20	vns	2022-08-28	29047	\N	7	Unica	72.2	\N	\N	20.4	23.0	55	50	105	82	OK	\N	2	7	3	4	2	\N
21	vns	2022-08-18	26816	\N	4	Unica	71.3	2	\N	20.9	22.0	52	48	100	78	OK	\N	\N	11	5	1	1	\N
22	vns	2022-08-03	28759	\N	3	Unica	73.2	\N	5 (4/1)	19.9	23.0	50	55	105	82	OK	1	2	5	3	6	1	\N
25	vns	2022-03-20	26821	\N	7	Unica	73.4	\N	\N	27.0	31.0	50	47	97	66	OK	\N	\N	\N	\N	2	16	\N
26	vns	2021-12-12	26821	\N	7	Unica	73.4	\N	\N	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
27	vns	2021-12-01	28759	\N	3	Unica	73.2	\N	14 (13/1)	27.0	31.0	53	52	105	74	OK	\N	\N	8	8	\N	2	\N
28	vns	2021-05-09	29052	\N	7	Unica	71.9	\N	\N	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
29	vns	2021-04-11	29211	\N	7	17.0-54.0	73.5	\N	\N	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
30	vns	2021-03-21	26821	\N	7	Unica	73.4	\N	\N	27.0	25.0	51	46	97	72	OK	1	2	6	8	\N	1	\N
31	vns	2016-10-30	28759	\N	7	Unica	74.0	\N	59 (52/7)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
32	vns	2016-09-11	28759	\N	7	Unica	74.0	\N	38 (36/2)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
33	vns	2016-08-15	28759	\N	1	Unica	74.0	\N	74 (60/14)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
34	vns	2016-04-24	28759	\N	7	Unica	74.4	\N	104 (99/5)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
35	vns	2016-03-26	28759	\N	6	Unica	74.4	\N	71 (63/8)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
36	vns	2016-02-20	28759	\N	6	Unica	74.4	\N	128 (121/7)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
37	vns	2016-02-09	28759	\N	2	Unica	74.4	\N	99 (88/11)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
38	vns	2016-02-07	28759	\N	7	Unica	74.4	\N	46 (39/7)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
39	vns	2016-01-31	28759	\N	7	Unica	74.4	\N	65 (59/6)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
40	vns	2016-01-27	28759	\N	3	Unificada	74.4	\N	31 (24/7)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
41	vns	2016-01-03	28759	\N	7	Unica	74.4	\N	40 (36/4)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
42	vns	2015-12-07	28759	\N	1	Unica	74.4	\N	112 (99/13)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
43	vns	2015-07-26	28759	\N	7	Unica	74.4	\N	51 (48/3)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
44	vns	2015-05-03	28759	\N	7	Unica	74.0	\N	58 (52/6)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
45	vns	2015-04-12	28759	\N	7	Unica	74.0	\N	65 (61/4)	27.0	27.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
46	vns	2015-03-17	28759	\N	2	Unificada	74.0	\N	0 (0/0)	28.0	28.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
47	vns	2015-03-14	28759	\N	6	Unica	74.0	\N	68 (66/2)	28.0	28.0	50	51	101	73	OK	\N	2	11	1	2	2	\N
48	vns	2014-12-06	28759	\N	6	Unica	74.0	\N	106 (94/12)	28.0	28.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
49	vns	2014-02-23	28759	\N	7	19-36	74.4	\N	54 (47/7)	28.0	28.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
50	vns	2013-12-29	28759	\N	7	Unificada	74.4	\N	42 (38/4)	28.0	28.0	0	0	0	0	NPT	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: tee_boxes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tee_boxes (id, course_id, name, gender, course_rating, slope_rating, yardage, created_at) FROM stdin;
1	1	Championship	male	78.1	137	7475	2025-04-21 05:03:55.076351+00
2	1	Tournament	male	76.2	132	7270	2025-04-21 05:03:55.076351+00
3	1	Member	male	73.5	128	6835	2025-04-21 05:03:55.076351+00
4	1	Ladies	female	76.2	135	6365	2025-04-21 05:03:55.076351+00
5	2	Championship	male	73.1	132	7305	2025-04-21 05:03:55.093674+00
6	2	White	male	72.3	127	6721	2025-04-21 05:03:55.093674+00
7	2	Green	other	70.8	125	6416	2025-04-21 05:03:55.093674+00
8	2	Red	female	74.2	129	6095	2025-04-21 05:03:55.093674+00
9	3	Azul	male	72.8	133	7105	2025-04-21 05:03:55.098635+00
10	3	Blanco	male	71.4	129	6825	2025-04-21 05:03:55.098635+00
11	3	Amarillo	other	69.5	122	6355	2025-04-21 05:03:55.098635+00
12	3	Rojo	female	72.7	130	5901	2025-04-21 05:03:55.098635+00
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.todos (id, user_id, text, completed, category, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password, first_name, family_name, gender, matricula, birthday, category, handicap, is_admin, created_at) FROM stdin;
1	adminuser	admin@example.com	$2b$10$ek0C/j15HMAb2mOIBqasne0aeNlZIOVq8ubI10pXR4I8fIizezoai	\N	\N	\N	\N	\N	\N	\N	t	2025-04-21 05:03:55.31854
\.


--
-- Name: course_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.course_attachments_id_seq', 1, false);


--
-- Name: course_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.course_data_id_seq', 1, false);


--
-- Name: course_holes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.course_holes_id_seq', 54, true);


--
-- Name: course_names_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.course_names_id_seq', 1, false);


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
-- Name: player_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.player_cards_id_seq', 1, false);


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
-- Name: course_data course_data_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_data
    ADD CONSTRAINT course_data_pkey PRIMARY KEY (id);


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
-- Name: course_names course_names_courseid_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_names
    ADD CONSTRAINT course_names_courseid_key UNIQUE (courseid);


--
-- Name: course_names course_names_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_names
    ADD CONSTRAINT course_names_pkey PRIMARY KEY (id);


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
-- Name: player_cards player_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards
    ADD CONSTRAINT player_cards_pkey PRIMARY KEY (id);


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
-- Name: course_data course_data_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.course_data
    ADD CONSTRAINT course_data_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course_names(courseid) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: player_cards player_cards_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.player_cards
    ADD CONSTRAINT player_cards_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course_names(courseid) ON UPDATE CASCADE ON DELETE RESTRICT;


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

