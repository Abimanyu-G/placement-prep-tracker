-- Placement Preparation and Interview Tracking System (MySQL)
-- Create DB and tables

CREATE DATABASE IF NOT EXISTS placement_app;
USE placement_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  department VARCHAR(120),
  year VARCHAR(40),
  skills TEXT,
  role ENUM('student','admin') NOT NULL DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS interviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company VARCHAR(160) NOT NULL,
  interview_date DATE NOT NULL,
  round VARCHAR(160) NOT NULL,
  result ENUM('Pending','Selected','Rejected') NOT NULL DEFAULT 'Pending',
  feedback TEXT,
  CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mocktests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  optionA VARCHAR(255) NOT NULL,
  optionB VARCHAR(255) NOT NULL,
  optionC VARCHAR(255) NOT NULL,
  optionD VARCHAR(255) NOT NULL,
  correct_answer ENUM('A','B','C','D') NOT NULL
);

CREATE TABLE IF NOT EXISTS test_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  test_date DATE NOT NULL,
  CONSTRAINT fk_results_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS preparation_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic VARCHAR(200) NOT NULL,
  platform VARCHAR(120) NOT NULL,
  problems_solved INT NOT NULL,
  date DATE NOT NULL,
  CONSTRAINT fk_prep_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: create a default admin (password below should be replaced with a bcrypt hash)
-- You can create this from the app by registering a student and then updating role,
-- or insert a row with a bcrypt hash.
-- Example (replace <BCRYPT_HASH>):
-- INSERT INTO users (name, email, password, role) VALUES ('admin', 'admin@college.edu', '<BCRYPT_HASH>', 'admin');


