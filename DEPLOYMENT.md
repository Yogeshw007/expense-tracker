# Expense Tracker - Deployment Guide

This guide will help you deploy the Expense Tracker application to free hosting platforms.

## Architecture

- **Backend**: Java Spring Boot (deployed on Render/Railway)
- **Frontend**: HTML/CSS/JavaScript (deployed on Vercel/Netlify)
- **Database**: H2 (file-based, embedded)

## Option 1: Deploy to Render (Recommended - Both Backend & Frontend)

### Backend Deployment on Render

1. **Create a Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Push Code to GitHub**
   ```bash
   cd expense-tracker-java
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Create Web Service on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: expense-tracker-backend
     - **Root Directory**: `backend`
     - **Environment**: Java
     - **Build Command**: `mvn clean package -DskipTests`
     - **Start Command**: `java -jar target/expense-tracker-1.0.0.jar`
     - **Instance Type**: Free

4. **Add Environment Variables**
   - `JAVA_TOOL_OPTIONS`: `-Xmx512m`
   - `PORT`: (auto-set by Render)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the backend URL (e.g., `https://expense-tracker-backend.onrender.com`)

### Frontend Deployment on Render

1. **Create Static Site on Render**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure:
     - **Name**: expense-tracker-frontend
     - **Root Directory**: `frontend`
     - **Build Command**: (leave empty)
     - **Publish Directory**: `.`

2. **Update Frontend Config**
   - Before deploying, update `frontend/js/config.js`:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:8080/api'
       : 'https://expense-tracker-backend.onrender.com/api'; // Your actual backend URL
   ```

3. **Deploy**
   - Commit and push changes
   - Render will auto-deploy
   - Access your app at the provided URL

## Option 2: Deploy to Railway (Backend) + Vercel (Frontend)

### Backend on Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Configure:
     - **Root Directory**: `/backend`
     - Railway auto-detects Java/Maven
   - Add environment variable: `PORT` (Railway sets automatically)

3. **Generate Domain**
   - Go to Settings → Generate Domain
   - Copy the URL

### Frontend on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Other
     - **Build Command**: (leave empty)
     - **Output Directory**: `.`

3. **Update Config**
   - Update `frontend/js/config.js` with Railway backend URL
   - Commit and push
   - Vercel auto-redeploys

## Option 3: Deploy to Netlify (Frontend Only)

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Deploy**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: (leave empty)
     - **Publish directory**: `frontend`

3. **Update Config**
   - Update `frontend/js/config.js` with backend URL
   - Commit and push

## Important Notes

### CORS Configuration
The backend is already configured to allow all origins. For production, you should update:
```properties
spring.web.cors.allowed-origins=https://your-frontend-url.vercel.app
```

### Database Persistence
- H2 database files are stored in `backend/data/`
- On free tiers, data may be lost on restart
- For production, consider upgrading to PostgreSQL

### Free Tier Limitations
- **Render Free**: Spins down after 15 min inactivity (cold starts ~30s)
- **Railway Free**: 500 hours/month, $5 credit
- **Vercel/Netlify**: Unlimited static hosting

## Post-Deployment Checklist

- [ ] Backend is accessible at `/api/categories`
- [ ] Frontend loads correctly
- [ ] Can create categories
- [ ] Can add expenses
- [ ] Chat feature works
- [ ] Analytics displays data

## Troubleshooting

### Backend won't start
- Check Java version (should be 18)
- Check build logs for Maven errors
- Verify `PORT` environment variable

### Frontend can't connect to backend
- Check CORS settings
- Verify backend URL in `config.js`
- Check browser console for errors

### Database errors
- H2 creates database automatically
- Check file permissions
- Verify `spring.datasource.url` path

## Support

For issues, check:
- Render/Railway/Vercel logs
- Browser developer console
- Network tab for API calls

