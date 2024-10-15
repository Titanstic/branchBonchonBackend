--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--





--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:COTG5S88/xHCRdI02IqTLg==$lE/rFaQyNC/CwUMFYolvbHZvco26GUPFr55+igWJAO8=:DArrhXPUoxC32gsdIlfEtybiG89BFlssBGKv8t4/RfI=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg120+1)
-- Dumped by pg_dump version 15.8 (Debian 15.8-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg120+1)
-- Dumped by pg_dump version 15.8 (Debian 15.8-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: batch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batch (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.batch OWNER TO postgres;

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    branch_name text NOT NULL,
    address text,
    road_city text,
    phone text,
    phone2 text,
    grand_open_date date,
    opening_time timestamp with time zone,
    closing_time timestamp with time zone,
    branch_no text,
    ip_address text
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: combo_menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.combo_menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    normal_menu_item_id uuid NOT NULL,
    combo_set_id uuid NOT NULL,
    qty integer NOT NULL
);


ALTER TABLE public.combo_menu_items OWNER TO postgres;

--
-- Name: combo_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.combo_set (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    code_name text NOT NULL,
    name text NOT NULL,
    price integer NOT NULL,
    discount text,
    dis_start_date date,
    dis_end_date date,
    major_group_id uuid NOT NULL,
    family_group_id uuid NOT NULL,
    report_group_id uuid NOT NULL,
    note text[] NOT NULL
);


ALTER TABLE public.combo_set OWNER TO postgres;

--
-- Name: dinner_tables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dinner_tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    table_no text
);


ALTER TABLE public.dinner_tables OWNER TO postgres;

--
-- Name: discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    discount_name text NOT NULL,
    available boolean DEFAULT true NOT NULL,
    amount text NOT NULL,
    sync boolean DEFAULT false,
    branch_id uuid
);


ALTER TABLE public.discounts OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    level text NOT NULL,
    printer_name text,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: family_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.family_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    family_name text NOT NULL
);


ALTER TABLE public.family_group OWNER TO postgres;

--
-- Name: flavour_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flavour_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    menu_item_id uuid NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.flavour_types OWNER TO postgres;

--
-- Name: good_received; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.good_received (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    invoice_no text NOT NULL,
    status text NOT NULL,
    arrival_date date NOT NULL,
    note text,
    total_price integer NOT NULL,
    currency text NOT NULL,
    purchase_order_id uuid NOT NULL,
    doc_no text DEFAULT 'GR 0001'::text NOT NULL
);


ALTER TABLE public.good_received OWNER TO postgres;

--
-- Name: good_received_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.good_received_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    stock_id uuid NOT NULL,
    unit_price integer NOT NULL,
    qty integer NOT NULL,
    good_received_id uuid NOT NULL
);


ALTER TABLE public.good_received_item OWNER TO postgres;

--
-- Name: good_return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.good_return (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ref_no text NOT NULL,
    status text NOT NULL,
    return_date date NOT NULL,
    note text,
    good_received_id uuid NOT NULL,
    doc_no text DEFAULT 'GRT 0001'::text NOT NULL
);


ALTER TABLE public.good_return OWNER TO postgres;

--
-- Name: good_return_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.good_return_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    stock_id uuid NOT NULL,
    unit_price integer NOT NULL,
    qty integer NOT NULL,
    good_return_id uuid NOT NULL
);


ALTER TABLE public.good_return_item OWNER TO postgres;

--
-- Name: kitchen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kitchen (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    kitchen_name text NOT NULL,
    printer_name text NOT NULL
);


ALTER TABLE public.kitchen OWNER TO postgres;

--
-- Name: major_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.major_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    major_name text NOT NULL
);


ALTER TABLE public.major_group OWNER TO postgres;

--
-- Name: menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    menu_name text NOT NULL
);


ALTER TABLE public.menu OWNER TO postgres;

--
-- Name: menu_recipe_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_recipe_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    recipe_id uuid NOT NULL,
    menu_id uuid NOT NULL
);


ALTER TABLE public.menu_recipe_items OWNER TO postgres;

--
-- Name: normal_menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.normal_menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    code_name text NOT NULL,
    name text NOT NULL,
    price integer NOT NULL,
    discount integer NOT NULL,
    dis_start_date date,
    dis_end_date date,
    major_group_id uuid NOT NULL,
    family_group_id uuid NOT NULL,
    report_group_id uuid NOT NULL,
    menu_id uuid NOT NULL,
    note text[] NOT NULL,
    condiments text[] NOT NULL,
    kitchens uuid[] NOT NULL
);


ALTER TABLE public.normal_menu_items OWNER TO postgres;

--
-- Name: payment_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_name text NOT NULL,
    type text
);


ALTER TABLE public.payment_types OWNER TO postgres;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    price_range text,
    discount text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    promotion_types uuid[]
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- Name: promotion_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    promotion_id uuid NOT NULL,
    normal_menu_item_id uuid,
    combo_set_id uuid,
    qty integer
);


ALTER TABLE public.promotion_items OWNER TO postgres;

--
-- Name: promotion_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    type_name text NOT NULL
);


ALTER TABLE public.promotion_types OWNER TO postgres;

--
-- Name: purchase_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    total_price integer NOT NULL,
    currency text NOT NULL,
    branch_id uuid NOT NULL,
    status text NOT NULL,
    arrival_date date NOT NULL,
    note text,
    payment_due_date date NOT NULL,
    supplier_id uuid NOT NULL,
    doc_no text DEFAULT 'PO 0001'::text NOT NULL,
    sync boolean DEFAULT false
);


ALTER TABLE public.purchase_order OWNER TO postgres;

--
-- Name: purchase_order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    stock_id uuid NOT NULL,
    unit_price integer NOT NULL,
    qty integer NOT NULL,
    purchase_order_id uuid NOT NULL
);


ALTER TABLE public.purchase_order_item OWNER TO postgres;

--
-- Name: recipe_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.recipe_group OWNER TO postgres;

--
-- Name: recipe_item_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_item_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.recipe_item_types OWNER TO postgres;

--
-- Name: recipe_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    stock_items_id uuid NOT NULL,
    recipe_id uuid NOT NULL,
    qty integer NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.recipe_items OWNER TO postgres;

--
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    code_no text NOT NULL,
    recipe_name text NOT NULL,
    recipe_group_id uuid NOT NULL,
    sale_type text NOT NULL
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- Name: report_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    report_name text NOT NULL
);


ALTER TABLE public.report_group OWNER TO postgres;

--
-- Name: stock_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    code_no text NOT NULL,
    name text NOT NULL,
    last_purchase_price integer NOT NULL,
    average_purchase_price integer NOT NULL,
    low_stock_qty integer NOT NULL,
    purchase_qty integer NOT NULL,
    inventory_qty integer NOT NULL,
    recipe_qty integer NOT NULL,
    unit_id uuid NOT NULL,
    department_id uuid NOT NULL,
    group_id uuid NOT NULL,
    type_id uuid NOT NULL,
    discount text,
    tax_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    batch_id uuid
);


ALTER TABLE public.stock_items OWNER TO postgres;

