#!/bin/bash

# Script to push your portfolio to GitHub
# Run this AFTER creating your GitHub repository

echo "🚀 Pushing Portfolio to GitHub..."
echo ""

# Add all files
echo "📦 Adding files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Initial commit - Portfolio website"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Get repository URL from user
echo ""
echo "After creating your GitHub repository, GitHub will show you a URL."
echo "It will look like: https://github.com/YOUR_USERNAME/shayna-john-portfolio.git"
echo ""
read -p "Paste that URL here: " repo_url

# Add remote and push
echo ""
echo "🔗 Adding remote repository..."
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! Your code is now on GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to your repository on GitHub"
echo "2. Click 'Settings' → 'Pages' (in left sidebar)"
echo "3. Under 'Source', select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/ (root)' folder"
echo "5. Click 'Save'"
echo ""
echo "Your site will be live at: https://YOUR_USERNAME.github.io/REPO_NAME"
echo ""

