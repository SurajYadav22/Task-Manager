# Task Manager Application

## Overview

This is a full-stack task management application similar to Trello. It allows users to create, update, and manage tasks across different columns. Users can move tasks using drag-and-drop functionality and authenticate with regular login or via Google.

## Features

- User Registration & Login (Email and Google OAuth)
- Create, Read, Update, Delete (CRUD) operations for tasks
- Drag-and-drop functionality to move tasks between columns
- Task reminders and due dates
- Task sorting and searching capabilities
- Error handling and validation for user and task data
- User profiles with avatars
- Fully responsive design

## Technology Stack

- **Frontend:** React.js, Chakra UI, Redux, Drag-and-Drop (React Beautiful DnD)
- **Backend:** Node.js, Express, MongoDB, Passport.js for Google OAuth
- **Database:** MongoDB (NoSQL)
- **Deployment:**
  - Frontend: [Netlify](https://taskmanagerone.netlify.app/)
  - Backend: [Render](https://task-manager-n6tv.onrender.com/)

## Screenshots

1. **Home Page:**
   - A clean and responsive home page displaying tasks in different columns.

2. **Signup / Login Page:**
   - Standard login with Google OAuth integration.
![image](https://github.com/user-attachments/assets/d5f5d973-2932-4ead-b6a4-647af4eb916c)

![image](https://github.com/user-attachments/assets/0535e26c-737a-4f84-ae14-ae506b1b4435)


3. **Task Dashboard:**
   - Task dashboard with drag-and-drop feature to move tasks between columns.
  
  ![image](https://github.com/user-attachments/assets/07dc5cbe-28b4-4b5b-9bdf-3efc424185fe)


4. **Task Details Modal:**
   - A modal window to add, edit, or view details of a task, including title, description, and due dates.

 ![image](https://github.com/user-attachments/assets/5a704339-7f96-4ff0-ab4d-4521d4cf18b1)
  
  ![image](https://github.com/user-attachments/assets/808fdc2b-d82c-4c2a-a7fd-2af2d1d31727)


## Installation and Setup

### Prerequisites
- Node.js
- npm or yarn
- MongoDB (cloud or local instance)

### Frontend

1. Clone the repository:
    ```bash
    git clone https://github.com/SurajYadav22/Task-Manager.git
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) to view the app.

### Backend

1. Clone the repository:
    ```bash
    git clone https://github.com/SurajYadav22/Task-Manager.git
    cd server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file with the following content:

    ```bash
    PORT=4004
    MONGO_URL=your_mongodb_connection_string
    JWT_SecretKEY=your_jwt_secret
    CLIENT_ID=your_google_oauth_client_id
    CLIENT_SECRET=your_google_oauth_client_secret
    CLIENT_URL=your_client_url
    EMAIL_USER=your_email_for_reminders
    EMAIL_PASS=your_email_password
    SESSION_SECRET=your_secret_key
    ```

4. Start the backend server:
    ```bash
    npm run dev
    ```

### Deployed Application

- Frontend URL: [Your Netlify URL](https://taskmanagerone.netlify.app/)
- Backend URL: [Your Render URL](https://task-manager-n6tv.onrender.com/)

## API Endpoints

- **POST** `/users/register` - Register a new user
- **POST** `/users/login` - Login for existing users
- **POST** `/users/auth/google` - Google OAuth login
- **GET** `/users/logout` - Logout
- **GET** `/tasks` - Get all tasks
- **POST** `/add-task` - Create a new task
- **PUT** `/update-task/:id` - Update a task
- **DELETE** `/delete-task/:id` - Delete a task

## Commands

- **Install Dependencies:**
    ```bash
    npm install
    ```
- **Start Development Server:**
    ```bash
    npm run dev
    ```

## Deployment

### Frontend

The frontend is deployed using [Netlify](https://www.netlify.com/). To deploy, follow these steps:

1. Create an account on Netlify.
2. Link your GitHub repository.
3. Set the build command as `npm run build` and the publish directory as `build/`.
4. Deploy the site!

### Backend

The backend is deployed on [Render](https://render.com/). To deploy, follow these steps:

1. Create an account on Render.
2. Connect your repository.
3. Set the start command as `npm start`.
4. Add your environment variables in the Render dashboard.
5. Deploy the backend.

## Testing

Unit tests are written for critical parts of the backend API, particularly around user authentication and task management.

Run tests:
```bash
npm test