--
-- Name: stock_items_department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_items_department (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.stock_items_department OWNER TO postgres;

--
-- Name: stock_items_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_items_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.stock_items_group OWNER TO postgres;

--
-- Name: stock_items_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_items_type (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.stock_items_type OWNER TO postgres;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    sup_id text NOT NULL,
    pri_phone_no text NOT NULL,
    sec_phone_no text,
    township text NOT NULL,
    city text NOT NULL,
    status boolean DEFAULT true NOT NULL,
    note text,
    address_detail text DEFAULT 'No-123, Yankin Street'::text
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: tax; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    amount text NOT NULL
);


ALTER TABLE public.tax OWNER TO postgres;

--
-- Name: transaction_combo_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_combo_set (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    combo_set_name text NOT NULL,
    quantity integer NOT NULL,
    total_amount integer NOT NULL,
    price integer NOT NULL,
    is_take_away boolean NOT NULL,
    transaction_id uuid NOT NULL,
    container_charges integer NOT NULL,
    discount_price integer NOT NULL,
    combo_set_id uuid NOT NULL
);


ALTER TABLE public.transaction_combo_set OWNER TO postgres;

--
-- Name: transaction_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_name text NOT NULL,
    quantity integer NOT NULL,
    total_amount integer NOT NULL,
    price integer NOT NULL,
    is_take_away boolean NOT NULL,
    note text NOT NULL,
    transaction_id uuid,
    normal_menu_item_id uuid,
    container_charges integer DEFAULT 0 NOT NULL,
    discount_price integer DEFAULT 0 NOT NULL,
    flavour_types text,
    transition_combo_set_id uuid
);


ALTER TABLE public.transaction_items OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    grand_total_amount integer NOT NULL,
    sub_total_amount integer NOT NULL,
    tax_amount integer NOT NULL,
    service_charge_amount integer NOT NULL,
    discount_amount integer DEFAULT 0,
    discount_name text,
    cash_back integer NOT NULL,
    payment integer NOT NULL,
    payment_type_id uuid,
    dinner_table_id uuid,
    add_on integer NOT NULL,
    inclusive integer NOT NULL,
    point integer DEFAULT 0,
    void boolean DEFAULT false NOT NULL,
    employee_id uuid NOT NULL,
    rounding integer,
    sync boolean DEFAULT false NOT NULL,
    order_no text,
    customer_count integer
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transfer_in; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfer_in (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    invoice_no text NOT NULL,
    banch_id uuid NOT NULL,
    ref_no text NOT NULL,
    status text NOT NULL,
    transfer_in_date date NOT NULL,
    note text,
    transfer_out_do_no text NOT NULL,
    doc_no text DEFAULT 'GTI 001'::text NOT NULL
);


ALTER TABLE public.transfer_in OWNER TO postgres;

--
-- Name: transfer_in_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfer_in_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    transfer_qty integer NOT NULL,
    qty integer NOT NULL,
    transfer_in_id uuid NOT NULL,
    stock_name text NOT NULL,
    uom text NOT NULL
);


ALTER TABLE public.transfer_in_items OWNER TO postgres;

--
-- Name: transfer_out; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfer_out (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    do_no text NOT NULL,
    banch_id uuid NOT NULL,
    ref_no text NOT NULL,
    status text NOT NULL,
    transfrer_out_date date NOT NULL,
    note text,
    doc_no text DEFAULT 'GTO 001'::text NOT NULL
);


ALTER TABLE public.transfer_out OWNER TO postgres;

--
-- Name: transfer_out_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transfer_out_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    stock_id uuid NOT NULL,
    qty uuid NOT NULL,
    transfer_out_id uuid NOT NULL
);


ALTER TABLE public.transfer_out_item OWNER TO postgres;

--
-- Name: unit_of_measurement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_of_measurement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    purchase_qty integer NOT NULL,
    purchase_unit text NOT NULL,
    inventory_qty integer NOT NULL,
    inventory_unit text NOT NULL,
    recipe_unit text,
    recipe_qty integer
);


ALTER TABLE public.unit_of_measurement OWNER TO postgres;

