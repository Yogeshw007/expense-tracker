# Wake Up Server Script (PowerShell)
# This script pings your backend server to wake it up from sleep

# Backend URL
$BACKEND_URL = "https://expense-tracker-backend-bxuv.onrender.com"

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   Wake Up Backend Server Script       ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

Write-Host "🔌 Backend URL: $BACKEND_URL" -ForegroundColor Yellow
Write-Host ""

# Function to ping server
function Ping-Server {
    param (
        [string]$Endpoint,
        [int]$Attempt,
        [int]$Total
    )
    
    Write-Host "📡 Attempt $Attempt/$Total`: Pinging $Endpoint..." -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri "$BACKEND_URL$Endpoint" -Method Get -TimeoutSec 30 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Success! Server responded with HTTP 200" -ForegroundColor Green
            return $true
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "⏳ Server returned HTTP $statusCode (still waking up...)" -ForegroundColor Yellow
        } else {
            Write-Host "⏳ Server is starting... (no response yet)" -ForegroundColor Yellow
        }
        return $false
    }
    
    return $false
}

Write-Host "🚀 Starting wake-up sequence..." -ForegroundColor Yellow
Write-Host ""

# Ping 1: Categories endpoint
Ping-Server -Endpoint "/api/categories" -Attempt 1 -Total 3
Start-Sleep -Seconds 3

# Ping 2: Analytics stats endpoint
Ping-Server -Endpoint "/api/analytics/stats" -Attempt 2 -Total 3
Start-Sleep -Seconds 3

# Ping 3: Final verification
$isUp = Ping-Server -Endpoint "/api/categories" -Attempt 3 -Total 3

if ($isUp) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║   ✅ SERVER IS UP AND RUNNING!        ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    # Test and display some data
    Write-Host "📊 Fetching server stats..." -ForegroundColor Blue
    
    try {
        $stats = Invoke-RestMethod -Uri "$BACKEND_URL/api/analytics/stats" -Method Get -TimeoutSec 10
        Write-Host "  📁 Total Categories: $($stats.totalCategories)" -ForegroundColor White
        Write-Host "  💰 Total Budget: ₹$($stats.totalBudget)" -ForegroundColor White
        Write-Host "  📝 Total Expenses: $($stats.totalExpenses)" -ForegroundColor White
    }
    catch {
        Write-Host "  ℹ️  Stats not available yet" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🎉 Your backend is ready to use!" -ForegroundColor Green
    Write-Host "🌐 You can now access your frontend at:" -ForegroundColor Blue
    Write-Host "   https://expense-tracker-frontend-pgju.onrender.com" -ForegroundColor Blue
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║   ⚠️  SERVER IS STILL STARTING...     ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 The server is waking up but needs more time." -ForegroundColor Yellow
    Write-Host "   This is normal for Render's free tier." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔄 What to do:" -ForegroundColor Blue
    Write-Host "   1. Wait 30-60 seconds" -ForegroundColor White
    Write-Host "   2. Run this script again: " -NoNewline -ForegroundColor White
    Write-Host ".\wake-up-server.ps1" -ForegroundColor Green
    Write-Host "   3. Or refresh your frontend page" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Tip: To keep server awake, run this every 5 minutes" -ForegroundColor Blue
    Write-Host ""
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

