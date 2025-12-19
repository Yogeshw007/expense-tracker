# 🚀 Quick Reference Card

## 🔗 Essential URLs

| Service | URL |
|---------|-----|
| **Backend API** | https://expense-tracker-backend-bxuv.onrender.com/api |
| **Frontend** | Coming Soon (Netlify) |
| **Database Dashboard** | https://console.neon.tech |
| **Render Dashboard** | https://dashboard.render.com |
| **GitHub Repo** | https://github.com/Yogeshw007/expense-tracker |

---

## 📡 Quick API Tests

```bash
# Get all categories
curl https://expense-tracker-backend-bxuv.onrender.com/api/categories

# Get all expenses
curl https://expense-tracker-backend-bxuv.onrender.com/api/expenses

# Get analytics
curl https://expense-tracker-backend-bxuv.onrender.com/api/analytics/stats
```

---

## 🗄️ Database Quick Info

```
Host: ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech
Database: neondb
Type: PostgreSQL 17
Provider: Neon (Serverless)
Status: ✅ Permanent (Never expires)
```

---

## 🔧 Environment Variables (Render)

```bash
DATABASE_URL=postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🌱 Seed Database

```bash
cd expense-tracker-java
./seed-data.sh
```

---

## 📦 Local Development

```bash
# Backend
cd expense-tracker-java/backend
mvn spring-boot:run

# Frontend
cd expense-tracker-java/frontend
python3 -m http.server 3000
```

---

## ✅ Status Check

- **Backend:** 🟢 Live on Render
- **Database:** 🟢 Live on Neon (Permanent)
- **Frontend:** 🟡 Pending Netlify deployment

---

## 🎯 Next Steps

1. ✅ Add `DATABASE_URL` to Render environment variables
2. ⏳ Wait for Render to redeploy (~2-3 minutes)
3. 🌱 Run seed script to populate data
4. 🚀 Deploy frontend to Netlify
5. 🎉 Start tracking expenses!

