--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

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
-- Name: country_codes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.country_codes (
    id integer NOT NULL,
    country_name character varying(60),
    alpha_2 character varying(2),
    alpha_3 character varying(3),
    country_code character varying(5)
);


ALTER TABLE public.country_codes OWNER TO admin;

--
-- Name: country_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.country_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.country_codes_id_seq OWNER TO admin;

--
-- Name: country_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.country_codes_id_seq OWNED BY public.country_codes.id;


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
-- Name: course_holes; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.course_holes AS
 SELECT course_id,
    hole_number,
    par,
    men_stroke_index,
    women_stroke_index
   FROM public.x_course_holes;


ALTER VIEW public.course_holes OWNER TO admin;

--
-- Name: province_codes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.province_codes (
    id integer NOT NULL,
    country_code character varying(2),
    iso_code character varying(5),
    province_name character varying(60)
);


ALTER TABLE public.province_codes OWNER TO admin;

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
    province character varying(30),
    country_code character varying(2),
    telephone character varying(50),
    website text,
    email text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.x_course_names OWNER TO admin;

--
-- Name: course_names; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.course_names AS
 SELECT x_course_names.course_id,
    x_course_names.course_name,
    x_course_names.address1,
    x_course_names.address2,
    x_course_names.city,
    x_course_names.telephone,
    x_course_names.website,
    x_course_names.email,
    country_codes.country_name,
    province_codes.province_name,
    x_course_names.created_at
   FROM ((public.x_course_names
     JOIN public.country_codes ON (((x_course_names.country_code)::text = (country_codes.alpha_2)::text)))
     JOIN public.province_codes ON ((((x_course_names.country_code)::text = (province_codes.country_code)::text) AND ((x_course_names.province)::text = (province_codes.iso_code)::text))));


ALTER VIEW public.course_names OWNER TO admin;