--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_metadata (id, metadata, resource_version) FROM stdin;
1	{"actions":[{"comment":"DownloadGroupDetailSaleReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/groupDetailSaleReport/download","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadGroupDetailSaleReport"},{"comment":"DownloadGroupSaleReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/groupSaleReport/download","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadGroupSaleReport"},{"comment":"DownloadSaleCategoryReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/dailySaleReport/download/sale","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadSaleCategoryReport"},{"comment":"DownloadSaleDiscountReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/dailySaleReport/download/discount","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadSaleDiscountReport"},{"comment":"DownloadSalePaymentReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/dailySaleReport/download/payment","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadSalePaymentReport"},{"comment":"DownloadSalePromotionReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/dailySaleReport/download/promotion","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadSalePromotionReport"},{"comment":"DownloadSaleSummaryReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"}],"handler":"http://offline_backend:3002/dailySaleReport/download/summary","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"DownloadSaleSummaryReport"},{"comment":"GroupDetailSaleReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/groupDetailSaleReport","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"GroupDetailSaleReport"},{"comment":"GroupSaleReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/groupSaleReport","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"GroupSaleReport"},{"comment":"Reprint","definition":{"arguments":[{"name":"transaction_id","type":"uuid!"}],"handler":"http://offline_backend:3002/reprint","kind":"synchronous","output_type":"ReprintResponse","type":"mutation"},"name":"Reprint"},{"comment":"SaleCategoryReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/dailySaleReport/sale","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"SaleCategoryReport"},{"comment":"SaleDiscountReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/dailySaleReport/discount","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"SaleDiscountReport"},{"comment":"SalePaymentReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/dailySaleReport/payment","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"SalePaymentReport"},{"comment":"SalePromotionReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/dailySaleReport/promotion","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"SalePromotionReport"},{"comment":"SaleSummaryReport","definition":{"arguments":[{"name":"startDate","type":"String!"},{"name":"endDate","type":"String!"},{"name":"page","type":"Int"}],"handler":"http://offline_backend:3002/dailySaleReport/summary","kind":"synchronous","output_type":"ReportResponse","type":"mutation"},"name":"SaleSummaryReport"},{"comment":"SignInEmployee","definition":{"arguments":[{"name":"username","type":"String!"},{"name":"password","type":"String!"}],"handler":"http://offline_backend:3002/signin","kind":"synchronous","output_type":"SignInEmployeeResponse","type":"mutation"},"name":"SignInEmployee"},{"comment":"Transition","definition":{"arguments":[{"name":"id","type":"uuid!"},{"name":"employee_id","type":"uuid!"},{"name":"employee_name","type":"String!"},{"name":"employee_printer","type":"String!"},{"name":"grand_total_amount","type":"Int!"},{"name":"sub_total_amount","type":"Int!"},{"name":"tax_amount","type":"Int!"},{"name":"service_charge_amount","type":"Int!"},{"name":"discount_amount","type":"Int"},{"name":"discount_name","type":"String"},{"name":"cash_back","type":"Int!"},{"name":"payment","type":"Int!"},{"name":"payment_type_id","type":"uuid!"},{"name":"payment_type_name","type":"String!"},{"name":"branch_id","type":"uuid!"},{"name":"dinner_table_id","type":"uuid"},{"name":"table_name","type":"String"},{"name":"add_on","type":"Int!"},{"name":"inclusive","type":"Int!"},{"name":"point","type":"Int"},{"name":"items","type":"jsonb!"},{"name":"rounding","type":"Int!"},{"name":"customer_count","type":"Int"}],"handler":"http://offline_backend:3002/transition","kind":"synchronous","output_type":"TransitionResponse","type":"mutation"},"name":"Transition"},{"comment":"syncFromCentral","definition":{"arguments":[{"name":"transaction_id","type":"String!"}],"handler":"http://offline_backend:3002/central/sync","kind":"synchronous","output_type":"SyncFromCentralResponse","type":"mutation"},"name":"syncFromCentral"}],"backend_configs":{"dataconnector":{"athena":{"uri":"http://data-connector-agent:8081/api/v1/athena"},"mariadb":{"uri":"http://data-connector-agent:8081/api/v1/mariadb"},"mysql8":{"uri":"http://data-connector-agent:8081/api/v1/mysql"},"oracle":{"uri":"http://data-connector-agent:8081/api/v1/oracle"},"snowflake":{"uri":"http://data-connector-agent:8081/api/v1/snowflake"}}},"custom_types":{"input_objects":[{"fields":[{"name":"username","type":"String!"},{"name":"password","type":"String!"}],"name":"SampleInput"}],"objects":[{"fields":[{"name":"error","type":"Int!"},{"name":"message","type":"String!"}],"name":"ReportResponse"},{"fields":[{"name":"accessToken","type":"String!"}],"name":"SampleOutput"},{"fields":[{"name":"error","type":"Int!"},{"name":"message","type":"String!"}],"name":"ReprintResponse"},{"fields":[{"name":"error","type":"Int!"},{"name":"message","type":"String!"},{"name":"accessToken","type":"String!"}],"name":"SignInEmployeeResponse"},{"fields":[{"name":"error","type":"Int!"},{"name":"message","type":"String!"}],"name":"TransitionResponse"},{"fields":[{"name":"success","type":"Boolean!"},{"name":"message","type":"String!"}],"name":"SyncFromCentralResponse"}]},"sources":[{"configuration":{"connection_info":{"database_url":{"from_env":"HASURA_GRAPHQL_METADATA_DATABASE_URL"},"isolation_level":"read-committed","use_prepared_statements":false}},"kind":"postgres","name":"BONCHON-OFFLINE-SERVER","tables":[{"array_relationships":[{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"batch_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"batch","schema":"public"}},{"array_relationships":[{"name":"discounts","using":{"foreign_key_constraint_on":{"column":"branch_id","table":{"name":"discounts","schema":"public"}}}},{"name":"purchase_orders","using":{"foreign_key_constraint_on":{"column":"branch_id","table":{"name":"purchase_order","schema":"public"}}}},{"name":"transfer_ins","using":{"foreign_key_constraint_on":{"column":"banch_id","table":{"name":"transfer_in","schema":"public"}}}},{"name":"transfer_outs","using":{"foreign_key_constraint_on":{"column":"banch_id","table":{"name":"transfer_out","schema":"public"}}}}],"table":{"name":"branches","schema":"public"}},{"object_relationships":[{"name":"combo_set","using":{"foreign_key_constraint_on":"combo_set_id"}},{"name":"normal_menu_item","using":{"foreign_key_constraint_on":"normal_menu_item_id"}}],"table":{"name":"combo_menu_items","schema":"public"}},{"array_relationships":[{"name":"combo_menu_items","using":{"foreign_key_constraint_on":{"column":"combo_set_id","table":{"name":"combo_menu_items","schema":"public"}}}},{"name":"promotion_items","using":{"foreign_key_constraint_on":{"column":"combo_set_id","table":{"name":"promotion_items","schema":"public"}}}},{"name":"transaction_combo_sets","using":{"foreign_key_constraint_on":{"column":"combo_set_id","table":{"name":"transaction_combo_set","schema":"public"}}}}],"object_relationships":[{"name":"family_group","using":{"foreign_key_constraint_on":"family_group_id"}},{"name":"major_group","using":{"foreign_key_constraint_on":"major_group_id"}},{"name":"report_group","using":{"foreign_key_constraint_on":"report_group_id"}}],"table":{"name":"combo_set","schema":"public"}},{"array_relationships":[{"name":"transactions","using":{"foreign_key_constraint_on":{"column":"dinner_table_id","table":{"name":"transactions","schema":"public"}}}}],"table":{"name":"dinner_tables","schema":"public"}},{"object_relationships":[{"name":"branch","using":{"foreign_key_constraint_on":"branch_id"}}],"table":{"name":"discounts","schema":"public"}},{"table":{"name":"employees","schema":"public"}},{"array_relationships":[{"name":"combo_sets","using":{"foreign_key_constraint_on":{"column":"family_group_id","table":{"name":"combo_set","schema":"public"}}}},{"name":"normal_menu_items","using":{"foreign_key_constraint_on":{"column":"family_group_id","table":{"name":"normal_menu_items","schema":"public"}}}}],"table":{"name":"family_group","schema":"public"}},{"table":{"name":"flavour_types","schema":"public"}},{"array_relationships":[{"name":"good_received_items","using":{"foreign_key_constraint_on":{"column":"good_received_id","table":{"name":"good_received_item","schema":"public"}}}},{"name":"good_returns","using":{"foreign_key_constraint_on":{"column":"good_received_id","table":{"name":"good_return","schema":"public"}}}}],"object_relationships":[{"name":"purchase_order","using":{"foreign_key_constraint_on":"purchase_order_id"}}],"table":{"name":"good_received","schema":"public"}},{"object_relationships":[{"name":"good_received","using":{"foreign_key_constraint_on":"good_received_id"}},{"name":"stock_item","using":{"foreign_key_constraint_on":"stock_id"}}],"table":{"name":"good_received_item","schema":"public"}},{"object_relationships":[{"name":"good_received","using":{"foreign_key_constraint_on":"good_received_id"}}],"table":{"name":"good_return","schema":"public"}},{"array_relationships":[{"name":"good_return_items","using":{"foreign_key_constraint_on":{"column":"good_return_id","table":{"name":"good_return_item","schema":"public"}}}}],"object_relationships":[{"name":"good_return_item","using":{"foreign_key_constraint_on":"good_return_id"}},{"name":"stock_item","using":{"foreign_key_constraint_on":"stock_id"}}],"table":{"name":"good_return_item","schema":"public"}},{"table":{"name":"kitchen","schema":"public"}},{"array_relationships":[{"name":"combo_sets","using":{"foreign_key_constraint_on":{"column":"major_group_id","table":{"name":"combo_set","schema":"public"}}}},{"name":"normal_menu_items","using":{"foreign_key_constraint_on":{"column":"major_group_id","table":{"name":"normal_menu_items","schema":"public"}}}}],"table":{"name":"major_group","schema":"public"}},{"array_relationships":[{"name":"normal_menu_items","using":{"foreign_key_constraint_on":{"column":"menu_id","table":{"name":"normal_menu_items","schema":"public"}}}}],"table":{"name":"menu","schema":"public"}},{"object_relationships":[{"name":"normal_menu_item","using":{"foreign_key_constraint_on":"menu_id"}},{"name":"recipe","using":{"foreign_key_constraint_on":"recipe_id"}}],"table":{"name":"menu_recipe_items","schema":"public"}},{"array_relationships":[{"name":"combo_menu_items","using":{"foreign_key_constraint_on":{"column":"normal_menu_item_id","table":{"name":"combo_menu_items","schema":"public"}}}},{"name":"menu_recipe_items","using":{"foreign_key_constraint_on":{"column":"menu_id","table":{"name":"menu_recipe_items","schema":"public"}}}},{"name":"promotion_items","using":{"foreign_key_constraint_on":{"column":"normal_menu_item_id","table":{"name":"promotion_items","schema":"public"}}}},{"name":"transaction_items","using":{"foreign_key_constraint_on":{"column":"normal_menu_item_id","table":{"name":"transaction_items","schema":"public"}}}}],"object_relationships":[{"name":"family_group","using":{"foreign_key_constraint_on":"family_group_id"}},{"name":"major_group","using":{"foreign_key_constraint_on":"major_group_id"}},{"name":"menu","using":{"foreign_key_constraint_on":"menu_id"}},{"name":"report_group","using":{"foreign_key_constraint_on":"report_group_id"}}],"table":{"name":"normal_menu_items","schema":"public"}},{"array_relationships":[{"name":"transactions","using":{"foreign_key_constraint_on":{"column":"payment_type_id","table":{"name":"transactions","schema":"public"}}}}],"table":{"name":"payment_types","schema":"public"}},{"array_relationships":[{"name":"promotion_items","using":{"foreign_key_constraint_on":{"column":"promotion_id","table":{"name":"promotion_items","schema":"public"}}}}],"table":{"name":"promotion","schema":"public"}},{"object_relationships":[{"name":"combo_set","using":{"foreign_key_constraint_on":"combo_set_id"}},{"name":"normal_menu_item","using":{"foreign_key_constraint_on":"normal_menu_item_id"}},{"name":"promotion","using":{"foreign_key_constraint_on":"promotion_id"}}],"table":{"name":"promotion_items","schema":"public"}},{"table":{"name":"promotion_types","schema":"public"}},{"array_relationships":[{"name":"good_receiveds","using":{"foreign_key_constraint_on":{"column":"purchase_order_id","table":{"name":"good_received","schema":"public"}}}},{"name":"purchase_order_items","using":{"foreign_key_constraint_on":{"column":"purchase_order_id","table":{"name":"purchase_order_item","schema":"public"}}}}],"object_relationships":[{"name":"branch","using":{"foreign_key_constraint_on":"branch_id"}},{"name":"supplier","using":{"foreign_key_constraint_on":"supplier_id"}}],"table":{"name":"purchase_order","schema":"public"}},{"object_relationships":[{"name":"purchase_order","using":{"foreign_key_constraint_on":"purchase_order_id"}},{"name":"stock_item","using":{"foreign_key_constraint_on":"stock_id"}}],"table":{"name":"purchase_order_item","schema":"public"}},{"array_relationships":[{"name":"recipes","using":{"foreign_key_constraint_on":{"column":"recipe_group_id","table":{"name":"recipes","schema":"public"}}}}],"table":{"name":"recipe_group","schema":"public"}},{"array_relationships":[{"name":"recipe_items","using":{"foreign_key_constraint_on":{"column":"type","table":{"name":"recipe_items","schema":"public"}}}},{"name":"recipes","using":{"foreign_key_constraint_on":{"column":"sale_type","table":{"name":"recipes","schema":"public"}}}}],"table":{"name":"recipe_item_types","schema":"public"}},{"object_relationships":[{"name":"recipe","using":{"foreign_key_constraint_on":"recipe_id"}},{"name":"recipe_item_type","using":{"foreign_key_constraint_on":"type"}},{"name":"stock_item","using":{"foreign_key_constraint_on":"stock_items_id"}}],"table":{"name":"recipe_items","schema":"public"}},{"array_relationships":[{"name":"menu_recipe_items","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"menu_recipe_items","schema":"public"}}}},{"name":"recipe_items","using":{"foreign_key_constraint_on":{"column":"recipe_id","table":{"name":"recipe_items","schema":"public"}}}}],"object_relationships":[{"name":"recipe_group","using":{"foreign_key_constraint_on":"recipe_group_id"}},{"name":"recipe_item_type","using":{"foreign_key_constraint_on":"sale_type"}}],"table":{"name":"recipes","schema":"public"}},{"array_relationships":[{"name":"combo_sets","using":{"foreign_key_constraint_on":{"column":"report_group_id","table":{"name":"combo_set","schema":"public"}}}},{"name":"normal_menu_items","using":{"foreign_key_constraint_on":{"column":"report_group_id","table":{"name":"normal_menu_items","schema":"public"}}}}],"table":{"name":"report_group","schema":"public"}},{"array_relationships":[{"name":"good_received_items","using":{"foreign_key_constraint_on":{"column":"stock_id","table":{"name":"good_received_item","schema":"public"}}}},{"name":"good_return_items","using":{"foreign_key_constraint_on":{"column":"stock_id","table":{"name":"good_return_item","schema":"public"}}}},{"name":"purchase_order_items","using":{"foreign_key_constraint_on":{"column":"stock_id","table":{"name":"purchase_order_item","schema":"public"}}}},{"name":"recipe_items","using":{"foreign_key_constraint_on":{"column":"stock_items_id","table":{"name":"recipe_items","schema":"public"}}}},{"name":"transfer_out_items","using":{"foreign_key_constraint_on":{"column":"stock_id","table":{"name":"transfer_out_item","schema":"public"}}}}],"object_relationships":[{"name":"batch","using":{"foreign_key_constraint_on":"batch_id"}},{"name":"stock_items_department","using":{"foreign_key_constraint_on":"department_id"}},{"name":"stock_items_group","using":{"foreign_key_constraint_on":"group_id"}},{"name":"stock_items_type","using":{"foreign_key_constraint_on":"type_id"}},{"name":"supplier","using":{"foreign_key_constraint_on":"supplier_id"}},{"name":"tax","using":{"foreign_key_constraint_on":"tax_id"}},{"name":"unit_of_measurement","using":{"foreign_key_constraint_on":"unit_id"}}],"table":{"name":"stock_items","schema":"public"}},{"array_relationships":[{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"department_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"stock_items_department","schema":"public"}},{"array_relationships":[{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"group_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"stock_items_group","schema":"public"}},{"array_relationships":[{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"type_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"stock_items_type","schema":"public"}},{"array_relationships":[{"name":"purchase_orders","using":{"foreign_key_constraint_on":{"column":"supplier_id","table":{"name":"purchase_order","schema":"public"}}}},{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"supplier_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"suppliers","schema":"public"}},{"array_relationships":[{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"tax_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"tax","schema":"public"}},{"array_relationships":[{"name":"transaction_items","using":{"foreign_key_constraint_on":{"column":"transition_combo_set_id","table":{"name":"transaction_items","schema":"public"}}}}],"object_relationships":[{"name":"combo_set","using":{"foreign_key_constraint_on":"combo_set_id"}},{"name":"transaction","using":{"foreign_key_constraint_on":"transaction_id"}}],"table":{"name":"transaction_combo_set","schema":"public"}},{"object_relationships":[{"name":"normal_menu_item","using":{"foreign_key_constraint_on":"normal_menu_item_id"}},{"name":"transaction","using":{"foreign_key_constraint_on":"transaction_id"}},{"name":"transaction_combo_set","using":{"foreign_key_constraint_on":"transition_combo_set_id"}}],"table":{"name":"transaction_items","schema":"public"}},{"array_relationships":[{"name":"transaction_combo_sets","using":{"foreign_key_constraint_on":{"column":"transaction_id","table":{"name":"transaction_combo_set","schema":"public"}}}},{"name":"transaction_items","using":{"foreign_key_constraint_on":{"column":"transaction_id","table":{"name":"transaction_items","schema":"public"}}}}],"object_relationships":[{"name":"dinner_table","using":{"foreign_key_constraint_on":"dinner_table_id"}},{"name":"payment_type","using":{"foreign_key_constraint_on":"payment_type_id"}}],"table":{"name":"transactions","schema":"public"}},{"array_relationships":[{"name":"transfer_in_items","using":{"foreign_key_constraint_on":{"column":"transfer_in_id","table":{"name":"transfer_in_items","schema":"public"}}}}],"object_relationships":[{"name":"branch","using":{"foreign_key_constraint_on":"banch_id"}},{"name":"transfer_out","using":{"foreign_key_constraint_on":"transfer_out_do_no"}}],"table":{"name":"transfer_in","schema":"public"}},{"object_relationships":[{"name":"transfer_in","using":{"foreign_key_constraint_on":"transfer_in_id"}}],"table":{"name":"transfer_in_items","schema":"public"}},{"array_relationships":[{"name":"transfer_ins","using":{"foreign_key_constraint_on":{"column":"transfer_out_do_no","table":{"name":"transfer_in","schema":"public"}}}},{"name":"transfer_out_items","using":{"foreign_key_constraint_on":{"column":"transfer_out_id","table":{"name":"transfer_out_item","schema":"public"}}}}],"object_relationships":[{"name":"branch","using":{"foreign_key_constraint_on":"banch_id"}}],"table":{"name":"transfer_out","schema":"public"}},{"object_relationships":[{"name":"stock_item","using":{"foreign_key_constraint_on":"stock_id"}},{"name":"transfer_out","using":{"foreign_key_constraint_on":"transfer_out_id"}}],"table":{"name":"transfer_out_item","schema":"public"}},{"array_relationships":[{"name":"stock_items","using":{"foreign_key_constraint_on":{"column":"unit_id","table":{"name":"stock_items","schema":"public"}}}}],"table":{"name":"unit_of_measurement","schema":"public"}}]}],"version":3}	229
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_notifications (id, notification, resource_version, instance_id, updated_at) FROM stdin;
1	{"metadata":false,"remote_schemas":[],"sources":[],"data_connectors":[]}	229	c2ad31ae-7644-4f5f-b3b1-9b31dc0ec35d	2024-10-14 15:54:25.969123+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state, ee_client_id, ee_client_secret) FROM stdin;
0967529e-6e05-4e9c-9d9d-6f38ff989364	48	2024-10-14 15:42:21.661805+00	{}	{"onboardingShown": true, "console_notifications": {"admin": {"date": null, "read": [], "showBadge": true}}}	\N	\N
\.


