# 🚀 How to Deploy Your Portfolio Website

You have several free options to get your portfolio online. Here are the easiest methods:

## Option 1: GitHub Pages (Recommended - Free & Easy)

### Step 1: Create a GitHub Account

1. Go to [github.com](https://github.com) and sign up (if you don't have an account)

### Step 2: Create a New Repository

1. Click the "+" icon in the top right → "New repository"
2. Name it: `shayna-john-portfolio` (or any name you like)
3. Make it **Public** (required for free GitHub Pages)
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 3: Upload Your Files

1. In your terminal, run these commands:

```bash
cd "/Users/shayna/Personal Portfolio"
git init
git add .
git commit -m "Initial commit - Portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shayna-john-portfolio.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Wait 1-2 minutes, then visit: `https://YOUR_USERNAME.github.io/shayna-john-portfolio`

**Your website URL will be:** `https://YOUR_USERNAME.github.io/shayna-john-portfolio`

---

## Option 2: Netlify Drop (Easiest - No Account Needed!)

### Step 1: Go to Netlify Drop

1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)

### Step 2: Drag and Drop

1. Drag your entire "Personal Portfolio" folder onto the page
2. Wait for it to upload (takes ~30 seconds)
3. You'll get a URL like: `https://random-name-123.netlify.app`

### Step 3: Customize URL (Optional)

1. Click "Site settings"
2. Click "Change site name"
3. Change to something like: `shayna-john-portfolio`
4. Your new URL: `https://shayna-john-portfolio.netlify.app`

**No account needed!** But if you want to keep the site, create a free Netlify account.

---

## Option 3: Vercel (Also Very Easy)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd "/Users/shayna/Personal Portfolio"
vercel
```

### Step 3: Follow Prompts

- It will ask you to login/create account
- Answer the questions (defaults are fine)
- You'll get a URL like: `https://your-portfolio.vercel.app`

---

## Option 4: Using GitHub Desktop (GUI Method)

If you prefer a visual interface:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Click "File" → "Add Local Repository"
4. Navigate to your "Personal Portfolio" folder
5. Click "Publish repository" → Make it public
6. Go to GitHub.com → Your repository → Settings → Pages
7. Enable GitHub Pages as described in Option 1

---

## 🎯 Quick Recommendation

**For fastest deployment:** Use **Netlify Drop** (Option 2) - just drag and drop!

**For best long-term solution:** Use **GitHub Pages** (Option 1) - free forever, reliable, and looks professional on your resume.

---

## 📝 After Deployment

Once your site is live, you can:

- Add the URL to your resume
- Share it in job applications
- Include it in your LinkedIn profile
- Update it anytime by editing files and pushing changes

---

## 🔄 Updating Your Site

**GitHub Pages:**

```bash
git add .
git commit -m "Update portfolio"
git push
```

(Changes appear in 1-2 minutes)

**Netlify/Vercel:**
Just drag and drop the updated folder again, or connect to GitHub for automatic updates.

---

Need help? Let me know which option you'd like to use!
