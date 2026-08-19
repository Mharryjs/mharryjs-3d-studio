# 🌌 3D Full-Stack Portfolio — HTML · CSS · JS + Node/Express + Database

Ek complete portfolio project: **4 pages**, **3D animated transparent design**, **real backend**, **real database** — frontend pe koi framework nahi (no React, no Tailwind, no Three.js).

---

## ✏️ APNA BANANE KA TAREEQA (How to make it yours)

Aapko poora code padhne ki zarurat nahi. Sirf **2 jagah** edit karo:

### 1️⃣ Colors — `index.html` ke top pe `<style>` mein
```css
:root{
  --c1:#e879f9;   /* pink   — primary accent  */
  --c2:#a78bfa;   /* violet — secondary       */
  --c3:#7dd3fc;   /* blue   — tertiary        */
  --bg:#05030e;   /* background               */
}
```
Bas 4 colors change karo → poori website ka theme badal jayega (buttons, glow, 3D orb, sab).

### 2️⃣ Content — `<script>` ke top pe `CONFIG` object
```js
const CONFIG = {
  brand:      "Nova",              // ← apna naam
  role:       "Portfolio",         // ← "Web Developer" etc.
  logoLetter: "N",                 // ← logo ka letter
  heroTitle:  "Crafting worlds<br/>out of pure code.",
  heroSub:    "...",
  email:      "hello@yoursite.com",
  ...
};
```

| CONFIG key | Kya control karta hai |
|---|---|
| `brand`, `role`, `logoLetter`, `fullName` | Navbar + footer |
| `heroPill`, `heroTitle`, `heroSub`, `ctaPrimary`, `ctaSecondary` | Home hero section |
| `stats[]` | Home ke counter boxes (`{n, suffix, label}`) |
| `services[]` | Service cards (`{icon, title, text, tags[]}`) |
| `stack[]` | Technology chips |
| `projects[]` | **Work page** ke project cards (`{emoji, title, text, tags[], demo, code, g}`) |
| `email`, `location`, `reply`, `socials[]` | Contact page info + social links |
| `projectTypes[]` | Contact form ka dropdown |
| `bg{}` | **3D background tuning** — nodes, tendrils, stars, speed, size, RGB colors |
| `apiUrl` | Backend endpoint |

Array mein item add/remove karo → cards khud ba khud add/remove ho jayenge. ✅

### 🎛️ 3D Background tune karna
```js
bg: {
  nodes: 210,            // kam karo (jaise 120) = purane laptop pe tez chalega
  tendrils: 9,           // bahar nikalne wale arms
  starDensity: 5200,     // chhota number = zyada stars
  rotationSpeed: 0.0042, // spin speed
  orbSize: 0.20,         // 0.10 – 0.30
  colorCore: [236,140,250],  // pink lines RGB
  colorBack: [140,180,255],  // blue lines RGB
  shellColor:[84,120,255]    // outer bubble RGB
}
```

---

## 🚀 Run karo

**Full-stack mode (real database):**
```bash
npm install
npm start
```
→ http://localhost:3000 · messages `db.json` mein save honge (server restart ke baad bhi rahenge).

**Static mode (GitHub Pages / direct open):**
`index.html` double-click karo. API na mile to automatic **offline mode** (localStorage) chal jata hai — navbar mein status pill dikhata hai.

---

## 🔌 API Endpoints (`server.js`)

| Method | Endpoint | Kaam |
|---|---|---|
| `GET` | `/api/messages` | Saare records lao |
| `POST` | `/api/messages` | Naya record — `{name, email, phone?, type?, message}` |
| `DELETE` | `/api/messages/:id` | Ek record delete |
| `DELETE` | `/api/messages` | Poora database clear |

---

## 📄 Pages
1. **Home** — 3D hero, animated counters, services, tech stack
2. **Work** — project cards (CONFIG se generate)
3. **Contact** — validated form → live database
4. **Inbox** — database viewer: search, delete, clear, **Export JSON**

## 📁 Files
```
index.html    → poora frontend (HTML + CSS + JS, ek file)
server.js     → Express API + database layer
package.json  → dependency + start script
db.json       → database (pehli baar chalane pe khud ban jayegi)
```

## 🗄️ Database badalna (SQLite / MongoDB)
`server.js` mein sirf 2 functions change karo — `readDB()` aur `writeDB()`. Baaki poora code same rahega.

---

Built with pure HTML, CSS & JavaScript 💜