--
-- Data for Name: batch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.batch (id, created_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, created_at, updated_at, branch_name, address, road_city, phone, phone2, grand_open_date, opening_time, closing_time, branch_no, ip_address) FROM stdin;
ca878422-0417-4cfd-8a52-2b7610fee5d9	2024-10-14 18:04:26.756587+00	2024-10-14 18:04:26.756587+00	branch one	NO (27), 1 Quarter, Zayar Thiri Street	Insein Road, Yangon	09443478857	\N	\N	\N	\N	no12	api.offline-erp.bonchon.axra.app
\.


--
-- Data for Name: combo_menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.combo_menu_items (id, created_at, updated_at, normal_menu_item_id, combo_set_id, qty) FROM stdin;
\.


--
-- Data for Name: combo_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.combo_set (id, created_at, updated_at, code_name, name, price, discount, dis_start_date, dis_end_date, major_group_id, family_group_id, report_group_id, note) FROM stdin;
\.


--
-- Data for Name: dinner_tables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dinner_tables (id, created_at, updated_at, table_no) FROM stdin;
\.


--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discounts (id, created_at, updated_at, discount_name, available, amount, sync, branch_id) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, created_at, updated_at, username, password, level, printer_name, active) FROM stdin;
\.


--
-- Data for Name: family_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.family_group (id, created_at, updated_at, family_name) FROM stdin;
\.


