# 🚀 How to Run Expense Tracker Locally

## ❌ Current Issue

Your system has **Java 18**, but the project requires **Java 17 or 21** with compatible Lombok version.

The build is failing due to Lombok compatibility issues with Java 18.

---

## ✅ Solution Options

### **Option 1: Install Java 21 (Recommended)**

#### **For macOS:**

```bash
# Install Java 21 using Homebrew
brew install openjdk@21

# Link it
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Verify installation
java -version
# Should show: openjdk version "21.x.x"
```

#### **After installing Java 21:**

```bash
cd expense-tracker-java

# Build the project
cd backend && mvn clean package -DskipTests

# Run with local H2 database
java -jar target/expense-tracker-1.0.0.jar --spring.profiles.active=local

# Backend will be available at: http://localhost:8080
```

---

### **Option 2: Use the Live Backend (Easiest)**

Since your Neon database is already set up and working, just use the live backend:

#### **1. Start Frontend Locally:**

```bash
cd expense-tracker-java/frontend
python3 -m http.server 8000
```

#### **2. Update Frontend API URL:**

Edit `frontend/js/config.js` and make sure it points to:
```javascript
const API_BASE_URL = 'https://expense-tracker-backend-bxuv.onrender.com/api';
```

#### **3. Open Browser:**

```
http://localhost:8000
```

**Pros:**
- ✅ No Java installation needed
- ✅ Uses your Neon database (data persists)
- ✅ Works immediately

**Cons:**
- ⚠️ Backend sleeps after 15 minutes (use wake-up button)
- ⚠️ Slower response times (cold starts)

---

### **Option 3: Install Docker (Alternative)**

If you don't want to install Java 21, use Docker:

#### **1. Install Docker Desktop:**

Download from: https://www.docker.com/products/docker-desktop

#### **2. Run the script:**

```bash
cd expense-tracker-java
./run-local-with-docker.sh
```

This will:
- ✅ Build Docker image with Java 21
- ✅ Run backend on http://localhost:8080
- ✅ Use local H2 database
- ✅ No Java installation needed on your machine

---

### **Option 4: Use Online IDE (Quick Test)**

Use GitHub Codespaces or Gitpod to run the project in the cloud:

#### **GitHub Codespaces:**

1. Go to: https://github.com/Yogeshw007/expense-tracker
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait for environment to load
4. Run:
```bash
cd expense-tracker-java/backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

---

## 📊 Current Status

| Component | Status |
|-----------|--------|
| **Backend (Render)** | ✅ Running (with Neon DB) |
| **Database (Neon)** | ✅ Connected & Populated |
| **Frontend (Netlify)** | ⏳ Needs deployment |
| **Local Backend** | ❌ Java version incompatible |

---

## 🎯 Recommended Approach

**For immediate use:**
→ **Option 2** (Use live backend with local frontend)

**For full local development:**
→ **Option 1** (Install Java 21) or **Option 3** (Use Docker)

---

## 🆘 Quick Start (Option 2)

```bash
# 1. Start frontend
cd expense-tracker-java/frontend
python3 -m http.server 8000

# 2. Open browser
open http://localhost:8000

# 3. If backend is asleep, click the green power button (⚡)
```

**That's it! Your app is running!** 🎉

---

## 📝 Notes

- Your Neon database has **5 categories** and **11 expenses** already
- All data is stored permanently in Neon
- The live backend URL is: `https://expense-tracker-backend-bxuv.onrender.com`
- Frontend works perfectly with the live backend

---

## ❓ Need Help?

If you want to run everything locally, I recommend:
1. Install Java 21 (takes 5 minutes)
2. Build and run the backend
3. Start the frontend

Otherwise, just use Option 2 - it works great! ✅

