# 🔧 Detailed Installation Guide

## Overview
This guide covers step-by-step installation for Windows, Mac, and Linux.

---

## ✅ Pre-Installation Checklist

### What You Need:
- [ ] Administrator access to your computer
- [ ] A text editor (VS Code recommended)
- [ ] Terminal/Command Prompt
- [ ] Internet connection
- [ ] About 500MB free disk space

---

## 📦 Step 1: Install Node.js

### Windows:
1. Visit https://nodejs.org/
2. Download "LTS" version (recommended)
3. Run installer (.msi file)
4. Accept terms and click "Next" multiple times
5. Install with default settings
6. Restart your computer

### Mac:
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
# Double-click the .pkg file and follow prompts
```

### Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Verify
node --version
npm --version
```

### Verify Installation:
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show v6.0.0 or higher
```

---

## 📁 Step 2: Navigate to Project Folder

### Windows (Command Prompt):
```cmd
cd C:\Users\YourName\OneDrive\Desktop\AgenticStudy
dir
```

### Mac/Linux (Terminal):
```bash
cd ~/Desktop/AgenticStudy
ls
```

You should see:
```
backend/
frontend/
README.md
QUICK_START.md
...
```

---

## 🔌 Step 3: Install Backend Dependencies

### All Systems:
```bash
# Move to backend folder
cd backend

# Install packages listed in package.json
npm install

# Wait for completion (1-2 minutes)
```

### If you see errors:
```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

### Success indicators:
- No red error messages at the end
- See "added XXX packages" message
- `node_modules` folder created

---

## 🎨 Step 4: Install Frontend Dependencies

### All Systems:
```bash
# Go back to main folder
cd ..

# Move to frontend folder
cd frontend

# Install packages
npm install

# Wait for completion
```

### Success indicators:
- No red error messages
- `node_modules` folder created in frontend

---

## ⚙️ Step 5: Configure Environment Variables

### Backend Configuration:

```bash
# Still in frontend folder, go back
cd ../backend

# Check for .env file
# If not present, copy .env.example
cp .env.example .env          # Mac/Linux
copy .env.example .env        # Windows

# Edit .env file with your text editor
# Optional: Add your Claude API key
# CLAUDE_API_KEY=sk-ant-...
```

### Frontend Configuration:

```bash
# Navigate to frontend
cd ../frontend

# Copy template
cp .env.example .env          # Mac/Linux
copy .env.example .env        # Windows

# Usually no changes needed for local development
```

---

## 🚀 Step 6: Start the Backend Server

### All Systems:
```bash
# Make sure you're in backend folder
cd backend

# Start the server
npm start

# You should see:
# ✅ Server is running on: http://localhost:5000
```

**IMPORTANT:** Keep this terminal open! Do NOT close it.

### If "PORT 5000 already in use":
```bash
# Try alternative port
PORT=5001 npm start
```

---

## 🎯 Step 7: Start the Frontend (NEW Terminal)

**OPEN A NEW TERMINAL WINDOW** (keep backend running in first terminal)

### All Systems:
```bash
# Navigate to frontend
cd frontend

# Start the app
npm start

# Browser should open automatically at http://localhost:3000
# If not, manually visit: http://localhost:3000
```

### What you'll see:
1. Terminal shows "Compiled successfully"
2. Browser opens automatically
3. App displays with header "🎓 AI Study Assistant"
4. Server status shows as "Backend Connected"

---

## ✨ Step 8: Verify Everything Works

### Check Backend:
```bash
# In a new terminal, test the API
curl http://localhost:5000/api/health

# Should return something like:
# {"status":"ok","message":"AI Study Assistant Backend is running"...}
```

### Check Frontend:
1. Open http://localhost:3000 in browser
2. You should see the app with two tabs
3. "Question Generator" and "PDF Summarizer"
4. Green indicator showing "Backend Connected"

### Test Feature - Question Generator:
1. Click "Question Generator" tab
2. Enter topic: "Python"
3. Select difficulty: "Beginner"
4. Click "Generate Questions"
5. Should see 3 questions appear
6. Click any question
7. Should see detailed answer

