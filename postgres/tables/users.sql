BEGIN TRANSACTION;
CREATE TABLE users
(
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries bigint DEFAULT 0,
    joined timestamp NOT NULL,
    age bigint DEFAULT 0
);
COMMIT;