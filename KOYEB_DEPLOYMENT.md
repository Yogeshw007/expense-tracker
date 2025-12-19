# 🚀 Koyeb Deployment Guide - 100% FREE, NO SLEEP!

## 🎯 Why Koyeb?

✅ **100% FREE** - Forever free tier, no credit card needed  
✅ **NO SLEEP** - Your backend stays up 24/7  
✅ **NO COLD STARTS** - Instant response always  
✅ **2 GB RAM** - More than Railway's free tier  
✅ **100 GB bandwidth/month** - Plenty for your app  
✅ **Easy deployment** - 5 minutes setup  

**This is the BEST free option with NO downtime!**

---

## 📋 Prerequisites

- GitHub account
- Your code pushed to GitHub
- Neon PostgreSQL database (already set up)

---

## 🚀 Step-by-Step Deployment

### **Step 1: Sign Up for Koyeb**

1. Go to **[koyeb.com](https://www.koyeb.com/)**
2. Click **"Sign Up"** or **"Get Started Free"**
3. Sign up with **GitHub** (easiest)
4. **NO CREDIT CARD REQUIRED!** ✅

---

### **Step 2: Create New App**

1. Click **"Create App"** or **"Deploy"**
2. Select **"GitHub"** as deployment method
3. Click **"Authorize Koyeb"** to connect GitHub
4. Select your **expense-tracker** repository

---

### **Step 3: Configure Deployment**

#### **Builder Settings:**

1. **Builder:** Select **"Dockerfile"**
2. **Dockerfile path:** `backend/Dockerfile`
3. **Build context:** `backend`

#### **Instance Settings:**

1. **Instance type:** Select **"Free"** (Eco)
2. **Regions:** Select closest to you (e.g., Washington DC, Frankfurt)
3. **Scaling:** Keep at **1 instance**

---

### **Step 4: Add Environment Variables**

Click **"Environment variables"** and add:

```bash
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

SPRING_DATASOURCE_URL=postgresql://neondb_owner:npg_PKD2I0Qgxhku@ep-round-dawn-adg743ow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

SPRING_DATASOURCE_USERNAME=neondb_owner

SPRING_DATASOURCE_PASSWORD=npg_PKD2I0Qgxhku

# Spring Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update

SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect

SPRING_JPA_SHOW_SQL=false

# Server Configuration
PORT=8080

SERVER_PORT=8080
```

---

### **Step 5: Configure Port**

1. Scroll to **"Exposed ports"**
2. Set port to: **8080**
3. Protocol: **HTTP**

---

### **Step 6: Deploy**

1. Click **"Deploy"**
2. Wait 3-5 minutes for build
3. Watch the build logs in real-time

---

### **Step 7: Get Your Koyeb URL**

1. Once deployed, go to **"Overview"** tab
2. Copy your app URL (e.g., `https://your-app-your-org.koyeb.app`)
3. Test it: `https://your-app-your-org.koyeb.app/api/categories`

---

### **Step 8: Update Frontend**

Update `frontend/js/config.js`:

```javascript
// Replace Render URL with Koyeb URL
const API_BASE_URL = 'https://your-app-your-org.koyeb.app/api';
```

---

### **Step 9: Redeploy Frontend to Netlify**

```bash
cd frontend
git add js/config.js
git commit -m "Update API URL to Koyeb"
git push
```

Netlify will auto-deploy your updated frontend.

---

## ✅ Verification

Test your backend:

```bash
# Test categories
curl https://your-app-your-org.koyeb.app/api/categories

# Test analytics
curl https://your-app-your-org.koyeb.app/api/analytics/stats

# Test health
curl https://your-app-your-org.koyeb.app/api/categories
```

---

## 💰 Free Tier Details

### **What You Get FREE Forever:**

- ✅ **1 web service** (your backend)
- ✅ **2 GB RAM** per instance
- ✅ **100 GB bandwidth/month**
- ✅ **Shared CPU**
- ✅ **NO SLEEP** - Always on!
- ✅ **Auto-scaling** (within free tier)
- ✅ **SSL certificate** included
- ✅ **Custom domains** supported

### **Limits:**

- ⚠️ 1 web service only (perfect for your backend)
- ⚠️ Shared CPU (still fast enough)
- ⚠️ 100 GB bandwidth (plenty for small apps)

**Your app will use ~10-20 GB/month, so you're well within limits!**

---

## 🔧 Troubleshooting

### **Build Fails?**

Check these:
1. Dockerfile path is `backend/Dockerfile`
2. Build context is `backend`
3. Port is set to 8080
4. All environment variables are added

### **App Not Starting?**

1. Check **Logs** tab for errors
2. Verify `PORT=8080` is set
3. Check database connection string
4. Ensure Neon database is active

### **Database Connection Issues?**

1. Verify all `SPRING_DATASOURCE_*` variables
2. Test Neon database connection manually
3. Check if IP is whitelisted in Neon (should be open)

### **Slow Response?**

- First request might be slightly slower (1-2 sec)
- Subsequent requests are instant
- This is normal for free tier

---

## 📊 Monitoring

### **View Logs:**
1. Go to your app dashboard
2. Click **"Logs"** tab
3. See real-time application logs

### **View Metrics:**
1. Click **"Metrics"** tab
2. See CPU, memory, network usage
3. Monitor request count

### **Health Checks:**
Koyeb automatically monitors your app health

---

## 🆚 Koyeb vs Others

| Feature | Koyeb | Railway | Render Free |
|---------|-------|---------|-------------|
| **Cost** | 💚 FREE | 💛 $5 credit | 💚 FREE |
| **Sleep** | ❌ Never | ❌ Never | ✅ 15 min |
| **RAM** | 2 GB | 512 MB | 512 MB |
| **Bandwidth** | 100 GB | 100 GB | Limited |
| **Credit Card** | ❌ No | ✅ Yes | ❌ No |
| **Setup** | 5 min | 5 min | 5 min |

**Koyeb wins for 100% free with no sleep!** 🏆

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed to Koyeb
- [ ] Environment variables configured
- [ ] App is running (check logs)
- [ ] Test API endpoints
- [ ] Update frontend config.js
- [ ] Redeploy frontend to Netlify
- [ ] Test full application
- [ ] Verify no sleep (wait 30 min, test again)

---

## 🚀 Advanced: Custom Domain (Optional)

1. Go to **"Domains"** tab
2. Click **"Add domain"**
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Add CNAME record to your DNS
5. SSL certificate auto-generated

---

## 📞 Support

- **Koyeb Docs:** https://www.koyeb.com/docs
- **Discord:** https://discord.gg/koyeb
- **Status:** https://status.koyeb.com/

---

## 🎉 Success!

**Your backend is now:**
- ✅ **100% FREE** forever
- ✅ **ALWAYS UP** - No sleep, no downtime
- ✅ **FAST** - Instant response
- ✅ **RELIABLE** - 99.9% uptime

**No more Render sleep issues! 🚀**

---

## 💡 Pro Tips

1. **Monitor bandwidth** - Check usage monthly
2. **Optimize images** - Reduce bandwidth usage
3. **Enable caching** - Faster responses
4. **Use CDN** - Netlify already does this for frontend

---

**Your app is now production-ready with 100% uptime! 🎊**

