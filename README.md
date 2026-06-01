# Freelance Project Manager
## Project Overview
The Freelance Project Manager is an online platform that enables freelancers to create and manage their projects. This addresses the need for a system that freelancers can access anywhere with an internet connection to manage projects and track their progress.

---

## Features
### User/Freelancer Features

- Register/Signup
- Login
- Logout
- Update user profile
- Add user/freelancer projects
- View user/freelancer projects
- Update user/freelancer tasks
- Delete user/freelancer projects
### Admin Features
- View all projects
- Delete projects

---

## Technology Stack
### Frontend
- React.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Other Tools
- Git and GitHub
- JIRA
- Figma
- VS Code Editor

---

## JIRA Board

JIRA Board Link: https://myqut-connect-team.atlassian.net/jira/software/projects/FPM/boards/35

---

## Prerequisites
Install the following software and create the required accounts:
* **Nodejs [**[https://nodejs.org/en](https://nodejs.org/en)]** **
* **Git [**[https://git-scm.com/](https://git-scm.com/)]** **
* **VS code editor** [[https://code.visualstudio.com/](https://code.visualstudio.com/)]** **
* **MongoDB Account** [[https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)]**
* **GitHub Account** [[https://github.com/signup?source=login](https://github.com/signup?source=login)]** **

---

## Installation and Setup
1. Clone the Repository
git clone https://github.com/PeterK1212/PKFreelanceProjectManager.git
cd PKFreelanceProjectManager

2. Install Backend Dependencies
cd backend
npm install

3. Configure Environment Variables
Create a .env file inside the backend folder and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001

4. Install Frontend Dependencies
cd frontend
npm install

5. Run the Backend Server
cd backend
npm start

6. Run the Frontend Application
cd frontend
npm run dev

7. Edit frontend axiosConfig.jsx baseURL to:
baseURL: 'http://localhost:5001'

8. Open the Application
Frontend:
http://localhost:3000

Backend API:
http://localhost:5001

---

## Public URL
http://3.26.196.206

---

## Test Credentials
### Admin Account
Username/Email: peter.kok@connect.qut.edu.au  
Password: Welcome1

### User Account
Username/Email: test@test.com  
Password: Welcome1

---

### GitHub Repository
https://github.com/PeterK1212/PKFreelanceProjectManager