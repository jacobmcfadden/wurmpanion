DROP TABLE events_roster;
DROP TABLE events;
DROP TABLE role_relationships;
DROP TABLE roles_permissions;
DROP TABLE permissions;
DROP TABLE invitation_roles;
DROP TABLE roles;
DROP TABLE invitations;
DROP TABLE organizations;
DROP TABLE user_activity;
DROP TABLE app_users;
DROP TABLE departments;
DROP TABLE services;
DROP TABLE abstract_services;
DROP TABLE actions;
DROP TABLE zip_codes;
DROP TABLE states;
DROP TABLE info_verifications;
DROP TABLE users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    verify_phone DATE,
    verify_email DATE,
    created_at DATE NOT NULL,
    updated_at DATE,
    two_factor_auth BOOLEAN NOT NULL,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE info_verifications (
    id SERIAL PRIMARY KEY,
    hash_string TEXT NOT NULL,
    expiration_date DATE NOT NULL,
    is_email BOOLEAN NOT NULL,
    info VARCHAR(80) NOT NULL,
    user_id INT REFERENCES users(id)
);

CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    abbreviation VARCHAR(2) NOT NULL
);

CREATE TABLE zip_codes (
    id SERIAL PRIMARY KEY,
    min_range INT NOT NULL,
    max_range INT NOT NULL,
    state_id INT REFERENCES states(id)
);

CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

CREATE TABLE abstract_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(40) NOT NULL
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    abstract_service_id INT REFERENCES abstract_services(id)
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    column_name VARCHAR(25) NOT NULL,
    table_name VARCHAR(25) NOT NULL,
    input_value VARCHAR(100) NOT NULL,
    created_at DATE NOT NULL
);

CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    website_url TEXT,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
);

CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    invite_token TEXT NOT NULL,
    invite_expiration DATE,
    organization_id INT REFERENCES organizations(id),
    user_id INT REFERENCES users(id),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    created_by INT REFERENCES users(id)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR (256) NOT NULL,
    is_admin BOOLEAN NOT NULL,
    internal BOOLEAN NOT NULL,
    organization_id INT REFERENCES organizations(id),
    department_id INT REFERENCES departments(id)
);

CREATE TABLE invitation_roles (
    role_id INT REFERENCES roles(id),
    invitation_id INT REFERENCES invitations(id),
    CONSTRAINT invitation_roles_pkey PRIMARY KEY (role_id, invitation_id)
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(256),
    action_id INT REFERENCES actions(id),
    service_id INT REFERENCES services(id)
);

CREATE TABLE roles_permissions (
    permission_id INT REFERENCES permissions(id),
    role_id INT REFERENCES roles(id),
    CONSTRAINT roles_permissions_pkey PRIMARY KEY (permission_id, role_id)
);

CREATE TABLE role_relationships (
    parent_role_id INT REFERENCES roles(id),
    child_role_id INT REFERENCES roles(id),
    CONSTRAINT role_relationships_pkey PRIMARY KEY (parent_role_id, child_role_id)
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    org_host_id INT REFERENCES organizations(id),
    title VARCHAR(80) NOT NULL,
    description VARCHAR(256) NOT NULL,
    date DATE NOT NULL,
    time INT NOT NULL,
    street_address VARCHAR(150) NOT NULL,
    city VARCHAR (120) NOT NULL,
    state_id INT REFERENCES states(id),
    zip_code_id INT REFERENCES zip_codes(id)
);

CREATE TABLE events_roster(
    event_id INT REFERENCES events(id),
    organization_id INT REFERENCES organizations(id),
    user_id INT REFERENCES users(id),
    rsvp BOOLEAN,
    rsvp_created_at DATE
);