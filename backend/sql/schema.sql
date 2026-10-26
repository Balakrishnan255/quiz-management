-- Quiz Management System — MySQL schema
DROP DATABASE IF EXISTS quiz_db;
CREATE DATABASE quiz_db;
USE quiz_db;

-- 1. users
CREATE TABLE users (
  user_id     INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. quizzes
CREATE TABLE quizzes (
  quiz_id        INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  timer_minutes  INT NOT NULL DEFAULT 10,
  created_by     INT NOT NULL,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. questions
CREATE TABLE questions (
  question_id    INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id        INT NOT NULL,
  question_text  TEXT NOT NULL,
  option_a       VARCHAR(255) NOT NULL,
  option_b       VARCHAR(255) NOT NULL,
  option_c       VARCHAR(255) NOT NULL,
  option_d       VARCHAR(255) NOT NULL,
  correct_option ENUM('A','B','C','D') NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- 4. quiz_attempts
CREATE TABLE quiz_attempts (
  attempt_id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  quiz_id           INT NOT NULL,
  score             INT NOT NULL,
  total_questions   INT NOT NULL,
  attempted_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- 5. user_answers
CREATE TABLE user_answers (
  answer_id        INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id       INT NOT NULL,
  question_id      INT NOT NULL,
  selected_option  ENUM('A','B','C','D'),
  is_correct       TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Seed default admin (password: admin123, bcrypt hash 10 rounds)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@quiz.com',
 '$2b$10$X1.9MRtVoiR7JqWnha9BZehgcwYkuzEJb5wzQULdWO86.iU0UIoLy', 'admin');

-- Sample quiz
INSERT INTO quizzes (title, description, timer_minutes, created_by) VALUES
('General Knowledge', 'A quick GK quiz', 5, 1);

INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
(1, 'Capital of France?', 'Berlin', 'Paris', 'Rome', 'Madrid', 'B'),
(1, '2 + 2 * 2 = ?', '6', '8', '4', '10', 'A'),
(1, 'Largest planet?', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'C');
