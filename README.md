# 💍 Vivah — Matrimonial Website (MERN Stack)
### MCA College Project

---

## 📁 Project Structure

```
vivah/
├── server/          ← Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/      (User, Interest, Vouch)
│   │   ├── routes/      (auth, profile, interest, vouch, admin)
│   │   ├── middleware/  (JWT auth check)
│   │   └── index.js     (main server file)
│   ├── uploads/     ← profile photos saved here
│   ├── seed.js      ← creates admin account
│   └── .env         ← your settings
│
└── client/          ← Frontend (React + Vite)
    └── src/
        ├── pages/       (Home, Login, Register, Browse, etc.)
        ├── components/  (Navbar, ProfileCard)
        └── context/     (Auth, Toast)
```

---

## 🛠 Step 1 — Install Required Software (Do Once)

### 1. Install Node.js
- Go to: https://nodejs.org
- Download the **LTS** version (green button)
- Run the installer, click Next → Next → Install
- ✅ Verify: Open PowerShell → type `node -v` → should show v18 or v20

### 2. Install MongoDB
- Go to: https://www.mongodb.com/try/download/community
- Choose: Version = latest, Platform = Windows, Package = **msi**
- Run installer → Choose **Complete** → ✅ Check "Install MongoDB as a Service"
- ✅ Verify: Open PowerShell → type `Get-Service -Name MongoDB` → Status = Running

---

## 📦 Step 2 — Set Up Project (Do Once)

Open PowerShell and run these commands one by one:

### Install server packages:
```
cd path\to\vivah\server
npm install
```

### Install client packages:
```
cd path\to\vivah\client
npm install
```

### Create the admin user (run once):
```
cd path\to\vivah\server
node seed.js
```
This creates: **admin@vivah.com** / **admin123**

---

## 🚀 Step 3 — Run the Project (Every Time)

You need **TWO PowerShell windows** open at the same time.

### Terminal 1 — Start Backend:
```
cd path\to\vivah\server
npm run dev
```
✅ You should see: `💍 Server running on http://localhost:5000`

### Terminal 2 — Start Frontend:
```
cd path\to\vivah\client
npm run dev
```
✅ You should see: `Local: http://localhost:5173/`

### Open in Browser:
```
http://localhost:5173
```

---

## 🔑 Login Details

| Account | Email | Password |
|---------|-------|----------|
| Admin   | admin@vivah.com | admin123 |
| You     | (register yourself) | (your password) |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| Register/Login | Create account, JWT authentication |
| Browse Profiles | Search by gender, religion, city, age |
| Send Interest | Like a profile and send interest |
| Accept/Reject | Respond to received interests |
| Matches | See mutual matches with contact details |
| Trust Chain | Get vouched by 3 friends to become Trusted |
| My Profile | Edit details, upload photo |
| Admin Panel | View stats, manage users |

---

## 🛑 How to Stop

- In both PowerShell windows press: **Ctrl + C**

---

## ❓ Common Problems

**"Cannot connect to MongoDB"**
→ Open PowerShell as Admin → run: `Start-Service MongoDB`

**"Port 5000 already in use"**
→ Change PORT=5001 in server/.env

**"npm not found"**
→ Node.js not installed properly. Reinstall from nodejs.org

**Photos not loading**
→ Make sure server is running on port 5000

---

## 🏗 Tech Stack

- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **File Upload:** Multer (local storage)
- **Styling:** Custom CSS (no Tailwind needed)
