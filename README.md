# 🏥 AI Clinic Phone Assistant

A simple AI-powered web application that processes simulated clinic call transcripts and extracts structured patient information.

This project demonstrates how to use an LLM for real-world information extraction and intent classification.

---

## ✨ Features

The assistant can:

✅ Identify caller intent  
- Appointment booking  
- Prescription refill  
- Billing inquiry  
- Urgent medical issue  

✅ Extract structured information:
- Patient name
- Date of birth
- Callback phone number
- Reason for call summary

✅ Detect urgency level:
- High (medical concern)
- Low (administrative requests)

✅ Output clean JSON

---

## 🧠 How It Works

### Architecture


1. User pastes a call transcript into the web interface.
2. Frontend sends the text to a Node.js backend.
3. The backend calls the OpenAI API with a structured prompt.
4. The AI extracts fields and returns structured JSON.
5. The result is displayed in the UI.

---

## 🤖 AI Approach

The solution uses:

- **Prompt engineering** to instruct the model to return structured JSON
- Deterministic settings (`temperature: 0`) for consistent outputs
- A lightweight LLM (`gpt-4o-mini`) optimized for fast extraction tasks

The model performs:

- Intent classification
- Named entity extraction
- Medical urgency detection
- Text summarization

---

## 🛠 Tech Stack

- Node.js
- Express.js
- OpenAI API
- Vanilla HTML + JavaScript frontend

---

## 🚀 How to Run Locally

### 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd clinic-assistant
```

2️⃣ Install dependencies
npm install

3️⃣ Add your API key

Create a .env file:

OPENAI_API_KEY=your_key_here

4️⃣ Start the server
node server.js

5️⃣ Open the app

Go to:

http://localhost:3000


Paste a transcript and click Analyze Call.

🧪 Example
Input
Hi, this is Sarah Cohen, born 03/12/1988. I need to book an appointment because I’ve had chest pain for two days. Please call me back at 310-555-2211.

Output
```json
{
  "intent": "urgent_medical_issue",
  "name": "Sarah Cohen",
  "dob": "1988-03-12",
  "phone": "310-555-2211",
  "summary": "Chest pain for two days",
  "urgency": "high"
}
```

🔐 Security Considerations

The OpenAI API key is stored securely in environment variables and never exposed to the frontend.

All API calls are routed through the backend server.