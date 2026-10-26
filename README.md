# Quiz Management System

A full-stack Quiz Management System with separate **Admin** and **User** roles.

## Tech Stack

* React (Vite)
* Node.js
* Express.js
* MySQL
* JWT Authentication
* bcrypt
* Axios

---

## Project Structure

```text
quiz-management-system/
├── backend/
└── frontend/
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sairamd-18/quiz-management.git
cd quiz-management
```

### 2. Set up the database

Run the SQL file inside `backend/sql/schema.sql` to create the database and tables.

Default admin account:

* **Email:** [admin@quiz.com](mailto:admin@quiz.com)
* **Password:** admin123

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Features

### User

* Sign up and log in
* View available quizzes
* Attempt quizzes with a timer
* Automatic submission when time expires
* View scores and previous attempts

### Admin

* Create, update, and delete quizzes
* Add, edit, and remove questions
* View users and quiz attempts
* Dashboard with quiz statistics

---

## Database Tables

* Users
* Quizzes
* Questions
* Quiz Attempts
* User Answers

---

## Security

* Password hashing using bcrypt
* JWT-based authentication
* Role-based access control
* Environment variables for sensitive data

---

## API Modules

* Authentication
* Users
* Quizzes
* Questions
* Results

---

## Future Improvements

* Leaderboard
* Question categories
* Image-based questions
* Email notifications
* Performance analytics



