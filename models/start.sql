CREATE TYPE F_ENTITY AS ENUM ('FILE', 'FOLDER');
CREATE TYPE F_TYPE AS ENUM ('DOC', 'VIDEO', 'IMG', 'PDF',
    'ARCHIVE', 'AUDIO', 'FOLDER');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL,
    email      TEXT,
    password   TEXT,
    is_active  BOOL               DEFAULT FALSE,
    is_delete  BOOLEAN            DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS files
(
    id          SERIAL,
    file_name   TEXT,
    file_entity F_ENTITY,
    file_type   F_TYPE,
    is_public   BOOLEAN DEFAULT FALSE,
    file_path   TEXT,
    size        BIGINT,
    parent_id   INTEGER DEFAULT NULL,
    user_id     INTEGER DEFAULT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id)
        REFERENCES files (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE

);

ALTER TABLE files
    ADD COLUMN uuid UUID UNIQUE DEFAULT uuid_generate_v4();


INSERT INTO files(file_name, file_entity, parent_id)
VALUES ('NAME_1', 'FOLDER', NULL),
       ('NAME_2', 'FILE', NULL),

       ('NAME_3', 'FILE', 1),
       ('NAME_4', 'FOLDER', 1),
       ('NAME_5', 'FILE', 1),

       ('NAME_6', 'FILE', 4),
       ('NAME_7', 'FILE', 4),
       ('NAME_8', 'FOLDER', 4),

       ('NAME_9', 'FOLDER', 8),
       ('NAME_10', 'FILE', 9),
       ('NAME_11', 'FILE', 9);