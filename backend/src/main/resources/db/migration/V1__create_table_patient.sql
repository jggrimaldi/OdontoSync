CREATE TABLE patient (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    age INTEGER,
    notes TEXT,
    image_url VARCHAR(255)
);