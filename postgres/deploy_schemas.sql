-- Deploy fresh database tables
--\i execute scripts
\i  '/docker-entrypoint-initdb.d/tables/users.sql' 
\i  '/docker-entrypoint-initdb.d/tables/login.sql' 
--\i  '/docker-entrypoint-initdb.d/tables/seed.sql' 