---

## 🐛 Troubleshooting

### Node/npm Not Found
```bash
# Verify installation
node --version
npm --version

# If not found, reinstall Node.js from https://nodejs.org/
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**Solution:** Use different port
```bash
PORT=5001 npm start    # Backend
# Frontend will ask if you want different port
```

### Dependencies Won't Install
```bash
# Clear npm cache
npm cache clean --force

# Delete lock file and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### "Cannot find module" error
- Make sure you ran `npm install` in both backend AND frontend
- Check you're in the correct directory
- Restart terminals and try again

### Frontend shows blank page
- Open DevTools (F12)
- Check Console tab for errors
- Make sure backend is running on :5000
- Check .env file has correct API URL

### Backend not connecting
- Check if backend terminal shows "running"
- Make sure both are on correct ports
- Restart both servers
- Check CORS settings in server.js

---

## 🔑 Optional: Adding Claude API Key

### Step 1: Get API Key
1. Go to https://console.anthropic.com/
2. Sign up with Google or email
3. Click "API Keys" in sidebar
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

### Step 2: Add to Backend
```bash
# Open backend/.env in text editor
# Find line with: CLAUDE_API_KEY=your_claude_api_key_here
# Replace with your actual key: CLAUDE_API_KEY=sk-ant-xxxxx
# Save file

# Restart backend to apply changes
```

### Verify:
- Backend logs should show: "✅ Claude API key configured"
- Responses use real AI instead of mocks

---

## 🎯 Successful Setup Checklist

- [ ] Node.js and npm installed
- [ ] Backend dependencies installed (`node_modules` exists)
- [ ] Frontend dependencies installed (`node_modules` exists)
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] App displays in browser
- [ ] Server status shows "Connected"
- [ ] Can generate questions without errors

---

## 📝 Daily Usage

### To use the app daily:

**Open Terminal 1:**
```bash
cd ~/Desktop/AgenticStudy/backend    # or your path
npm start
```

**Open Terminal 2:**
```bash
cd ~/Desktop/AgenticStudy/frontend   # or your path
npm start
```

**Done!** App opens at http://localhost:3000

---

## 🛑 Stopping the Servers

### To stop:
- **Backend:** Press `Ctrl+C` in backend terminal
- **Frontend:** Press `Ctrl+C` in frontend terminal

### To restart:
- Press up arrow key (shows last command)
- Press Enter
- Or type `npm start` again

---

## 📚 File Locations on Your System

### Windows:
- **Project:** `C:\Users\YourName\OneDrive\Desktop\AgenticStudy\`
- **Backend:** `...\AgenticStudy\backend\`
- **Frontend:** `...\AgenticStudy\frontend\`

### Mac:
- **Project:** `~/Desktop/AgenticStudy/`
- **Backend:** `~/Desktop/AgenticStudy/backend/`
- **Frontend:** `~/Desktop/AgenticStudy/frontend/`

### Linux:
- **Project:** `~/Desktop/AgenticStudy/`
- **Backend:** `~/Desktop/AgenticStudy/backend/`
- **Frontend:** `~/Desktop/AgenticStudy/frontend/`

---

## ✅ You're All Set!

If you've completed all steps:
1. ✅ Backend running on :5000
2. ✅ Frontend running on :3000
3. ✅ App visible in browser
4. ✅ Can test Question Generator
5. ✅ Can test PDF Summarizer

**Congratulations! Happy learning! 🎉**

---

## 📞 Quick Reference

| Problem | Solution |
|---------|----------|
| Port in use | `PORT=5001 npm start` |
| Module error | `npm cache clean && npm install` |
| Blank page | Check F12 console, restart servers |
| Slow install | Normal, first install takes 1-2 min |
| API not responding | Check backend terminal is running |

---

**For more help, see:**
- README.md - Full project docs
- QUICK_START.md - Fast setup
- PROJECT_DOCUMENTATION.md - Code architecture
