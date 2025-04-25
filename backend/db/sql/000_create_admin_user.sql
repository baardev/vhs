SET client_min_messages = 'warning';
-- Create admin user with superuser privileges
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'admin') THEN
      CREATE ROLE admin WITH
         LOGIN
         SUPERUSER
         CREATEDB
         CREATEROLE
         INHERIT
         REPLICATION
         CONNECTION LIMIT -1
         PASSWORD 'admin123';
   END IF;
END
$do$;

-- Grant all privileges on all tables in the vhsdb database to admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO admin; 