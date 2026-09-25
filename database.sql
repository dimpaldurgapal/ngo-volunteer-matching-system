CREATE DATABASE ngo_platform;
USE ngo_platform;

CREATE TABLE ngos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    category VARCHAR(50),
    image VARCHAR(255)
);

INSERT INTO ngos (name, description, category, image) VALUES
('Helping Hands', 'Helping poor children', 'Education', 'https://via.placeholder.com/300'),
('Health NGO', 'Medical support', 'Health', 'https://via.placeholder.com/300'),
('Animal Rescue', 'Saving street animals', 'Animal', 'https://via.placeholder.com/300');

CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    skill VARCHAR(100),
    ngo_id INT,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    password VARCHAR(100)
);