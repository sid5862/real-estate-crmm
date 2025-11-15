# 🚂 Railway Backend Setup Guide

This guide will help you deploy your Flask backend to Railway for free.

## 📋 Prerequisites

- GitHub account (to connect your repository)
- Railway account (free tier available)

---

## 🚀 Step-by-Step Setup

### **Step 1: Sign Up for Railway**

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)

---

### **Step 2: Create MySQL Database**

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"MySQL"**
3. Railway will automatically:
   - Create a MySQL database
   - Set up connection credentials
   - Provide `DATABASE_URL` environment variable

4. **Copy the DATABASE_URL** (you'll need it later)
   - Format: `mysql://user:password@host:port/database`

---

### **Step 3: Deploy Flask Backend**

1. In Railway dashboard, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose your repository: `Real_Esatet_CRMM`
4. Railway will auto-detect Python

---

### **Step 4: Configure Environment Variables**

In your Flask service settings, go to **"Variables"** tab and add:

```
DATABASE_URL=mysql+pymysql://[Railway provides this automatically from MySQL service]
SECRET_KEY=your-super-secret-key-change-this-to-random-string
JWT_SECRET_KEY=another-secret-key-for-jwt-change-this
FLASK_ENV=production
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

**Important Notes:**
- `DATABASE_URL` is automatically linked if you created MySQL service first
- Replace `your-app.vercel.app` with your actual Vercel URL (after deploying frontend)
- Use strong random strings for `SECRET_KEY` and `JWT_SECRET_KEY`

---

### **Step 5: Configure Build Settings**

In Railway service settings:

1. **Root Directory**: Leave empty (or `./`)
2. **Start Command**: `python app.py`
3. **Build Command**: (leave empty, or `pip install -r requirements.txt`)

---

### **Step 6: Deploy**

1. Railway will automatically:
   - Install Python dependencies from `requirements.txt`
   - Start your Flask app
   - Provide a public URL

2. **Get your backend URL**:
   - Format: `https://your-app-name.railway.app`
   - This is your API base URL

---

### **Step 7: Initialize Database**

1. In Railway dashboard, click on your Flask service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"** or **"Connect"** → **"Shell"**

5. Run database initialization:
   ```bash
   python app.py
   ```

   This will:
   - Create all database tables
   - Create default admin user: `admin@realestate.com` / `admin123`

---

### **Step 8: Test Backend**

Test your backend API:

1. Health check: `https://your-app.railway.app/api/health`
   - Should return: `{"status": "healthy", ...}`

2. API root: `https://your-app.railway.app/`
   - Should return: `{"message": "Real Estate CRM API", ...}`

---

## 🔗 Connect to Vercel Frontend

After deploying frontend to Vercel:

1. Get your Vercel URL: `https://your-app.vercel.app`
2. Go back to Railway → Flask service → Variables
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
   ```
4. Railway will automatically redeploy

---

## 📝 Railway Configuration File (Optional)

Create `railway.json` in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python app.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🐛 Troubleshooting

### **Database Connection Error**

- Check `DATABASE_URL` is set correctly
- Verify MySQL service is running
- Check Railway logs for connection errors

### **Build Failed**

- Check `requirements.txt` has all dependencies
- Verify Python version (Railway uses Python 3.11 by default)
- Check build logs in Railway dashboard

### **Port Error**

- Railway automatically sets `PORT` environment variable
- Update `app.py` to use: `port=int(os.getenv('PORT', 5000))`

### **CORS Errors**

- Make sure `ALLOWED_ORIGINS` includes your Vercel URL
- Check Railway logs for CORS-related errors

---

## 💰 Pricing

- **Free Tier**: 500 hours/month, $5 credit
- **Hobby Plan**: $5/month (if you exceed free tier)
- **Perfect for demos!** 🎉

---

## 🔄 Updating Your Backend

1. Push changes to GitHub
2. Railway automatically detects changes
3. Triggers new deployment
4. Your backend updates automatically!

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check Railway logs for detailed error messages

---

**Your backend is now live! 🚀**

