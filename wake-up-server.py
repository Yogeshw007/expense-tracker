#!/usr/bin/env python3
"""
Wake Up Server Script
This script pings your backend server to wake it up from sleep
Works on Windows, Mac, and Linux
No external dependencies required!
"""

import urllib.request
import urllib.error
import time
import sys
import json

# Backend URL
BACKEND_URL = "https://expense-tracker-backend-bxuv.onrender.com"

# Colors for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header():
    """Print script header"""
    print(f"{Colors.BLUE}╔════════════════════════════════════════╗{Colors.ENDC}")
    print(f"{Colors.BLUE}║   Wake Up Backend Server Script       ║{Colors.ENDC}")
    print(f"{Colors.BLUE}╚════════════════════════════════════════╝{Colors.ENDC}")
    print()
    print(f"{Colors.YELLOW}🔌 Backend URL: {BACKEND_URL}{Colors.ENDC}")
    print()

def ping_server(endpoint, attempt, total):
    """Ping server endpoint"""
    print(f"{Colors.BLUE}📡 Attempt {attempt}/{total}: Pinging {endpoint}...{Colors.ENDC}")

    try:
        req = urllib.request.Request(f"{BACKEND_URL}{endpoint}")
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                print(f"{Colors.GREEN}✅ Success! Server responded with HTTP 200{Colors.ENDC}")
                return True
            else:
                print(f"{Colors.YELLOW}⏳ Server returned HTTP {response.status} (still waking up...){Colors.ENDC}")
                return False
    except urllib.error.HTTPError as e:
        print(f"{Colors.YELLOW}⏳ Server returned HTTP {e.code} (still waking up...){Colors.ENDC}")
        return False
    except urllib.error.URLError:
        print(f"{Colors.YELLOW}⏳ Server is starting... (no response yet){Colors.ENDC}")
        return False
    except Exception as e:
        print(f"{Colors.YELLOW}⏳ Server is starting... (connection error){Colors.ENDC}")
        return False

def get_server_stats():
    """Get server statistics"""
    try:
        req = urllib.request.Request(f"{BACKEND_URL}/api/analytics/stats")
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = response.read().decode('utf-8')
                stats = json.loads(data)
                print(f"  📁 Total Categories: {stats.get('totalCategories', 0)}")
                print(f"  💰 Total Budget: ₹{stats.get('totalBudget', 0):,.0f}")
                print(f"  📝 Total Expenses: {stats.get('totalExpenses', 0)}")
            else:
                print("  ℹ️  Stats not available yet")
    except:
        print("  ℹ️  Stats not available yet")

def main():
    """Main function"""
    print_header()
    
    print(f"{Colors.YELLOW}🚀 Starting wake-up sequence...{Colors.ENDC}")
    print()
    
    # Ping 1: Categories endpoint
    ping_server("/api/categories", 1, 3)
    time.sleep(3)
    
    # Ping 2: Analytics stats endpoint
    ping_server("/api/analytics/stats", 2, 3)
    time.sleep(3)
    
    # Ping 3: Final verification
    is_up = ping_server("/api/categories", 3, 3)
    
    print()
    
    if is_up:
        print(f"{Colors.GREEN}╔════════════════════════════════════════╗{Colors.ENDC}")
        print(f"{Colors.GREEN}║   ✅ SERVER IS UP AND RUNNING!        ║{Colors.ENDC}")
        print(f"{Colors.GREEN}╚════════════════════════════════════════╝{Colors.ENDC}")
        print()
        
        print(f"{Colors.BLUE}📊 Fetching server stats...{Colors.ENDC}")
        get_server_stats()
        
        print()
        print(f"{Colors.GREEN}🎉 Your backend is ready to use!{Colors.ENDC}")
        print(f"{Colors.BLUE}🌐 You can now access your frontend at:{Colors.ENDC}")
        print(f"{Colors.BLUE}   https://expense-tracker-frontend-pgju.onrender.com{Colors.ENDC}")
        print()
        
        return 0
    else:
        print(f"{Colors.RED}╔════════════════════════════════════════╗{Colors.ENDC}")
        print(f"{Colors.RED}║   ⚠️  SERVER IS STILL STARTING...     ║{Colors.ENDC}")
        print(f"{Colors.RED}╚════════════════════════════════════════╝{Colors.ENDC}")
        print()
        
        print(f"{Colors.YELLOW}💡 The server is waking up but needs more time.{Colors.ENDC}")
        print(f"{Colors.YELLOW}   This is normal for Render's free tier.{Colors.ENDC}")
        print()
        
        print(f"{Colors.BLUE}🔄 What to do:{Colors.ENDC}")
        print("   1. Wait 30-60 seconds")
        print(f"   2. Run this script again: {Colors.GREEN}python3 wake-up-server.py{Colors.ENDC}")
        print("   3. Or refresh your frontend page")
        print()
        
        print(f"{Colors.BLUE}💡 Tip: Keep server awake by running this every 5 minutes{Colors.ENDC}")
        print(f"   {Colors.GREEN}watch -n 300 python3 wake-up-server.py{Colors.ENDC}")
        print()
        
        return 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠️  Script interrupted by user{Colors.ENDC}")
        sys.exit(1)