--
-- Data for Name: flavour_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flavour_types (id, created_at, updated_at, menu_item_id, name) FROM stdin;
\.


--
-- Data for Name: good_received; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.good_received (id, created_at, updated_at, invoice_no, status, arrival_date, note, total_price, currency, purchase_order_id, doc_no) FROM stdin;
\.


--
-- Data for Name: good_received_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.good_received_item (id, created_at, updated_at, stock_id, unit_price, qty, good_received_id) FROM stdin;
\.


--
-- Data for Name: good_return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.good_return (id, created_at, updated_at, ref_no, status, return_date, note, good_received_id, doc_no) FROM stdin;
\.


--
-- Data for Name: good_return_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.good_return_item (id, created_at, updated_at, stock_id, unit_price, qty, good_return_id) FROM stdin;
\.


--
-- Data for Name: kitchen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kitchen (id, created_at, updated_at, kitchen_name, printer_name) FROM stdin;
\.


--
-- Data for Name: major_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.major_group (id, created_at, updated_at, major_name) FROM stdin;
\.


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu (id, created_at, updated_at, menu_name) FROM stdin;
\.


--
-- Data for Name: menu_recipe_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_recipe_items (id, created_at, updated_at, recipe_id, menu_id) FROM stdin;
\.


--
-- Data for Name: normal_menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.normal_menu_items (id, created_at, updated_at, code_name, name, price, discount, dis_start_date, dis_end_date, major_group_id, family_group_id, report_group_id, menu_id, note, condiments, kitchens) FROM stdin;
\.


--
-- Data for Name: payment_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_types (id, created_at, updated_at, payment_name, type) FROM stdin;
\.


--
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion (id, created_at, updated_at, name, price_range, discount, start_date, end_date, promotion_types) FROM stdin;
\.


--
-- Data for Name: promotion_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_items (id, created_at, updated_at, promotion_id, normal_menu_item_id, combo_set_id, qty) FROM stdin;
\.


--
-- Data for Name: promotion_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_types (id, created_at, updated_at, type_name) FROM stdin;
\.


--
-- Data for Name: purchase_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order (id, created_at, updated_at, total_price, currency, branch_id, status, arrival_date, note, payment_due_date, supplier_id, doc_no, sync) FROM stdin;
\.


--
-- Data for Name: purchase_order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_item (id, created_at, updated_at, stock_id, unit_price, qty, purchase_order_id) FROM stdin;
\.


