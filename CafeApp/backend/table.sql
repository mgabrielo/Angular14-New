CREATE TABLE user(
    id int PRIMARY KEY AUTOINCREMENT,
    name varchar(250),
    contactnumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);