--
-- Name: player_cards; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.player_cards (
    id integer NOT NULL,
    player_id integer NOT NULL,
    play_date date NOT NULL,
    course_id integer NOT NULL,
    ext_id integer DEFAULT 0 NOT NULL,
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
    adj_gross integer,
    net integer,
    tarj character varying(10),
    bir text,
    par character varying(50),
    bog integer,
    bg2 integer,
    bg3g integer,
    plus_bg3 text,
    putts text,
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
-- Name: handicap_calculator; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.handicap_calculator AS
 WITH hole_scores AS (
         SELECT player_cards.player_id,
            player_cards.id AS card_id,
            player_cards.course_id,
            player_cards.play_date,
            player_cards.tee_id,
            ARRAY[player_cards.h01, player_cards.h02, player_cards.h03, player_cards.h04, player_cards.h05, player_cards.h06, player_cards.h07, player_cards.h08, player_cards.h09, player_cards.h10, player_cards.h11, player_cards.h12, player_cards.h13, player_cards.h14, player_cards.h15, player_cards.h16, player_cards.h17, player_cards.h18] AS hole_scores,
            player_cards.gross,
            player_cards.net,
            player_cards.g_differential
           FROM public.player_cards
          WHERE ((player_cards.verified = true) AND ((player_cards.tarj)::text = 'OK'::text))
        )
 SELECT pc.id AS card_id,
    pc.player_id,
    u.username AS player_name,
    pc.play_date,
    pc.course_id,
    cn.course_name,
    pc.tee_id,
    tt.tee_color,
    tt.tee_name,
    cdt.par,
    cdt.course_rating,
    cdt.slope_rating,
    cdt.length,
    cdt.course_rating_front,
    cdt.course_rating_back,
    cdt.slope_front,
    cdt.slope_back,
    pc.gross,
    pc.net,
    pc.g_differential,
    pc.h01,
    pc.h02,
    pc.h03,
    pc.h04,
    pc.h05,
    pc.h06,
    pc.h07,
    pc.h08,
    pc.h09,
    pc.h10,
    pc.h11,
    pc.h12,
    pc.h13,
    pc.h14,
    pc.h15,
    pc.h16,
    pc.h17,
    pc.h18,
    ( SELECT json_object_agg(('hole_'::text || ch.hole_number), json_build_object('par', ch.par, 'men_si', ch.men_stroke_index, 'women_si', ch.women_stroke_index)) AS json_object_agg
           FROM public.x_course_holes ch
          WHERE (ch.course_id = pc.course_id)) AS hole_data,
        CASE
            WHEN (pc.g_differential IS NULL) THEN ((((pc.gross)::numeric - cdt.course_rating) * (113)::numeric) / (NULLIF(cdt.slope_rating, 0))::numeric)
            ELSE pc.g_differential
        END AS calculated_differential,
    row_number() OVER (PARTITION BY pc.player_id ORDER BY pc.play_date DESC) AS recency_rank
   FROM ((((public.player_cards pc
     JOIN public.users u ON ((pc.player_id = u.id)))
     JOIN public.x_course_names cn ON ((pc.course_id = cn.course_id)))
     JOIN public.x_course_tee_types tt ON (((pc.tee_id)::text = (tt.tee_id)::text)))
     JOIN public.x_course_data_by_tee cdt ON (((pc.tee_id)::text = (cdt.tee_id)::text)))
  WHERE ((pc.verified = true) AND ((pc.tarj)::text = 'OK'::text))
  ORDER BY pc.player_id, pc.play_date DESC;


ALTER VIEW public.handicap_calculator OWNER TO admin;

--
-- Name: current_handicap_indexes; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.current_handicap_indexes AS
 WITH recent_differentials AS (
         SELECT handicap_calculator.player_id,
            handicap_calculator.player_name,
            handicap_calculator.card_id,
            handicap_calculator.play_date,
            handicap_calculator.calculated_differential,
            handicap_calculator.recency_rank
           FROM public.handicap_calculator
          WHERE (handicap_calculator.recency_rank <= 20)
          ORDER BY handicap_calculator.calculated_differential
        ), handicap_calculation AS (
         SELECT recent_differentials.player_id,
            recent_differentials.player_name,
                CASE
                    WHEN (count(*) >= 20) THEN 8
                    WHEN (count(*) = 19) THEN 8
                    WHEN (count(*) = 18) THEN 8
                    WHEN (count(*) = 17) THEN 8
                    WHEN (count(*) = 16) THEN 8
                    WHEN (count(*) = 15) THEN 6
                    WHEN (count(*) = 14) THEN 6
                    WHEN (count(*) = 13) THEN 5
                    WHEN (count(*) = 12) THEN 5
                    WHEN (count(*) = 11) THEN 4
                    WHEN (count(*) = 10) THEN 4
                    WHEN (count(*) = 9) THEN 4
                    WHEN (count(*) = 8) THEN 3
                    WHEN (count(*) = 7) THEN 3
                    WHEN (count(*) = 6) THEN 2
                    WHEN (count(*) = 5) THEN 1
                    WHEN (count(*) <= 4) THEN 0
                    ELSE NULL::integer
                END AS differentials_to_use,
            count(*) AS total_rounds
           FROM recent_differentials
          GROUP BY recent_differentials.player_id, recent_differentials.player_name
        )
 SELECT hc.player_id,
    hc.player_name,
    hc.total_rounds,
    hc.differentials_to_use,
        CASE
            WHEN (hc.differentials_to_use > 0) THEN ( SELECT round((avg(best_differentials.calculated_differential) * 0.96), 1) AS round
               FROM ( SELECT rd_1.calculated_differential
                       FROM recent_differentials rd_1
                      WHERE (rd_1.player_id = hc.player_id)
                      ORDER BY rd_1.calculated_differential
                     LIMIT hc.differentials_to_use) best_differentials)
            ELSE NULL::numeric
        END AS handicap_index,
    max(rd.play_date) AS last_play_date
   FROM (handicap_calculation hc
     LEFT JOIN recent_differentials rd ON (((hc.player_id = rd.player_id) AND (rd.recency_rank = 1))))
  GROUP BY hc.player_id, hc.player_name, hc.total_rounds, hc.differentials_to_use;


ALTER VIEW public.current_handicap_indexes OWNER TO admin;

--
-- Name: data_by_tee; Type: VIEW; Schema: public; Owner: admin
--

CREATE VIEW public.data_by_tee AS
 SELECT x_course_data_by_tee.course_rating_front,
    x_course_data_by_tee.course_rating_back,
    x_course_data_by_tee.course_rating,
    x_course_data_by_tee.bogey_rating_front,
    x_course_data_by_tee.bogey_rating_back,
    x_course_data_by_tee.bogey_rating,
    x_course_data_by_tee.slope_front,
    x_course_data_by_tee.slope_back,
    x_course_data_by_tee.slope_rating,
    x_course_data_by_tee.length AS yardage,
    x_course_data_by_tee.par,
    x_course_tee_types.tee_name,
    x_course_names.course_name,
    x_course_data_by_tee.course_id
   FROM ((public.x_course_tee_types
     JOIN public.x_course_data_by_tee ON (((x_course_tee_types.course_id = x_course_data_by_tee.course_id) AND ((x_course_tee_types.tee_id)::text = (x_course_data_by_tee.tee_id)::text))))
     JOIN public.x_course_names ON ((x_course_tee_types.course_id = x_course_names.course_id)));


ALTER VIEW public.data_by_tee OWNER TO admin;

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
-- Name: province_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.province_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.province_codes_id_seq OWNER TO admin;

--
-- Name: province_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.province_codes_id_seq OWNED BY public.province_codes.id;


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
-- Name: country_codes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.country_codes ALTER COLUMN id SET DEFAULT nextval('public.country_codes_id_seq'::regclass);


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
-- Name: province_codes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.province_codes ALTER COLUMN id SET DEFAULT nextval('public.province_codes_id_seq'::regclass);


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
-- Name: country_codes country_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.country_codes
    ADD CONSTRAINT country_codes_pkey PRIMARY KEY (id);


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
-- Name: province_codes province_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.province_codes
    ADD CONSTRAINT province_codes_pkey PRIMARY KEY (id);


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
-- Name: idx_country_codes_country_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_country_codes_country_code ON public.country_codes USING btree (country_code);


--
-- Name: idx_country_codes_country_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_country_codes_country_name ON public.country_codes USING btree (country_name);


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
-- Name: idx_player_cards_g_differential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_g_differential ON public.player_cards USING btree (g_differential);


--
-- Name: idx_player_cards_handicap_calc; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_handicap_calc ON public.player_cards USING btree (player_id, verified, tarj, play_date DESC);


--
-- Name: idx_player_cards_holes_back; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_holes_back ON public.player_cards USING btree (h10, h11, h12, h13, h14, h15, h16, h17, h18);


--
-- Name: idx_player_cards_holes_front; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_holes_front ON public.player_cards USING btree (h01, h02, h03, h04, h05, h06, h07, h08, h09);


--
-- Name: idx_player_cards_play_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_play_date ON public.player_cards USING btree (play_date DESC);


--
-- Name: idx_player_cards_player_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_player_date ON public.player_cards USING btree (player_id, play_date DESC);


--
-- Name: idx_player_cards_player_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_player_id ON public.player_cards USING btree (player_id);


--
-- Name: idx_player_cards_tarj; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_tarj ON public.player_cards USING btree (tarj);


--
-- Name: idx_player_cards_tee_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_tee_id ON public.player_cards USING btree (tee_id);


--
-- Name: idx_player_cards_verified; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_verified ON public.player_cards USING btree (verified);


--
-- Name: idx_player_cards_verified_tarj; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_player_cards_verified_tarj ON public.player_cards USING btree (verified, tarj);


--
-- Name: idx_province_codes_iso_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_province_codes_iso_code ON public.province_codes USING btree (iso_code);


--
-- Name: idx_province_codes_province_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_province_codes_province_name ON public.province_codes USING btree (province_name);


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

