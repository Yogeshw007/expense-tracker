# 🚂 Railway.app Deployment Guide

## Why Railway.app?

✅ **NO SLEEP** - Your backend stays up 24/7  
✅ **$5 FREE credit/month** - Renews monthly (enough for this app)  
✅ **No cold starts** - Instant response  
✅ **Better performance** - Faster than Render  
✅ **Easy deployment** - 5 minutes setup  

---

## 📋 Prerequisites

- GitHub account
- Your code pushed to GitHub repository
- Neon PostgreSQL database (already set up)

---

## 🚀 Step-by-Step Deployment

### **Step 1: Sign Up for Railway**

1. Go to **[railway.app](https://railway.app/)**
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Authorize Railway to access your repositories

---

### **Step 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **expense-tracker** repository
4. Railway will detect your Dockerfile automatically

---

### **Step 3: Configure Root Directory**

Since your backend is in a subdirectory:

1. Click on your service
2. Go to **Settings** tab
3. Find **"Root Directory"**
4. Set it to: `backend`
5. Click **"Save"**

---

### **Step 4: Add Environment Variables**

1. Go to **Variables** tab
2. Click **"+ New Variable"**
3. Add the following:

```
DATABASE_URL=postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

SPRING_DATASOURCE_URL=postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

SPRING_DATASOURCE_USERNAME=neondb_owner

SPRING_DATASOURCE_PASSWORD=npg_PKD2I0Qgxhku

SPRING_JPA_HIBERNATE_DDL_AUTO=update

SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect

PORT=8080
```

4. Click **"Add"** for each variable

---

### **Step 5: Deploy**

1. Railway will **automatically deploy** after adding variables
2. Wait 2-3 minutes for build to complete
3. Check **Deployments** tab for progress

---

### **Step 6: Get Your Railway URL**

1. Go to **Settings** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

---

### **Step 7: Update Frontend**

Update your frontend `config.js` with the new Railway URL:

```javascript
const API_BASE_URL = 'https://your-app.up.railway.app/api';
```

Then redeploy your frontend to Netlify.

---

## ✅ Verification

Test your backend:

```bash
# Test categories endpoint
curl https://your-app.up.railway.app/api/categories

# Test analytics
curl https://your-app.up.railway.app/api/analytics/stats
```

---

## 💰 Free Tier Limits

- **$5 credit/month** (renews monthly)
- **500 hours** of usage (more than enough)
- **100 GB bandwidth**
- **1 GB RAM** per service

**Your app will use approximately $3-4/month, so you'll stay within free tier!**

---

## 🔧 Troubleshooting

### Build Fails?
- Check **Logs** tab for errors
- Ensure `backend` is set as root directory
- Verify Dockerfile exists in backend folder

### Database Connection Issues?
- Verify all environment variables are set correctly
- Check Neon database is active
- Test connection string manually

### App Not Starting?
- Check if PORT=8080 is set
- Verify Java version in system.properties
- Check application logs

---

## 📊 Monitoring

1. Go to **Metrics** tab to see:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

2. Go to **Logs** tab to see:
   - Application logs
   - Build logs
   - Deployment logs

---

## 🎯 Next Steps

After deployment:
1. ✅ Test all API endpoints
2. ✅ Update frontend config.js
3. ✅ Redeploy frontend to Netlify
4. ✅ Test full application
5. ✅ Remove Render deployment (optional)

---

## 🆚 Railway vs Render

| Feature | Railway | Render (Free) |
|---------|---------|---------------|
| **Sleep** | ❌ Never | ✅ After 15 min |
| **Cold Start** | ❌ None | ✅ 30-60 sec |
| **Free Credit** | $5/month | Limited |
| **Performance** | ⚡ Fast | 🐌 Slow |
| **Uptime** | 99.9% | ~95% |

---

## 📞 Support

- **Railway Docs:** https://docs.railway.app/
- **Discord:** https://discord.gg/railway
- **Status:** https://status.railway.app/

---

**Your backend will be ALWAYS UP on Railway! 🚀**

