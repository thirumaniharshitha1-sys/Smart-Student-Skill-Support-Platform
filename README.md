# Student Registration Portal

A full-stack Student Registration Portal developed using React.js, Node.js, Express.js, MongoDB Atlas, and Mongoose.

## Features

- User Registration
- User Login with JWT Authentication
- Password Hashing using bcryptjs
- Student Registration
- View Student List
- Search Students by Name
- Update Student Details
- Delete Students
- Input Validation
- Delete Confirmation
- Total Student Count
- Logout
- MongoDB Atlas Database Integration

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Axios

### Backend
- Node.js
- Express.js
- Mongoose
- JWT (JSON Web Token)
- bcryptjs
- CORS
- dotenv

### Database
- MongoDB Atlas

## Project Structure

```text
Student-Registration-Portal
│
├── client
│   ├── public
│   ├── src
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── Login.js
│   │   └── index.js
│   └── package.json
│
├── server
│   ├── models
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes
│   │   ├── studentRoutes.js
│   │   └── authRoutes.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md