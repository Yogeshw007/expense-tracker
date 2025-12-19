# 🔌 Wake Up Server - User Guide

## 🎯 Problem

Render's free tier **sleeps after 15 minutes** of inactivity. When you try to access your app, the backend takes **30-60 seconds** to wake up, showing errors like:

- ❌ "Failed to load categories"
- ❌ "Network error"
- ❌ Loading forever...

---

## ✅ Solutions

I've created **TWO solutions** for you:

### **1. UI Button (Easiest)** ⭐ RECOMMENDED
- Green power button in the dashboard
- Click to wake up server
- Shows real-time status
- Works from any device

### **2. Local Scripts (For Developers)**
- Run from your computer
- 3 versions: Bash, PowerShell, Python
- Can automate with cron/scheduler
- Detailed status output

---

## 🖱️ Solution 1: UI Button (In Dashboard)

### **How to Use:**

1. **Open Dashboard** (`index.html`)
2. **Look for the green power button** (bottom-right, next to chat button)
3. **Click the button** when you see "Failed to load" errors
4. **Wait 10-15 seconds** - Status indicator shows progress
5. **Done!** Dashboard auto-refreshes when server is up

### **What You'll See:**

```
🔌 Waking up server...
📡 Pinging server (1/3)...
📡 Pinging server (2/3)...
📡 Verifying server status (3/3)...
✅ Server is UP!
```

### **Features:**

- ✅ **Real-time status** - See progress as server wakes up
- ✅ **Auto-refresh** - Dashboard reloads when ready
- ✅ **Color-coded** - Green = success, Red = still starting
- ✅ **Mobile-friendly** - Works on all devices
- ✅ **No installation** - Just click and wait

---

## 💻 Solution 2: Local Scripts

### **Option A: Python Script (Cross-Platform)** ⭐ RECOMMENDED

**Works on:** Windows, Mac, Linux

**Requirements:** Python 3.6+ with `requests` library

**Install requests:**
```bash
pip install requests
```

**Run:**
```bash
python3 wake-up-server.py
```

**Output:**
```
╔════════════════════════════════════════╗
║   Wake Up Backend Server Script       ║
╚════════════════════════════════════════╝

🔌 Backend URL: https://expense-tracker-backend-bxuv.onrender.com

🚀 Starting wake-up sequence...

📡 Attempt 1/3: Pinging /api/categories...
✅ Success! Server responded with HTTP 200

📊 Fetching server stats...
  📁 Total Categories: 5
  💰 Total Budget: ₹16,700
  📝 Total Expenses: 0

🎉 Your backend is ready to use!
```

---

### **Option B: Bash Script (Mac/Linux)**

**Works on:** Mac, Linux, WSL on Windows

**Run:**
```bash
./wake-up-server.sh
```

**Make executable (if needed):**
```bash
chmod +x wake-up-server.sh
```

---

### **Option C: PowerShell Script (Windows)**

**Works on:** Windows 10/11

**Run:**
```powershell
.\wake-up-server.ps1
```

**If you get execution policy error:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
.\wake-up-server.ps1
```

---

## 🤖 Automate Wake-Up (Keep Server Alive)

### **Option 1: Cron Job (Mac/Linux)**

Keep server awake by running script every 10 minutes:

```bash
# Edit crontab
crontab -e

# Add this line (runs every 10 minutes)
*/10 * * * * cd /path/to/expense-tracker-java && python3 wake-up-server.py

# Save and exit
```

### **Option 2: Task Scheduler (Windows)**

1. Open **Task Scheduler**
2. Create **New Task**
3. **Trigger:** Every 10 minutes
4. **Action:** Run `python3 wake-up-server.py`
5. **Save**

### **Option 3: Watch Command (Mac/Linux)**

Run in a terminal and keep it open:

```bash
# Runs every 5 minutes (300 seconds)
watch -n 300 python3 wake-up-server.py
```

---

## 📊 Comparison

| Method | Ease of Use | Automation | Best For |
|--------|-------------|------------|----------|
| **UI Button** | ⭐⭐⭐⭐⭐ | ❌ Manual | End users |
| **Python Script** | ⭐⭐⭐⭐ | ✅ Yes | Developers |
| **Bash Script** | ⭐⭐⭐⭐ | ✅ Yes | Mac/Linux users |
| **PowerShell** | ⭐⭐⭐ | ✅ Yes | Windows users |

---

## 🎯 Recommended Approach

### **For Regular Users:**
Use the **UI Button** in the dashboard - it's the easiest!

### **For Developers:**
1. Use **Python script** for manual wake-ups
2. Set up **cron job** to keep server alive automatically
3. Or migrate to **Koyeb** for no-sleep hosting (see `KOYEB_DEPLOYMENT.md`)

---

## 🔧 Troubleshooting

### **UI Button Not Working?**

1. Check browser console for errors (F12)
2. Verify `API_BASE_URL` in `config.js`
3. Try running local script instead

### **Script Shows "Still Starting"?**

This is normal! Render takes 30-60 seconds to wake up.

**What to do:**
1. Wait 30 seconds
2. Run script again
3. Server should be up on 2nd attempt

### **Script Fails with Network Error?**

1. Check your internet connection
2. Verify backend URL is correct
3. Check if Render service is down: https://status.render.com/

---

## 💡 Pro Tips

### **Tip 1: Bookmark the Dashboard**
The UI button is always available in the dashboard

### **Tip 2: Create Desktop Shortcut**
**Mac/Linux:**
```bash
# Create alias in ~/.bashrc or ~/.zshrc
alias wake-server='cd /path/to/expense-tracker-java && python3 wake-up-server.py'

# Then just run:
wake-server
```

**Windows:**
Create a `.bat` file:
```batch
@echo off
cd C:\path\to\expense-tracker-java
python wake-up-server.py
pause
```

### **Tip 3: Use with UptimeRobot**
Combine with UptimeRobot (free service) to ping every 5 minutes automatically

---

## 🚀 Better Long-Term Solution

Instead of constantly waking up the server, consider migrating to a platform with **no sleep**:

### **Best Free Options:**
1. **Koyeb** - 100% free, no sleep, no credit card (see `KOYEB_DEPLOYMENT.md`)
2. **Railway** - $5 free credit/month, no sleep (see `RAILWAY_DEPLOYMENT.md`)
3. **Fly.io** - Free tier, no sleep (requires credit card)

**See `FREE_NO_SLEEP_PLATFORMS.md` for detailed comparison**

---

## 📁 Files Created

- ✅ `wake-up-server.py` - Python script (cross-platform)
- ✅ `wake-up-server.sh` - Bash script (Mac/Linux)
- ✅ `wake-up-server.ps1` - PowerShell script (Windows)
- ✅ UI button in `index.html` (dashboard)
- ✅ Wake-up function in `dashboard.js`

---

## ✅ Summary

**Problem:** Render sleeps after 15 minutes

**Quick Fix:** Click green power button in dashboard

**Automated Fix:** Run Python script with cron job

**Best Fix:** Migrate to Koyeb (no sleep, 100% free)

---

**Choose the solution that works best for you!** 🚀

