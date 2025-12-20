#!/bin/bash

# GitHub Pages Deployment Script
# Run this after creating your GitHub repository

echo "🚀 Deploying Portfolio to GitHub Pages..."
echo ""
echo "Make sure you've created a GitHub repository first!"
echo "Then replace YOUR_USERNAME with your GitHub username below"
echo ""
read -p "Enter your GitHub username: " username
read -p "Enter your repository name (or press Enter for 'shayna-john-portfolio'): " repo
repo=${repo:-shayna-john-portfolio}

echo ""
echo "📦 Adding files..."
git add .

echo "💾 Committing changes..."
git commit -m "Initial commit - Portfolio website"

echo "🌿 Setting main branch..."
git branch -M main

echo "🔗 Adding remote..."
git remote add origin https://github.com/$username/$repo.git 2>/dev/null || git remote set-url origin https://github.com/$username/$repo.git

echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Now:"
echo "1. Go to: https://github.com/$username/$repo"
echo "2. Click 'Settings' → 'Pages'"
echo "3. Under 'Source', select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/ (root)' folder"
echo "5. Click 'Save'"
echo ""
echo "Your site will be live at: https://$username.github.io/$repo"
echo ""