--
-- Data for Name: recipe_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_group (id, created_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: recipe_item_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_item_types (id, value) FROM stdin;
\.


--
-- Data for Name: recipe_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_items (id, created_at, updated_at, stock_items_id, recipe_id, qty, type) FROM stdin;
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (id, created_at, updated_at, code_no, recipe_name, recipe_group_id, sale_type) FROM stdin;
\.


--
-- Data for Name: report_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_group (id, created_at, updated_at, report_name) FROM stdin;
\.


--
-- Data for Name: stock_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_items (id, created_at, updated_at, code_no, name, last_purchase_price, average_purchase_price, low_stock_qty, purchase_qty, inventory_qty, recipe_qty, unit_id, department_id, group_id, type_id, discount, tax_id, supplier_id, batch_id) FROM stdin;
\.


--
-- Data for Name: stock_items_department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_items_department (id, created_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: stock_items_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_items_group (id, created_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: stock_items_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_items_type (id, created_at, updated_at, name) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, created_at, updated_at, name, sup_id, pri_phone_no, sec_phone_no, township, city, status, note, address_detail) FROM stdin;
\.


--
-- Data for Name: tax; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax (id, created_at, updated_at, name, amount) FROM stdin;
\.


--
-- Data for Name: transaction_combo_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_combo_set (id, created_at, updated_at, combo_set_name, quantity, total_amount, price, is_take_away, transaction_id, container_charges, discount_price, combo_set_id) FROM stdin;
\.


--
-- Data for Name: transaction_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_items (id, created_at, updated_at, item_name, quantity, total_amount, price, is_take_away, note, transaction_id, normal_menu_item_id, container_charges, discount_price, flavour_types, transition_combo_set_id) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, created_at, updated_at, grand_total_amount, sub_total_amount, tax_amount, service_charge_amount, discount_amount, discount_name, cash_back, payment, payment_type_id, dinner_table_id, add_on, inclusive, point, void, employee_id, rounding, sync, order_no, customer_count) FROM stdin;
\.


--
-- Data for Name: transfer_in; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transfer_in (id, created_at, updated_at, invoice_no, banch_id, ref_no, status, transfer_in_date, note, transfer_out_do_no, doc_no) FROM stdin;
\.


--
-- Data for Name: transfer_in_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transfer_in_items (id, created_at, updated_at, transfer_qty, qty, transfer_in_id, stock_name, uom) FROM stdin;
\.


--
-- Data for Name: transfer_out; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transfer_out (id, created_at, updated_at, do_no, banch_id, ref_no, status, transfrer_out_date, note, doc_no) FROM stdin;
\.


--
-- Data for Name: transfer_out_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transfer_out_item (id, created_at, updated_at, stock_id, qty, transfer_out_id) FROM stdin;
\.


--
-- Data for Name: unit_of_measurement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_of_measurement (id, created_at, updated_at, purchase_qty, purchase_unit, inventory_qty, inventory_unit, recipe_unit, recipe_qty) FROM stdin;
\.


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: batch batch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: combo_menu_items combo_menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_menu_items
    ADD CONSTRAINT combo_menu_items_pkey PRIMARY KEY (id);


--
-- Name: combo_set combo_set_code_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_set
    ADD CONSTRAINT combo_set_code_name_key UNIQUE (code_name);


--
-- Name: combo_set combo_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_set
    ADD CONSTRAINT combo_set_pkey PRIMARY KEY (id);


--
-- Name: dinner_tables dinner_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dinner_tables
    ADD CONSTRAINT dinner_tables_pkey PRIMARY KEY (id);


--
-- Name: discounts discounts_discount_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_discount_name_key UNIQUE (discount_name);


--
-- Name: discounts discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: family_group family_group_family_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_group
    ADD CONSTRAINT family_group_family_name_key UNIQUE (family_name);


--
-- Name: family_group family_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.family_group
    ADD CONSTRAINT family_group_pkey PRIMARY KEY (id);


--
-- Name: good_received good_received_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_received
    ADD CONSTRAINT good_received_invoice_no_key UNIQUE (invoice_no);


--
-- Name: good_received_item good_received_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_received_item
    ADD CONSTRAINT good_received_item_pkey PRIMARY KEY (id);


--
-- Name: good_received good_received_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_received
    ADD CONSTRAINT good_received_pkey PRIMARY KEY (id);


--
-- Name: good_return_item good_return_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_return_item
    ADD CONSTRAINT good_return_item_pkey PRIMARY KEY (id);


--
-- Name: good_return good_return_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_return
    ADD CONSTRAINT good_return_pkey PRIMARY KEY (id);


--
-- Name: kitchen kitchen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kitchen
    ADD CONSTRAINT kitchen_pkey PRIMARY KEY (id);


--
-- Name: major_group major_group_major_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.major_group
    ADD CONSTRAINT major_group_major_name_key UNIQUE (major_name);


--
-- Name: major_group major_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.major_group
    ADD CONSTRAINT major_group_pkey PRIMARY KEY (id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: menu_recipe_items menu_recipe_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_recipe_items
    ADD CONSTRAINT menu_recipe_items_pkey PRIMARY KEY (id);


--
-- Name: flavour_types name_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flavour_types
    ADD CONSTRAINT name_pkey PRIMARY KEY (id);


--
-- Name: normal_menu_items normal_menu_items_code_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_code_name_key UNIQUE (code_name);


--
-- Name: normal_menu_items normal_menu_items_discount_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_discount_key UNIQUE (discount);


--
-- Name: normal_menu_items normal_menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_pkey PRIMARY KEY (id);


--
-- Name: payment_types payment_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_types
    ADD CONSTRAINT payment_types_pkey PRIMARY KEY (id);


--
-- Name: promotion_items promotion_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_items
    ADD CONSTRAINT promotion_items_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (id);


--
-- Name: promotion_types promotion_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_types
    ADD CONSTRAINT promotion_types_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_item purchase_order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT purchase_order_item_pkey PRIMARY KEY (id);


--
-- Name: purchase_order purchase_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT purchase_order_pkey PRIMARY KEY (id);


--
-- Name: recipe_group recipe_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_group
    ADD CONSTRAINT recipe_group_pkey PRIMARY KEY (id);


--
-- Name: recipe_item_types recipe_item_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_item_types
    ADD CONSTRAINT recipe_item_types_pkey PRIMARY KEY (id);


--
-- Name: recipe_item_types recipe_item_types_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_item_types
    ADD CONSTRAINT recipe_item_types_value_key UNIQUE (value);


--
-- Name: recipe_items recipe_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_items
    ADD CONSTRAINT recipe_items_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_code_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_code_no_key UNIQUE (code_no);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_recipe_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_recipe_name_key UNIQUE (recipe_name);


--
-- Name: report_group report_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_group
    ADD CONSTRAINT report_group_pkey PRIMARY KEY (id);


--
-- Name: report_group report_group_report_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_group
    ADD CONSTRAINT report_group_report_name_key UNIQUE (report_name);


--
-- Name: stock_items stock_items_code_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_code_no_key UNIQUE (code_no);


--
-- Name: stock_items_department stock_items_department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items_department
    ADD CONSTRAINT stock_items_department_pkey PRIMARY KEY (id);


--
-- Name: stock_items_group stock_items_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items_group
    ADD CONSTRAINT stock_items_group_pkey PRIMARY KEY (id);


--
-- Name: stock_items stock_items_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_name_key UNIQUE (name);


--
-- Name: stock_items stock_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_pkey PRIMARY KEY (id);


--
-- Name: stock_items_type stock_items_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items_type
    ADD CONSTRAINT stock_items_type_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_sup_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_sup_id_key UNIQUE (sup_id);


--
-- Name: tax tax_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax
    ADD CONSTRAINT tax_pkey PRIMARY KEY (id);


--
-- Name: transaction_combo_set transaction_combo_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_combo_set
    ADD CONSTRAINT transaction_combo_set_pkey PRIMARY KEY (id);


--
-- Name: transaction_items transaction_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transfer_in_items transfer_in_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_in_items
    ADD CONSTRAINT transfer_in_items_pkey PRIMARY KEY (id);


--
-- Name: transfer_in transfer_in_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_in
    ADD CONSTRAINT transfer_in_pkey PRIMARY KEY (id);


--
-- Name: transfer_out transfer_out_do_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_out
    ADD CONSTRAINT transfer_out_do_no_key UNIQUE (do_no);


--
-- Name: transfer_out_item transfer_out_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_out_item
    ADD CONSTRAINT transfer_out_item_pkey PRIMARY KEY (id);


--
-- Name: transfer_out transfer_out_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_out
    ADD CONSTRAINT transfer_out_pkey PRIMARY KEY (id);


--
-- Name: unit_of_measurement unit_of_measurement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_of_measurement
    ADD CONSTRAINT unit_of_measurement_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: batch set_public_batch_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_batch_updated_at BEFORE UPDATE ON public.batch FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_batch_updated_at ON batch; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_batch_updated_at ON public.batch IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: branches set_public_branches_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_branches_updated_at ON branches; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_branches_updated_at ON public.branches IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: combo_menu_items set_public_combo_menu_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_combo_menu_items_updated_at BEFORE UPDATE ON public.combo_menu_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_combo_menu_items_updated_at ON combo_menu_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_combo_menu_items_updated_at ON public.combo_menu_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: combo_set set_public_combo_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_combo_set_updated_at BEFORE UPDATE ON public.combo_set FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_combo_set_updated_at ON combo_set; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_combo_set_updated_at ON public.combo_set IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: dinner_tables set_public_dinner_tables_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_dinner_tables_updated_at BEFORE UPDATE ON public.dinner_tables FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_dinner_tables_updated_at ON dinner_tables; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_dinner_tables_updated_at ON public.dinner_tables IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: discounts set_public_discounts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_discounts_updated_at BEFORE UPDATE ON public.discounts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_discounts_updated_at ON discounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_discounts_updated_at ON public.discounts IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: employees set_public_employees_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_employees_updated_at ON employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_employees_updated_at ON public.employees IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: family_group set_public_family_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_family_group_updated_at BEFORE UPDATE ON public.family_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_family_group_updated_at ON family_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_family_group_updated_at ON public.family_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: good_received_item set_public_good_received_item_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_good_received_item_updated_at BEFORE UPDATE ON public.good_received_item FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_good_received_item_updated_at ON good_received_item; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_good_received_item_updated_at ON public.good_received_item IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: good_received set_public_good_received_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_good_received_updated_at BEFORE UPDATE ON public.good_received FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_good_received_updated_at ON good_received; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_good_received_updated_at ON public.good_received IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: good_return_item set_public_good_return_item_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_good_return_item_updated_at BEFORE UPDATE ON public.good_return_item FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_good_return_item_updated_at ON good_return_item; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_good_return_item_updated_at ON public.good_return_item IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: good_return set_public_good_return_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_good_return_updated_at BEFORE UPDATE ON public.good_return FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_good_return_updated_at ON good_return; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_good_return_updated_at ON public.good_return IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: kitchen set_public_kitchen_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_kitchen_updated_at BEFORE UPDATE ON public.kitchen FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_kitchen_updated_at ON kitchen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_kitchen_updated_at ON public.kitchen IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: major_group set_public_major_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_major_group_updated_at BEFORE UPDATE ON public.major_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_major_group_updated_at ON major_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_major_group_updated_at ON public.major_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: menu_recipe_items set_public_menu_recipe_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_menu_recipe_items_updated_at BEFORE UPDATE ON public.menu_recipe_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_menu_recipe_items_updated_at ON menu_recipe_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_menu_recipe_items_updated_at ON public.menu_recipe_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: menu set_public_menu_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_menu_updated_at BEFORE UPDATE ON public.menu FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_menu_updated_at ON menu; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_menu_updated_at ON public.menu IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: flavour_types set_public_name_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_name_updated_at BEFORE UPDATE ON public.flavour_types FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_name_updated_at ON flavour_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_name_updated_at ON public.flavour_types IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: normal_menu_items set_public_normal_menu_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_normal_menu_items_updated_at BEFORE UPDATE ON public.normal_menu_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_normal_menu_items_updated_at ON normal_menu_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_normal_menu_items_updated_at ON public.normal_menu_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: payment_types set_public_payment_types_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_payment_types_updated_at BEFORE UPDATE ON public.payment_types FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_payment_types_updated_at ON payment_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_payment_types_updated_at ON public.payment_types IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: promotion_items set_public_promotion_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_promotion_items_updated_at BEFORE UPDATE ON public.promotion_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_promotion_items_updated_at ON promotion_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_promotion_items_updated_at ON public.promotion_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: promotion_types set_public_promotion_types_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_promotion_types_updated_at BEFORE UPDATE ON public.promotion_types FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_promotion_types_updated_at ON promotion_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_promotion_types_updated_at ON public.promotion_types IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: promotion set_public_promotion_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_promotion_updated_at BEFORE UPDATE ON public.promotion FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_promotion_updated_at ON promotion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_promotion_updated_at ON public.promotion IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: purchase_order_item set_public_purchase_order_item_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_purchase_order_item_updated_at BEFORE UPDATE ON public.purchase_order_item FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_purchase_order_item_updated_at ON purchase_order_item; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_purchase_order_item_updated_at ON public.purchase_order_item IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: purchase_order set_public_purchase_order_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_purchase_order_updated_at BEFORE UPDATE ON public.purchase_order FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_purchase_order_updated_at ON purchase_order; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_purchase_order_updated_at ON public.purchase_order IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: recipe_group set_public_recipe_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_recipe_group_updated_at BEFORE UPDATE ON public.recipe_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_recipe_group_updated_at ON recipe_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_recipe_group_updated_at ON public.recipe_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: recipe_item_types set_public_recipe_item_types_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_recipe_item_types_updated_at BEFORE UPDATE ON public.recipe_item_types FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_recipe_item_types_updated_at ON recipe_item_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_recipe_item_types_updated_at ON public.recipe_item_types IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: recipe_items set_public_recipe_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_recipe_items_updated_at BEFORE UPDATE ON public.recipe_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_recipe_items_updated_at ON recipe_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_recipe_items_updated_at ON public.recipe_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: recipes set_public_recipes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_recipes_updated_at ON recipes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_recipes_updated_at ON public.recipes IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: report_group set_public_report_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_report_group_updated_at BEFORE UPDATE ON public.report_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_report_group_updated_at ON report_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_report_group_updated_at ON public.report_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: stock_items_department set_public_stock_items_department_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_stock_items_department_updated_at BEFORE UPDATE ON public.stock_items_department FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_stock_items_department_updated_at ON stock_items_department; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_stock_items_department_updated_at ON public.stock_items_department IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: stock_items_group set_public_stock_items_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_stock_items_group_updated_at BEFORE UPDATE ON public.stock_items_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_stock_items_group_updated_at ON stock_items_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_stock_items_group_updated_at ON public.stock_items_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: stock_items_type set_public_stock_items_type_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_stock_items_type_updated_at BEFORE UPDATE ON public.stock_items_type FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_stock_items_type_updated_at ON stock_items_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_stock_items_type_updated_at ON public.stock_items_type IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: stock_items set_public_stock_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_stock_items_updated_at BEFORE UPDATE ON public.stock_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_stock_items_updated_at ON stock_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_stock_items_updated_at ON public.stock_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: suppliers set_public_suppliers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_suppliers_updated_at ON suppliers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_suppliers_updated_at ON public.suppliers IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: tax set_public_tax_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_tax_updated_at BEFORE UPDATE ON public.tax FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_tax_updated_at ON tax; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_tax_updated_at ON public.tax IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transaction_combo_set set_public_transaction_combo_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transaction_combo_set_updated_at BEFORE UPDATE ON public.transaction_combo_set FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transaction_combo_set_updated_at ON transaction_combo_set; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transaction_combo_set_updated_at ON public.transaction_combo_set IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transaction_items set_public_transaction_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transaction_items_updated_at BEFORE UPDATE ON public.transaction_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transaction_items_updated_at ON transaction_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transaction_items_updated_at ON public.transaction_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transactions set_public_transactions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transactions_updated_at ON transactions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transactions_updated_at ON public.transactions IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transfer_in_items set_public_transfer_in_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transfer_in_items_updated_at BEFORE UPDATE ON public.transfer_in_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transfer_in_items_updated_at ON transfer_in_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transfer_in_items_updated_at ON public.transfer_in_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transfer_in set_public_transfer_in_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transfer_in_updated_at BEFORE UPDATE ON public.transfer_in FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transfer_in_updated_at ON transfer_in; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transfer_in_updated_at ON public.transfer_in IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transfer_out_item set_public_transfer_out_item_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transfer_out_item_updated_at BEFORE UPDATE ON public.transfer_out_item FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transfer_out_item_updated_at ON transfer_out_item; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transfer_out_item_updated_at ON public.transfer_out_item IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: transfer_out set_public_transfer_out_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_transfer_out_updated_at BEFORE UPDATE ON public.transfer_out FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_transfer_out_updated_at ON transfer_out; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_transfer_out_updated_at ON public.transfer_out IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: unit_of_measurement set_public_unit_of_measurement_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_unit_of_measurement_updated_at BEFORE UPDATE ON public.unit_of_measurement FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_unit_of_measurement_updated_at ON unit_of_measurement; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_unit_of_measurement_updated_at ON public.unit_of_measurement IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: combo_menu_items combo_menu_items_combo_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_menu_items
    ADD CONSTRAINT combo_menu_items_combo_set_id_fkey FOREIGN KEY (combo_set_id) REFERENCES public.combo_set(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: combo_menu_items combo_menu_items_normal_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_menu_items
    ADD CONSTRAINT combo_menu_items_normal_menu_item_id_fkey FOREIGN KEY (normal_menu_item_id) REFERENCES public.normal_menu_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: combo_set combo_set_family_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_set
    ADD CONSTRAINT combo_set_family_group_id_fkey FOREIGN KEY (family_group_id) REFERENCES public.family_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: combo_set combo_set_major_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_set
    ADD CONSTRAINT combo_set_major_group_id_fkey FOREIGN KEY (major_group_id) REFERENCES public.major_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: combo_set combo_set_report_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.combo_set
    ADD CONSTRAINT combo_set_report_group_id_fkey FOREIGN KEY (report_group_id) REFERENCES public.report_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: discounts discounts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: good_received_item good_received_item_good_received_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_received_item
    ADD CONSTRAINT good_received_item_good_received_id_fkey FOREIGN KEY (good_received_id) REFERENCES public.good_received(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: good_received_item good_received_item_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_received_item
    ADD CONSTRAINT good_received_item_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stock_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: good_received good_received_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_received
    ADD CONSTRAINT good_received_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_order(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: good_return good_return_good_received_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_return
    ADD CONSTRAINT good_return_good_received_id_fkey FOREIGN KEY (good_received_id) REFERENCES public.good_received(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: good_return_item good_return_item_good_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_return_item
    ADD CONSTRAINT good_return_item_good_return_id_fkey FOREIGN KEY (good_return_id) REFERENCES public.good_return_item(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: good_return_item good_return_item_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.good_return_item
    ADD CONSTRAINT good_return_item_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stock_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: menu_recipe_items menu_recipe_items_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_recipe_items
    ADD CONSTRAINT menu_recipe_items_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.normal_menu_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: menu_recipe_items menu_recipe_items_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_recipe_items
    ADD CONSTRAINT menu_recipe_items_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: normal_menu_items normal_menu_items_family_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_family_group_id_fkey FOREIGN KEY (family_group_id) REFERENCES public.family_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: normal_menu_items normal_menu_items_major_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_major_group_id_fkey FOREIGN KEY (major_group_id) REFERENCES public.major_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: normal_menu_items normal_menu_items_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menu(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: normal_menu_items normal_menu_items_report_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_menu_items
    ADD CONSTRAINT normal_menu_items_report_group_id_fkey FOREIGN KEY (report_group_id) REFERENCES public.report_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: promotion_items promotion_items_combo_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_items
    ADD CONSTRAINT promotion_items_combo_set_id_fkey FOREIGN KEY (combo_set_id) REFERENCES public.combo_set(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: promotion_items promotion_items_normal_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_items
    ADD CONSTRAINT promotion_items_normal_menu_item_id_fkey FOREIGN KEY (normal_menu_item_id) REFERENCES public.normal_menu_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: promotion_items promotion_items_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_items
    ADD CONSTRAINT promotion_items_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: purchase_order purchase_order_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT purchase_order_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: purchase_order_item purchase_order_item_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT purchase_order_item_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_order(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: purchase_order_item purchase_order_item_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT purchase_order_item_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stock_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: purchase_order purchase_order_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT purchase_order_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: recipe_items recipe_items_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_items
    ADD CONSTRAINT recipe_items_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: recipe_items recipe_items_stock_items_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_items
    ADD CONSTRAINT recipe_items_stock_items_id_fkey FOREIGN KEY (stock_items_id) REFERENCES public.stock_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: recipe_items recipe_items_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_items
    ADD CONSTRAINT recipe_items_type_fkey FOREIGN KEY (type) REFERENCES public.recipe_item_types(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: recipes recipes_recipe_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_recipe_group_id_fkey FOREIGN KEY (recipe_group_id) REFERENCES public.recipe_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: recipes recipes_sale_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_sale_type_fkey FOREIGN KEY (sale_type) REFERENCES public.recipe_item_types(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.stock_items_department(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.stock_items_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_tax_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_tax_id_fkey FOREIGN KEY (tax_id) REFERENCES public.tax(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.stock_items_type(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: stock_items stock_items_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_items
    ADD CONSTRAINT stock_items_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit_of_measurement(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transaction_combo_set transaction_combo_set_combo_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_combo_set
    ADD CONSTRAINT transaction_combo_set_combo_set_id_fkey FOREIGN KEY (combo_set_id) REFERENCES public.combo_set(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transaction_combo_set transaction_combo_set_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_combo_set
    ADD CONSTRAINT transaction_combo_set_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transaction_items transaction_items_normal_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_normal_menu_item_id_fkey FOREIGN KEY (normal_menu_item_id) REFERENCES public.normal_menu_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transaction_items transaction_items_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transaction_items transaction_items_transition_combo_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_transition_combo_set_id_fkey FOREIGN KEY (transition_combo_set_id) REFERENCES public.transaction_combo_set(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transactions transactions_dinner_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_dinner_table_id_fkey FOREIGN KEY (dinner_table_id) REFERENCES public.dinner_tables(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transactions transactions_payment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_payment_type_id_fkey FOREIGN KEY (payment_type_id) REFERENCES public.payment_types(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transfer_in transfer_in_banch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_in
    ADD CONSTRAINT transfer_in_banch_id_fkey FOREIGN KEY (banch_id) REFERENCES public.branches(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transfer_in_items transfer_in_items_transfer_in_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_in_items
    ADD CONSTRAINT transfer_in_items_transfer_in_id_fkey FOREIGN KEY (transfer_in_id) REFERENCES public.transfer_in(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transfer_in transfer_in_transfer_out_do_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_in
    ADD CONSTRAINT transfer_in_transfer_out_do_no_fkey FOREIGN KEY (transfer_out_do_no) REFERENCES public.transfer_out(do_no) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transfer_out transfer_out_banch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_out
    ADD CONSTRAINT transfer_out_banch_id_fkey FOREIGN KEY (banch_id) REFERENCES public.branches(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transfer_out_item transfer_out_item_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_out_item
    ADD CONSTRAINT transfer_out_item_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stock_items(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: transfer_out_item transfer_out_item_transfer_out_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transfer_out_item
    ADD CONSTRAINT transfer_out_item_transfer_out_id_fkey FOREIGN KEY (transfer_out_id) REFERENCES public.transfer_out(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

