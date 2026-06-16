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
- Nodejs https://nodejs.org/en
- Git https://git-scm.com/
- VS code editor https://code.visualstudio.com/
- MongoDB Account https://account.mongodb.com/account/login
- GitHub Account https://github.com/signup?source=login

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

---

## Architecture

### Design Patterns

The backend applies object-oriented design patterns to keep business logic clean and maintainable.

#### Factory Pattern — User creation
Centralises creation of role-specific user types (Admin vs Freelancer) so controllers
no longer hardcode role logic during registration.

- `backend/models/users/BaseUser.js` — base class holding common fields and `buildPayload()`
- `backend/models/users/FreelancerUser.js` / `AdminUser.js` — subclasses that set the `role`
- `backend/factories/UserFactory.js` — `UserFactory.create(type, data)` returns the matching user instance
- `backend/controllers/authController.js` — `registerUser` builds the user via the factory before saving

This also demonstrates **inheritance** (`AdminUser`/`FreelancerUser` extend `BaseUser`) and
**polymorphism** (shared `buildPayload()`). Unit tests: `backend/test/factory_test.js` and
`backend/test/auth_test.js` (run with `npm test` from the `backend` folder).

#### Proxy Pattern — Admin project access
Provides controlled, role-based access to the sensitive admin operations (view all projects /
delete any project). The proxy shares the real service's interface and enforces the admin-only
rule before any data operation runs, so the access-control logic lives in one place.

- `backend/services/ProjectService.js` — real subject; performs the actual `getAllProjects()` and
  `deleteProject(id)` work against MongoDB with no access control
- `backend/proxies/ProjectProxy.js` — proxy with the same interface; `ProjectProxy(user, service)`
  rejects non-admin callers (`403`) before delegating to the real service
- `backend/controllers/adminController.js` — `getAllProjects`/`deleteProject` go through the proxy

This reinforces **encapsulation** (the access rule and data work are hidden behind a shared
interface). Unit tests: `backend/test/proxy_test.js` (and `backend/test/admin_test.js`).

#### Strategy Pattern — Project sorting (frontend)
Lets the user sort the project list by Budget, Deadline, or Status at runtime. Each sort
algorithm is an interchangeable strategy sharing a common interface, so the Projects page can
switch behaviour without `if`/`switch` logic.

- `frontend/src/strategies/SortStrategy.js` — base class defining the `sort(projects)` interface
- `frontend/src/strategies/SortByBudget.js` / `SortByDeadline.js` / `SortByStatus.js` — concrete
  strategies that each implement `sort()` differently
- `frontend/src/strategies/index.js` — maps a dropdown key to the strategy instance (`sortStrategies`)
- `frontend/src/pages/Projects.jsx` — selects a strategy from the dropdown and calls `strategy.sort()`

This demonstrates **inheritance** (strategies extend `SortStrategy`) and **polymorphism** (shared
`sort()` method, different algorithms). Unit tests: `frontend/src/strategies/strategies.test.js`
(run with `npm test` from the `frontend` folder).

#### Decorator Pattern — Project display badges (frontend)
Enhances project objects with computed display fields (`isOverdue`, `budgetLevel`) used to render
status badges, without modifying the stored MongoDB project. Decorators wrap a project and can be
stacked, each adding one field.

- `frontend/src/decorators/ProjectDecorator.js` — base decorator exposing `getData()`; supports stacking
- `frontend/src/decorators/OverdueDecorator.js` — adds `isOverdue` (past deadline and not completed)
- `frontend/src/decorators/BudgetLevelDecorator.js` — adds `budgetLevel` (Low / Medium / High)
- `frontend/src/decorators/index.js` — `decorateProject()` stacks the decorators onto a project
- `frontend/src/components/ProjectList.jsx` — renders the computed badges from the decorated data

This demonstrates **inheritance** (decorators extend `ProjectDecorator`) and **polymorphism** (shared
`getData()`, different enrichments). Unit tests: `frontend/src/decorators/decorators.test.js`.

### OOP Principles

The design patterns above are implemented in a class-based style that demonstrates the four
core object-oriented principles:

- **Classes & Objects** — reusable classes such as `BaseUser`, `AdminUser`, `FreelancerUser`,
  and `UserFactory` are instantiated where needed instead of writing procedural code.
- **Encapsulation** — construction logic is hidden inside the classes; callers use
  `UserFactory.create(...)` and `buildPayload()` without knowing the internal details.
- **Inheritance** — `AdminUser` and `FreelancerUser` extend `BaseUser`, reusing common
  fields and behaviour through the base class.
- **Polymorphism** — subclasses share the same `buildPayload()` interface while producing
  role-specific results.