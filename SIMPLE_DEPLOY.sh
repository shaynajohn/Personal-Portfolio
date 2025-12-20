#!/bin/bash

echo "═══════════════════════════════════════════════════════"
echo "  🚀 Deploy Portfolio to GitHub"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "First, make sure you've created a GitHub repository!"
echo ""
read -p "Enter your GitHub username: " username
read -p "Enter your repository name: " repo_name

echo ""
echo "📦 Adding files..."
git add .

echo "💾 Committing..."
git commit -m "Initial commit - Portfolio website"

echo "🌿 Setting main branch..."
git branch -M main

echo "🔗 Connecting to GitHub..."
git remote add origin "https://github.com/$username/$repo_name.git" 2>/dev/null || git remote set-url origin "https://github.com/$username/$repo_name.git"

echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your code is now on GitHub!"
echo ""
echo "📍 Next: Enable GitHub Pages"
echo "   1. Go to: https://github.com/$username/$repo_name"
echo "   2. Click 'Settings' → 'Pages'"
echo "   3. Select 'Deploy from a branch'"
echo "   4. Choose 'main' branch"
echo "   5. Click 'Save'"
echo ""
echo "🌐 Your site will be at: https://$username.github.io/$repo_name"
echo ""

