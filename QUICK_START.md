## ⚡ QUICK START - Run in 5 Minutes!

### Prerequisites
- Node.js 14+ installed (https://nodejs.org/)
- npm comes with Node.js

### Step 1: Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm start
```

✅ You'll see: `Server is running on: http://localhost:5000`

### Step 2: Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

✅ Browser opens automatically at `http://localhost:3000`

**Done!** 🎉 App is ready to use!

---

## 🎯 How to Use

### Question Generator
1. Enter any topic (e.g., "Python", "Biology")
2. Pick difficulty (Beginner/Intermediate/Advanced)
3. Click "Generate Questions"
4. Click any question to see the answer

### PDF Summarizer
1. Click "Browse Files"
2. Select a PDF
3. Click "Summarize PDF"
4. Get summary + key points + concepts

---

## ⚙️ Optional: Add Claude API Key

Edit `backend/.env`:
```
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
```

Get key at: https://console.anthropic.com/

(Works fine without it - uses mock AI!)

---

## 🆘 Troubleshooting

**Port 5000 in use?**
```bash
cd backend
PORT=5001 npm start
```

**Port 3000 in use?**
- React will prompt you to use 3001 instead

**Dependencies error?**
```bash
cd backend
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

---

**Stuck?** See full [README.md](./README.md)
