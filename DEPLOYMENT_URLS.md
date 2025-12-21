# 🌐 Deployment URLs & Configuration

This document contains all the live URLs and configuration details for the Expense Tracker application.

---

## 🔗 Live Application URLs

### Frontend (Web Application)
- **Status:** 🟢 Live
- **Platform:** Render
- **URL:** https://expense-tracker-frontend-pgju.onrender.com/index.html
- **Service Name:** expense-tracker-frontend-pgju
- **Repository:** https://github.com/Yogeshw007/expense-tracker.git
- **Deploy Path:** `expense-tracker-java/frontend`

### Backend (REST API)
- **Status:** 🟢 Live
- **Platform:** Render
- **Base URL:** https://expense-tracker-backend-bxuv.onrender.com
- **API Endpoint:** https://expense-tracker-backend-bxuv.onrender.com/api
- **Health Check:** https://expense-tracker-backend-bxuv.onrender.com/api/categories

### Database
- **Status:** 🟢 Live
- **Platform:** Neon (Serverless PostgreSQL)
- **Type:** PostgreSQL 17
- **Region:** AWS US East 1 (N. Virginia)
- **Dashboard:** https://console.neon.tech

---

## 📡 API Endpoints (Live)

### Categories API
- **Get All Categories:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/categories
- **Get Category by ID:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/categories/{id}
- **Create Category:** `POST` https://expense-tracker-backend-bxuv.onrender.com/api/categories
- **Update Category:** `PUT` https://expense-tracker-backend-bxuv.onrender.com/api/categories/{id}
- **Delete Category:** `DELETE` https://expense-tracker-backend-bxuv.onrender.com/api/categories/{id}

### Expenses API
- **Get All Expenses:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/expenses
- **Get Expense by ID:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/expenses/{id}
- **Create Expense:** `POST` https://expense-tracker-backend-bxuv.onrender.com/api/expenses
- **Update Expense:** `PUT` https://expense-tracker-backend-bxuv.onrender.com/api/expenses/{id}
- **Delete Expense:** `DELETE` https://expense-tracker-backend-bxuv.onrender.com/api/expenses/{id}

### Analytics API
- **Monthly Summary:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/analytics/monthly?month={month}&year={year}
- **Category Breakdown:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/analytics/breakdown?month={month}&year={year}
- **Overall Stats:** `GET` https://expense-tracker-backend-bxuv.onrender.com/api/analytics/stats

### Chat API
- **Send Message:** `POST` https://expense-tracker-backend-bxuv.onrender.com/api/chat

---

## 🗄️ Database Configuration

### Neon PostgreSQL (Production)

**Connection Details:**
```
Host: ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech
Port: 5432
Database: neondb
User: neondb_owner
SSL Mode: require
Region: AWS US East 1 (N. Virginia)
```

**Full Connection String:**
```
postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Features:**
- ✅ **Storage:** 512 MB (Free Tier)
- ✅ **Compute:** 191.9 hours/month
- ✅ **Persistence:** Permanent (Never expires)
- ✅ **Backups:** Automatic (7-day retention)
- ✅ **Auto-scaling:** Serverless architecture
- ✅ **Auto-sleep:** After 5 minutes of inactivity (wakes instantly on access)

**Dashboard Access:**
- URL: https://console.neon.tech/app/projects/fancy-hat-85715433
- Project Name: expense-tracker

---

## 🚀 Deployment Platforms

### 1. Backend - Render

**Service Details:**
- **Service Name:** expense-tracker-backend-bxuv
- **Service URL:** https://expense-tracker-backend-bxuv.onrender.com
- **Dashboard:** https://dashboard.render.com
- **Plan:** Free Tier
- **Region:** Oregon (US West)

**Environment Variables:**
```
DATABASE_URL=postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
PORT=8080 (auto-set by Render)
```

**Build Configuration:**
- **Build Command:** `mvn clean install`
- **Start Command:** `java -jar target/expense-tracker-1.0.0.jar`
- **Auto-Deploy:** Enabled (on git push to main branch)

**Free Tier Limitations:**
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes ~30 seconds
- ✅ 750 hours/month free compute

### 2. Frontend - Render

**Service Details:**
- **Service Name:** expense-tracker-frontend-pgju
- **Service URL:** https://expense-tracker-frontend-pgju.onrender.com/index.html
- **Dashboard:** https://dashboard.render.com
- **Plan:** Free Tier (Static Site)
- **Region:** Oregon (US West)

**Build Configuration:**
- **Build Command:** (none - static files)
- **Publish Directory:** `expense-tracker-java/frontend`
- **Auto-Deploy:** Enabled (on git push to main branch)

**Free Tier Features:**
- ✅ Always online (no spin-down for static sites)
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Unlimited bandwidth

### 3. Database - Neon

**Project Details:**
- **Project ID:** fancy-hat-85715433
- **Project Name:** expense-tracker
- **Created:** December 2025
- **Plan:** Free Tier

---

## 🔐 Security Notes

⚠️ **Important:** The database password is currently exposed in this file for development purposes.

**For Production:**
1. Rotate the database password in Neon dashboard
2. Update the `DATABASE_URL` environment variable in Render
3. Remove sensitive credentials from this file
4. Use environment variables and secrets management

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
- URL: https://dashboard.render.com → Select service → "Logs" tab
- Real-time logs available
- Shows API requests, errors, and database connections

### Database Monitoring (Neon)
- URL: https://console.neon.tech → Select project → "Monitoring" tab
- Shows query performance, storage usage, compute time

---

## 🛠️ Quick Commands

### Test Backend API
```bash
# Check if backend is alive
curl https://expense-tracker-backend-bxuv.onrender.com/api/categories

# Get all expenses
curl https://expense-tracker-backend-bxuv.onrender.com/api/expenses

# Get analytics stats
curl https://expense-tracker-backend-bxuv.onrender.com/api/analytics/stats
```

### Seed Database with Sample Data
```bash
# Run the seed script
cd expense-tracker-java
./seed-data.sh
```

---

## 📝 Update History

- **2025-12-19:** Initial deployment with Neon PostgreSQL
- **2025-12-19:** Backend deployed to Render
- **2025-12-19:** Database seeded with sample data
- **Pending:** Frontend deployment to Netlify

---

## 🆘 Support & Issues

- **GitHub Repository:** https://github.com/Yogeshw007/expense-tracker
- **Backend Issues:** Check Render logs
- **Database Issues:** Check Neon console
- **Frontend Issues:** Check browser console

---

**Last Updated:** December 19, 2025

