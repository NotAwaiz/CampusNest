CREATE DATABASE IF NOT EXISTS campusnest;
USE campusnest;

-- USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('student','owner','admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROPERTIES TABLE
CREATE TABLE properties (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    property_name VARCHAR(150) NOT NULL,
    property_type ENUM('PG','Hostel','Flat','Apartment') NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

-- AMENITIES TABLE
CREATE TABLE amenities (
    amenity_id INT AUTO_INCREMENT PRIMARY KEY,
    amenity_name VARCHAR(100) NOT NULL UNIQUE
);

-- PROPERTY_AMENITIES TABLE
CREATE TABLE property_amenities (
    property_id INT,
    amenity_id INT,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
);

-- PROPERTY_IMAGES TABLE
CREATE TABLE property_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- INQUIRIES TABLE
CREATE TABLE inquiries (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_id INT,
    message TEXT,
    inquiry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- BOOKMARKS TABLE
CREATE TABLE bookmarks (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_id INT,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- REVIEWS TABLE
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- SAMPLE AMENITIES
INSERT INTO amenities (amenity_name) VALUES
('WiFi'),
('AC'),
('Laundry'),
('Parking'),
('Security'),
('Gym');

-- SAMPLE USER
INSERT INTO users
(full_name,email,password,phone,role)
VALUES
('Devansh Katkam',
'devansh@gmail.com',
'123456',
'9876543210',
'student');