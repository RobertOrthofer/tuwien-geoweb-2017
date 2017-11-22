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

CREATE SEQUENCE feedback_f_nr_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE feedback_f_nr_seq OWNED BY ifip_feedback.f_nr;

ALTER TABLE ONLY ifip_feedback ALTER COLUMN f_nr SET DEFAULT nextval('feedback_f_nr_seq'::regclass);

ALTER TABLE ONLY ifip_feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (f_nr);
