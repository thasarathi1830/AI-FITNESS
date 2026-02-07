# 🏋️ AI Fitness & Food Tracking App - MongoDB Atlas Setup Guide

## 📝 Quick Setup Instructions

### 1️⃣ Get Your JWT Secret Key

**Option A: Auto-Generated (Easiest)**
- When you run the backend for the first time, it will auto-generate a JWT secret
- Copy the key from the console output
- Paste it into your `.env` file

**Option B: Generate Manually**
Run this command in your terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Your Generated JWT Secret:**
```
wQK-W4EuhNgpMcwcwPc5PPRAoojYyiK2_YxvKreeLHw
```

Copy this and add it to your `.env` file!

---

### 2️⃣ Set Up MongoDB Atlas (Free Tier)

#### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for a **FREE** account
3. Choose the **FREE M0 tier** (512MB storage)

#### Step 2: Create a Cluster
1. After signing in, click **"Build a Database"**
2. Choose **FREE** shared cluster (M0)
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create Cluster"** (takes 3-5 minutes)

#### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `fitnessapp` (or your choice)
5. Set a strong password (save it!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

#### Step 4: Whitelist Your IP Address
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production: Add your specific IP
4. Click **"Confirm"**

#### Step 5: Get Connection String
1. Go back to **"Database"** (Clusters)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Python**, **Version: 3.12 or later**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### Step 6: Update Connection String
Replace placeholders in the connection string:
- `<username>` → your database username (e.g., `fitnessapp`)
- `<password>` → your database password
- Add database name after `.net/`: `fitness_app`

**Final format:**
```
mongodb+srv://fitnessapp:YourPassword123@cluster0.xxxxx.mongodb.net/fitness_app?retryWrites=true&w=majority
```

---

### 3️⃣ Update Your .env File

Open `backend/.env` and update these values:

```env
# MongoDB Atlas Connection String
DATABASE_URL=mongodb+srv://fitnessapp:YourPassword123@cluster0.xxxxx.mongodb.net/fitness_app?retryWrites=true&w=majority

# JWT Secret Key (use the generated one above)
JWT_SECRET=wQK-W4EuhNgpMcwcwPc5PPRAoojYyiK2_YxvKreeLHw

# Google Gemini API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

### 4️⃣ Install Updated Dependencies

The backend now uses MongoDB instead of PostgreSQL:

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `motor` - Async MongoDB driver for FastAPI
- `pymongo` - MongoDB Python driver

---

### 5️⃣ Run the Application

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## ✅ What Changed?

### Removed:
- ❌ SQLAlchemy
- ❌ PostgreSQL (psycopg2)
- ❌ SQLite

### Added:
- ✅ Motor (async MongoDB driver)
- ✅ PyMongo (MongoDB Python driver)
- ✅ MongoDB Atlas cloud database
- ✅ Auto-generated JWT secret

### Benefits:
- 🚀 **Free cloud database** (no local setup needed)
- 🌍 **Accessible anywhere** (cloud-hosted)
- 📈 **Scalable** (easy to upgrade)
- 🔒 **Secure** (built-in authentication)
- ⚡ **Fast** (optimized for JSON-like documents)

---

## 🔧 Troubleshooting

### Connection Error?
- Check your MongoDB Atlas IP whitelist
- Verify username and password in connection string
- Ensure cluster is active (not paused)

### JWT Secret Not Showing?
- Run the Python command manually to generate a new one
- Or just run the backend - it will auto-generate and display it

### Dependencies Not Installing?
- Make sure you're in the `backend` directory
- Activate your virtual environment first
- Try: `pip install --upgrade pip` then retry

---

## 📚 Next Steps

1. ✅ Update `.env` with MongoDB connection string
2. ✅ Update `.env` with JWT secret
3. ✅ Install dependencies: `pip install -r requirements.txt`
4. ✅ Run backend: `uvicorn app.main:app --reload`
5. ✅ Run frontend: `npm run dev`
6. ✅ Test the application!

---

**Need Help?**
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Python Driver: https://pymongo.readthedocs.io/
