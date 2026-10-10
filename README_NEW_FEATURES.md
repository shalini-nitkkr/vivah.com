# Vivah — New Features Guide

## What's Added

### 1. 💬 Real-Time Chat (Socket.io)
- **Only available after mutual match** (both parties accepted interest)
- Built with Socket.io for real-time message delivery
- Chat history persisted in MongoDB (`Message` collection)
- Optimistic UI — messages appear instantly, confirmed on server response
- Shows online/offline status, timestamps, read indicators
- Access: Matches page → "💬 Chat" button

### 2. 🔮 Kundli Matchmaking
- **Only available after mutual match**
- Full **Ashtakoot Guna Milan** system (36-point):
  - Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), Nadi (8)
- Visual score bars per Koota with auspicious/inauspicious indicators
- Animated circular score gauge
- Interpretation: Excellent / Very Good / Good / Average / Poor
- Access: Matches page → "🔮 Kundli Match" button

### 3. 🤖 AI Cosine Compatibility
- Shown inside the Kundli page
- **Cosine Similarity** on 7-dimensional profile vectors:
  - Age, Moon Sign (Rashi), Nakshatra, Education, Income, Religion, Gana
- **Preference Match** score: checks age range, religion, city preferences of both
- Combined AI score = 50% cosine + 50% preference match
- Human-readable label: Highly Compatible / Compatible / Moderate / Low Match

### 4. 🎨 Profile Avatars
- Beautiful letter-based avatars when no photo is uploaded
- Distinct color palettes: warm tones for female, cool/earthy for male
- Initials from first + last name
- Used everywhere: Browse, Profile, Matches, Chat, Interests pages

### 5. 🪷 Vivah Logo
- SVG lotus + heart motif in brand crimson & gold
- Used in Navbar (replaces plain text)
- Used in Home page hero section

---

## Setup Instructions

### Server (add socket.io)
```bash
cd matri/server
npm install        # installs socket.io (already in package.json)
npm run dev
```

### Client (add socket.io-client)
```bash
cd matri/client
npm install        # installs socket.io-client (already in package.json)
npm run dev
```

### New MongoDB Collections
- **messages** — Chat messages (matchId, sender, text, read, timestamps)

No migration needed — Mongoose auto-creates collections.

---

## File Changes Summary

### New Server Files
- `server/src/models/Message.js` — Chat message model
- `server/src/routes/chat.js` — Chat REST API + Socket.io emit
- `server/src/routes/kundli.js` — Kundli + AI compatibility API
- `server/src/index.js` — Updated: Socket.io server, new routes

### New Client Files
- `client/src/components/Avatar.jsx` — Avatar component
- `client/src/components/VivahLogo.jsx` — SVG logo component
- `client/src/pages/Chat.jsx` — Real-time chat page
- `client/src/pages/KundliMatch.jsx` — Kundli compatibility page

### Updated Client Files
- `client/src/App.jsx` — Added /chat/:userId and /kundli/:userId routes
- `client/src/components/Navbar.jsx` — VivahLogo instead of text
- `client/src/components/ProfileCard.jsx` — Avatar component
- `client/src/pages/Matches.jsx` — Chat + Kundli buttons
- `client/src/pages/ProfileView.jsx` — Avatar + match-gated Chat/Kundli
- `client/src/pages/Home.jsx` — VivahLogo in hero
- `client/package.json` — Added socket.io-client
- `server/package.json` — Added socket.io
