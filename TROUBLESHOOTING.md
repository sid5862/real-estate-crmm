# 🔧 Real Estate CRM - Troubleshooting Guide

## 🚨 Common Login Issues & Solutions

### **Issue 1: "Login Failed" Error on First Attempt**

**Symptoms:**
- Login button shows "Login Failed" 
- Console shows `ERR_CONNECTION_REFUSED`
- Backend server not responding

**Root Cause:**
The Flask backend server (`python app.py`) is not running.

**Solution:**
1. **Start the backend server:**
   ```bash
   python app.py
   ```
   
2. **Or use the startup script:**
   - Windows: Double-click `start_server.bat`
   - Linux/Mac: Run `./start_server.sh`

3. **Verify server is running:**
   - Check terminal for: `Running on http://127.0.0.1:5000`
   - Visit: http://localhost:5000/api/health

### **Issue 2: Database Connection Errors**

**Symptoms:**
- Server starts but crashes
- MySQL connection errors
- Database table errors

**Solution:**
1. **Start MySQL service:**
   ```bash
   # Windows (if using XAMPP/WAMP)
   # Start MySQL from XAMPP Control Panel
   
   # Linux
   sudo systemctl start mysql
   
   # Mac
   brew services start mysql
   ```

2. **Check database credentials in `.env`:**
   ```
   DATABASE_URL=mysql+pymysql://root:password@localhost/real_estate_crm
   ```

3. **Create database if missing:**
   ```sql
   CREATE DATABASE real_estate_crm;
   ```

### **Issue 3: Port 5000 Already in Use**

**Symptoms:**
- `Address already in use` error
- Server won't start

**Solution:**
1. **Kill existing processes:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

2. **Or use different port:**
   ```bash
   python app.py --port 5001
   ```

### **Issue 4: CORS Errors**

**Symptoms:**
- Browser console shows CORS errors
- API requests blocked

**Solution:**
- CORS is already configured in `app.py`
- Make sure frontend runs on `http://localhost:3000`
- Check browser console for specific CORS errors

## 🛠️ Quick Health Check

Run the health check script:
```bash
python check_server.py
```

This will verify:
- ✅ Database connection
- ✅ Flask server status
- ✅ All systems operational

## 📋 Startup Checklist

Before testing login, ensure:

1. **✅ MySQL is running**
   - Check XAMPP/WAMP control panel
   - Or run: `mysql -u root -p`

2. **✅ Backend server is running**
   - Terminal shows: `Running on http://127.0.0.1:5000`
   - Health check: http://localhost:5000/api/health

3. **✅ Frontend is running**
   - React dev server on: http://localhost:3000
   - No console errors

4. **✅ Database exists**
   - Database: `real_estate_crm`
   - Tables created (run `db.create_all()`)

## 🔍 Debug Steps

### **Step 1: Check Server Status**
```bash
# Check if Flask is running
curl http://localhost:5000/api/health

# Check if React is running  
curl http://localhost:3000
```

### **Step 2: Check Database**
```bash
# Connect to MySQL
mysql -u root -p

# Check database
USE real_estate_crm;
SHOW TABLES;
```

### **Step 3: Check Logs**
- **Backend logs:** Check terminal running `python app.py`
- **Frontend logs:** Check browser console (F12)
- **Network logs:** Check Network tab in browser dev tools

### **Step 4: Test API Directly**
```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestate.com","password":"admin123"}'
```

## 🚀 Recommended Startup Order

1. **Start MySQL** (XAMPP/WAMP or service)
2. **Start Backend:** `python app.py`
3. **Start Frontend:** `npm start` (in separate terminal)
4. **Test Login:** Use demo credentials

## 📞 Demo Credentials

```
Email: admin@realestate.com
Password: admin123
```

## 🔧 Environment Variables

Create `.env` file in project root:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=jwt-secret-string
DATABASE_URL=mysql+pymysql://root:password@localhost/real_estate_crm
```

## 📱 Browser Issues

### **Clear Browser Cache:**
- Press `Ctrl+Shift+R` (hard refresh)
- Or clear browser cache completely

### **Check Console Errors:**
- Press `F12` → Console tab
- Look for red error messages
- Check Network tab for failed requests

## 🆘 Still Having Issues?

1. **Restart everything:**
   - Stop all servers (Ctrl+C)
   - Restart MySQL
   - Start backend: `python app.py`
   - Start frontend: `npm start`

2. **Check file permissions:**
   - Ensure you have read/write access to project folder

3. **Update dependencies:**
   ```bash
   pip install -r requirements.txt
   npm install
   ```

4. **Check system resources:**
   - Ensure sufficient RAM/CPU
   - Close unnecessary applications

---

**💡 Pro Tip:** Always start the backend server first, then the frontend. This prevents the initial connection errors you were experiencing.
