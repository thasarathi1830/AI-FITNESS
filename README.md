# 🏋️ AI Fitness & Food Tracking App

A complete, production-ready full-stack web application for fitness and food tracking powered by AI image analysis using Google Gemini API.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Features

### 🔐 User Authentication
- Secure JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Persistent login sessions

### 👤 User Profile Management
- Store and update personal information (name, age, height, weight)
- Set fitness goals (weight loss, muscle gain, maintenance, etc.)
- BMI calculator
- Profile data used for personalized calorie insights

### 🎯 Daily Fitness Goals
- Set daily calorie intake goals
- Set daily calorie burn goals
- Track progress with visual progress bars
- Date-wise goal management

### 🍽️ Food Intake Tracking
- **Manual Food Entry**: Add food with name, quantity, and calories
- **AI-Powered Image Upload**: 
  - Upload food images
  - Automatic food detection using Google Gemini AI
  - Estimated calorie calculation
  - Save AI-detected results to database
- Date-wise food logs
- View food history

### 🏃 Fitness Activity Tracking
- Add activities: Walking, Running, Cycling, Gym, Yoga, Swimming, Dancing, Hiking
- Duration-based calorie burn calculation
- Automatic calorie estimation based on user weight
- Activity history and logs

### 📊 Dashboard & Analytics
- Daily summary with:
  - Total calories consumed
  - Total calories burned
  - Net calories (consumed - burned)
  - Progress indicators
- Recent food and activity logs
- Beautiful, intuitive UI with charts and cards

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Production database (SQLite for development)
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Google Gemini API**: AI-powered food image analysis

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing
- **Context API**: Global state management

## 📁 Project Structure

```
AI-FITNESS-APP/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── config.py               # Environment configuration
│   │   ├── database.py             # Database setup
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── food_log.py
│   │   │   ├── activity_log.py
│   │   │   └── goals.py
│   │   ├── schemas/                # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── food_log.py
│   │   │   ├── activity_log.py
│   │   │   └── goals.py
│   │   ├── routes/                 # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── food.py
│   │   │   ├── activity.py
│   │   │   ├── goals.py
│   │   │   └── dashboard.py
│   │   ├── services/               # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── gemini_service.py
│   │   │   └── calorie_service.py
│   │   ├── auth/                   # Authentication utilities
│   │   │   ├── jwt_handler.py
│   │   │   └── password.py
│   │   └── utils/                  # Common utilities
│   │       └── dependencies.py
│   ├── uploads/                    # Uploaded images
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FoodUploadPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/             # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   └── ActivityCard.jsx
│   │   ├── context/                # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/               # API services
│   │   │   └── api.js
│   │   ├── hooks/                  # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── utils/                  # Utility functions
│   │   │   └── helpers.js
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works for development)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env and add your credentials:
   # - DATABASE_URL (use SQLite for development or PostgreSQL for production)
   # - JWT_SECRET (generate a secure random string)
   # - GEMINI_API_KEY (your Google Gemini API key)
   # - FRONTEND_URL (http://localhost:5173 for development)
   ```

5. **Run the backend server**
   ```bash
   uvicorn app.main:app --reload
   ```
   
   Backend will be available at: `http://localhost:8000`
   
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env and set:
   # VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./fitness_app.db
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Food Tracking
- `POST /api/food/manual` - Add manual food entry
- `POST /api/food/upload` - Upload food image for AI analysis
- `GET /api/food/logs` - Get food logs (with optional date filter)

### Activity Tracking
- `POST /api/activity` - Add activity
- `GET /api/activity/logs` - Get activity logs (with optional date filter)

### Goals
- `POST /api/goals` - Set daily goals
- `GET /api/goals` - Get goals for date

### Dashboard
- `GET /api/dashboard/summary` - Get daily summary with statistics

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
4. **Add environment variables:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Secure random string
   - `GEMINI_API_KEY` - Your Gemini API key
   - `FRONTEND_URL` - Your frontend URL (e.g., https://yourapp.vercel.app)
5. **Deploy!**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard:**
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add environment variable:**
   - `VITE_API_URL` - Your backend URL (e.g., https://yourapp.onrender.com)

4. **Deploy!**

## 🎨 UI/UX Features

- **Google-inspired minimalist design**
- **Glassmorphism effects** for modern aesthetics
- **Gradient backgrounds** and smooth animations
- **Responsive design** - works on mobile, tablet, and desktop
- **Loading states** for all async operations
- **Error handling** with user-friendly messages
- **Progress bars** for goal tracking
- **Interactive cards** with hover effects
- **Clean typography** using Inter font

## 🧪 Testing

### Test the Application

1. **Start both backend and frontend servers**
2. **Register a new account**
3. **Update your profile** with personal information
4. **Set daily goals** on the dashboard
5. **Upload a food image** to test AI analysis
6. **Add manual food entries**
7. **Log fitness activities**
8. **View dashboard** to see your progress

## 🤝 Contributing

This is a portfolio project, but suggestions and improvements are welcome!

## 📄 License

This project is open source and available for educational and portfolio purposes.

## 🙏 Acknowledgments

- **Google Gemini AI** for food image analysis
- **FastAPI** for the amazing Python framework
- **React** and **Vite** for modern frontend development
- **Tailwind CSS** for beautiful styling


