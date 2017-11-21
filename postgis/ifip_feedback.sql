--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ifip_feedback; Type: TABLE; Schema: public; Owner: jbroetha
--

CREATE TABLE ifip_feedback (
    f_nr integer NOT NULL,
    f_name text,
    f_mail text,
    f_anrede text,
    f_msg text,
    f_geoweb integer,
    f_datum text,
    the_geom geometry
);


ALTER TABLE ifip_feedback OWNER TO jbroetha;

--
-- Name: feedback_f_nr_seq; Type: SEQUENCE; Schema: public; Owner: jbroetha
--

CREATE SEQUENCE feedback_f_nr_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE feedback_f_nr_seq OWNER TO jbroetha;

--
-- Name: feedback_f_nr_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jbroetha
--

ALTER SEQUENCE feedback_f_nr_seq OWNED BY ifip_feedback.f_nr;


--
-- Name: ifip_feedback f_nr; Type: DEFAULT; Schema: public; Owner: jbroetha
--

ALTER TABLE ONLY ifip_feedback ALTER COLUMN f_nr SET DEFAULT nextval('feedback_f_nr_seq'::regclass);


--
-- Name: ifip_feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: jbroetha
--

ALTER TABLE ONLY ifip_feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (f_nr);


--
-- Name: ifip_feedback; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,UPDATE ON TABLE ifip_feedback TO ahocevar;
GRANT ALL ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_nr; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_nr),INSERT(f_nr),UPDATE(f_nr) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_name; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_name),INSERT(f_name) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_mail; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_mail),INSERT(f_mail) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_anrede; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_anrede),INSERT(f_anrede) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_msg; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_msg),INSERT(f_msg) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_geoweb; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_geoweb),INSERT(f_geoweb) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: ifip_feedback.f_datum; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT(f_datum),INSERT(f_datum) ON TABLE ifip_feedback TO geoweb2017;


--
-- Name: feedback_f_nr_seq; Type: ACL; Schema: public; Owner: jbroetha
--

GRANT SELECT,UPDATE ON SEQUENCE feedback_f_nr_seq TO geoweb2017;


--
-- PostgreSQL database dump complete
--
