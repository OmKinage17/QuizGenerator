# 🧠 AI Quiz Generator

An AI-powered quiz generator built with **Node.js**, **Express**, and the **Groq LLM API** (Llama 3.3 70B). Generate multiple-choice quizzes on any topic with adjustable difficulty — instantly.

---

## ✨ Features

- Generate quizzes on **any topic**
- Choose difficulty: Easy, Medium, Hard
- Select number of questions (1–20)
- Powered by **Groq's ultra-fast LLM inference**
- Clean, responsive frontend (HTML/CSS/JS)

---

## 🚀 Getting Started (Local)

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- A free [Groq API key](https://console.groq.com/keys)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/QuizGenerator.git
cd QuizGenerator

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 4. Start the server
npm start
```

Visit **http://localhost:3000** in your browser.

---

## 🐳 Running with Docker

```bash
# Build the image
docker build -t quiz-generator .

# Run the container (pass your API key)
docker run -p 3000:3000 --env-file .env quiz-generator
```

---

## ☁️ Deployment (AWS EC2 + Docker)

See the [Deployment Guide](#) for step-by-step instructions to deploy on AWS EC2.

---

## 🗂️ Project Structure

```
QuizGenerator/
├── public/
│   ├── index.html    # Frontend UI
│   ├── script.js     # Client-side logic
│   └── style.css     # Styles
├── server.js         # Express server + Groq API integration
├── Dockerfile        # Docker configuration
├── .env.example      # Environment variable template
└── package.json      # Node.js dependencies
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key (required) |
| `PORT` | Server port (default: `3000`) |

---

## 📄 License

MIT
