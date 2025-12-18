#!/bin/bash

echo "🚀 Expense Tracker Deployment Helper"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No git remote found"
    echo ""
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote added successfully"
    else
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes"
    echo ""
    read -p "Do you want to commit all changes? (y/n): " commit_choice
    
    if [ "$commit_choice" = "y" ]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    fi
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. Deploy Backend on Render:"
    echo "   - Go to https://render.com"
    echo "   - Click 'New +' → 'Web Service'"
    echo "   - Connect your GitHub repository"
    echo "   - Root Directory: backend"
    echo "   - Build Command: mvn clean package -DskipTests"
    echo "   - Start Command: java -jar target/expense-tracker-1.0.0.jar"
    echo ""
    echo "2. Copy your backend URL (e.g., https://expense-tracker-backend-xyz.onrender.com)"
    echo ""
    echo "3. Update frontend/js/config.js with your backend URL"
    echo ""
    echo "4. Deploy Frontend on Render:"
    echo "   - Click 'New +' → 'Static Site'"
    echo "   - Root Directory: frontend"
    echo "   - Publish Directory: ."
    echo ""
    echo "5. Your app will be live! 🎉"
    echo ""
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your git configuration and try again"
    exit 1
fi

