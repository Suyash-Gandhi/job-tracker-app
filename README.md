# 📂 Job Tracker App

A full-stack MERN application to manage and track job applications, interviews, and follow-ups with advanced filters, analytics, and secure role-based access.

---

## 🚀 Features

- 🔐 JWT-based authentication with secure token management
- 📊 Analytics dashboard to visualize job status (applied, interviewing, rejected, etc.)
- 🔍 Job search, filtering by status/type, and pagination
- 📝 Full CRUD operations for job entries (Create, Read, Update, Delete)
- 👥 Multi-user support with protected routes
- 📅 Schedule view for upcoming deadlines and follow-ups
- 🤝 Professional connections management
- ⭐ Company reviews and interview experiences tracker
- 📱 Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

- **Frontend:** React, CSS, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Others:** bcryptjs for password hashing

---

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn package manager

---

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd "job tracker app"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in terminal)

---

## 📁 Project Structure

```
job tracker app/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── user.js          # User schema
│   │   └── job.js           # Job schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── jobs.js          # Job CRUD routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios instance with auth
│   │   ├── auth/
│   │   │   ├── AuthPge.jsx  # Auth page container
│   │   │   ├── Login.jsx    # Login component
│   │   │   └── Signup.jsx   # Signup component
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashbord/
│   │   │   ├── components/
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── Jobs.jsx      # Job list with filters
│   │   │   │   │   └── Form.jsx      # Add/Edit job form
│   │   │   │   ├── navbar/
│   │   │   │   │   └── Navbar.jsx    # Navigation bar
│   │   │   │   ├── Analytics.jsx     # Analytics dashboard
│   │   │   │   ├── Schedule.jsx      # Upcoming schedule
│   │   │   │   ├── Connections.jsx   # Professional contacts
│   │   │   │   └── Review.jsx        # Company reviews
│   │   │   └── Dashbord.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🎯 Usage

### 1. Authentication
- Sign up with email and password
- Login to access the dashboard
- Token is stored in localStorage for session management

### 2. Job Management
- **Add Job**: Click "+ Add Job" button to create new job application
- **Edit Job**: Click "Edit" button on any job entry
- **Delete Jobs**: Select jobs using checkboxes and click "Delete"
- **Filter**: Use status and mode filters to narrow down results
- **Search**: Search by position, company, or location

### 3. Analytics
- View total applications count
- See application status distribution
- Check work mode preferences

### 4. Schedule
- View upcoming deadlines and follow-ups
- Sorted by date for easy tracking

### 5. Connections
- Add professional contacts (recruiters, HR, etc.)
- Store contact information and notes

### 6. Reviews
- Document interview experiences
- Rate companies and positions
- Track pros and cons

---

## 🔒 Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Protected API routes with middleware
- User-specific data isolation
- Secure token storage

---

## 🌐 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user

### Jobs (Protected)
- `GET /dashbord/jobs` - Get all jobs (with filters)
- `POST /dashbord/jobs` - Create new job
- `PUT /dashbord/jobs/:id` - Update job
- `DELETE /dashbord/jobs` - Delete jobs
- `GET /dashbord/jobs/analytics/stats` - Get analytics

---

## 📌 Status

✅ Project completed and fully functional!

### Features Implemented:
- ✅ User authentication (signup/login)
- ✅ JWT-based authorization
- ✅ Full CRUD operations for jobs
- ✅ Advanced filtering and search
- ✅ Analytics dashboard
- ✅ Schedule management
- ✅ Professional connections tracker
- ✅ Company reviews system
- ✅ Responsive design
- ✅ Protected routes

---

## 🚀 Future Enhancements

- 📧 Email notifications for deadlines
- 📎 Resume/document upload
- 📊 Advanced analytics with charts
- 🔔 Browser notifications
- 📱 Mobile app version
- 🌙 Dark mode
- 📤 Export data to CSV/PDF

---

## 🙋♂️ Author

#### Suyash Gandhi

- Email: suyash25gandhi@gmail.com
- GitHub: https://github.com/Suyash-Gandhi
- LinkedIn: linkedin.com/in/suyash-gandhi-8899302a6

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!
