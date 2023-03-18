CREATE TYPE F_ENTITY AS ENUM ('FILE', 'FOLDER');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL,
    uuid       UUID UNIQUE        DEFAULT uuid_generate_v4(),
    email      TEXT UNIQUE,
    password   TEXT,
    disk_quota INTEGER   NOT NULL DEFAULT 1000000000,
    is_active  BOOL               DEFAULT FALSE,
    is_delete  BOOLEAN            DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS files
(
    id          SERIAL,
    uuid        UUID UNIQUE      DEFAULT uuid_generate_v4(),
    file_name   TEXT,
    file_entity F_ENTITY,
    file_type   TEXT,
    is_public   BOOLEAN          DEFAULT FALSE,
    file_path   TEXT,
    size        BIGINT,
    parent_id   INTEGER          DEFAULT NULL,
    user_id     INTEGER NOT NULL DEFAULT 2,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id)
        REFERENCES files (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS verification
(
    id        SERIAL,
    user_id   INTEGER NOT NULL UNIQUE,
    email     TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);





