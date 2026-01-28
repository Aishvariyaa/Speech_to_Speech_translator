#  Speech Translator

A real-time **speech translation web app** built using **Next.js**, **TypeScript**, and **Tailwind CSS**.
Speak, translate, and connect with people around the world effortlessly.

---

##  Features

*  Real-time speech recognition
*  Instant language translation
*  Clean and responsive UI
*  Built with Next.js + TypeScript + Tailwind CSS
*  Extensible for multiple translation APIs

---

##  Tech Stack

* **Frontend Framework:** Next.js (React-based)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **APIs:** Web Speech API, Translation API (e.g., Google Translate)
* **Environment:** Node.js

---

##  Installation & Setup Guide

###  Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) ≥ 18
* npm (comes with Node) or yarn
* Git (optional, for cloning)

---

### 🧰 Steps to Run Locally

```bash
# 1️ Clone the repository
git clone https://github.com/<your-username>/Speech-Translator.git
cd Speech-Translator/app

# 2️ Install dependencies
npm install
# or
yarn install

# 3️ Setup environment variables
cp .env.local.example .env.local
# (Add your translation API keys or configuration if needed)

# 4️ Run the development server
npm run dev
# or
yarn dev

# 5️ Open your browser
http://localhost:3000
```

---

##  Environment Variables (`.env.local`)

If your app integrates with APIs, include them like:

```
NEXT_PUBLIC_TRANSLATE_API_KEY=your_api_key_here
```

---

##  Project Structure

```
Speech-Translator/
 ├── app/
 │   ├── app/
 │   │   ├── layout.tsx            # Main layout
 │   │   ├── page.tsx              # Home page
 │   │   ├── about/page.tsx        # About page
 │   │   ├── translator/page.tsx   # Speech translator logic
 │   ├── package.json              # Dependencies
 │   ├── tsconfig.json             # TypeScript config
 │   ├── tailwind.config.ts        # Tailwind setup
 │   ├── postcss.config.js         # PostCSS setup
 │   ├── .env.local                # Environment variables
 │   └── public/                   # Static assets (if present)
 └── README.md                     # Project documentation
```

---

##  Styling

Tailwind CSS is preconfigured for rapid UI development.
Modify `tailwind.config.ts` or `globals.css` for theming and custom designs.

---

##  Available Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Run development server     |
| `npm run build` | Build production-ready app |
| `npm run start` | Start production server    |
| `npm run lint`  | Check for code issues      |

---

##  Deployment

Deploy easily on any modern platform supporting Next.js:

* [Vercel](https://vercel.com) (recommended)
* Netlify
* Render
* AWS Amplify

Example for Vercel:

```bash
npm run build
vercel deploy
```

---

##  Author

**Aishvariyaa Jayakumar**
AI | ML | DS Enthusiast passionate about building intelligent tools for education and healthcare.

---

##  License

This project is licensed under the **MIT License** – free to modify and distribute.
