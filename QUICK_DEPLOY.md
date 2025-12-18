# Quick Deployment Guide - Expense Tracker

## 🚀 Fastest Way to Deploy (Using Render - 100% Free)

### Step 1: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
   - Name it: `expense-tracker`
   - Make it Public
   - Don't initialize with README

2. Push your code:
   ```bash
   cd expense-tracker-java
   git commit -m "Initial commit - Expense Tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
   git push -u origin main
   ```

### Step 2: Deploy Backend on Render

1. Go to https://render.com and sign up with GitHub

2. Click **"New +"** → **"Web Service"**

3. Connect your `expense-tracker` repository

4. Configure the service:
   ```
   Name: expense-tracker-backend
   Root Directory: backend
   Environment: Java
   Build Command: mvn clean package -DskipTests
   Start Command: java -jar target/expense-tracker-1.0.0.jar
   Instance Type: Free
   ```

5. Click **"Create Web Service"**

6. Wait 5-10 minutes for deployment

7. **Copy your backend URL** (e.g., `https://expense-tracker-backend-xyz.onrender.com`)

### Step 3: Update Frontend Configuration

1. Edit `frontend/js/config.js` and replace the backend URL:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:8080/api'
       : 'https://expense-tracker-backend-xyz.onrender.com/api'; // YOUR ACTUAL URL HERE
   ```

2. Commit and push:
   ```bash
   git add frontend/js/config.js
   git commit -m "Update backend URL for production"
   git push
   ```

### Step 4: Deploy Frontend on Render

1. In Render dashboard, click **"New +"** → **"Static Site"**

2. Connect the same `expense-tracker` repository

3. Configure:
   ```
   Name: expense-tracker-frontend
   Root Directory: frontend
   Build Command: (leave empty)
   Publish Directory: .
   ```

4. Click **"Create Static Site"**

5. Wait 2-3 minutes

6. **Your app is live!** 🎉

### Step 5: Test Your Deployment

Visit your frontend URL and test:
- ✅ Create a category
- ✅ Add an expense
- ✅ Use the chat feature
- ✅ View analytics

## 🎯 Alternative: Deploy to Vercel (Frontend) + Railway (Backend)

### Backend on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Set root directory to `/backend`
6. Railway auto-detects Java
7. Click **"Deploy"**
8. Go to **Settings** → **Generate Domain**
9. Copy the URL

### Frontend on Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your repository
5. Configure:
   ```
   Root Directory: frontend
   Framework Preset: Other
   Build Command: (leave empty)
   Output Directory: .
   ```
6. Update `frontend/js/config.js` with Railway backend URL
7. Commit and push
8. Vercel auto-deploys

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Backend spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free

**Railway Free Tier:**
- $5 credit per month
- ~500 hours of usage

**Vercel/Netlify:**
- Unlimited static site hosting
- No cold starts

### Database Persistence

- H2 database is file-based
- On Render free tier, data persists between deploys
- Data may be lost if service is deleted

### CORS Configuration

The app is already configured to allow all origins. For production security, update `backend/src/main/resources/application.properties`:

```properties
spring.web.cors.allowed-origins=https://your-frontend-url.onrender.com
```

## 🐛 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify Java 18 is being used
- Check Maven build succeeded

### Frontend can't connect
- Verify backend URL in `config.js`
- Check browser console for CORS errors
- Ensure backend is running (visit backend URL)

### Cold Start Issues
- First request after 15 min takes ~30s on Render free tier
- This is normal for free hosting
- Consider upgrading for production use

## 📱 Access Your App

After deployment, you'll have:
- **Frontend**: `https://expense-tracker-frontend.onrender.com`
- **Backend**: `https://expense-tracker-backend.onrender.com`

Share the frontend URL with anyone to use your expense tracker!

## 🎉 You're Done!

Your expense tracker is now live and accessible from anywhere!

Features available:
- ✅ Dashboard with stats
- ✅ Add/Edit/Delete expenses
- ✅ Category management
- ✅ Analytics and charts
- ✅ Natural language chat interface
- ✅ Automatic icon assignment
- ✅ Monthly budget tracking

