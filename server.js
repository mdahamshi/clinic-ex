import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Read key directly from process.env
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error("ERROR: OPENAI_API_KEY not set!");
  process.exit(1); // stop container if missing
}

const client = new OpenAI({
  apiKey: openaiApiKey
});

app.post("/analyze", async (req, res) => {
  try {
    const { transcript } = req.body;
    const prompt = `
You are an AI clinic phone assistant.

Your task is to extract structured information from a patient's call transcript and return ONLY valid JSON.

Rules:
1. The JSON must have these fields:
   - intent: appointment | prescription | billing | urgent_medical_issue
   - name
   - dob (YYYY-MM-DD)
   - phone
   - summary (short text describing the reason for call)
   - urgency: low | high

2. Always classify as "urgent_medical_issue" AND urgency "high" if the caller mentions any of these symptoms or serious medical issues:
   chest pain, difficulty breathing, severe bleeding, fainting, sudden weakness, uncontrolled pain, high fever, severe allergic reaction

3. For routine appointment requests, prescription refills, or billing inquiries without serious symptoms, classify intent accordingly and urgency as "low".

Examples:

Input: "Hi, this is Sarah Cohen, born 03/12/1988. I need to book an appointment because I’ve had chest pain for two days. Please call me back at 310-555-2211."
Output:
{
  "intent": "urgent_medical_issue",
  "name": "Sarah Cohen",
  "dob": "1988-03-12",
  "phone": "310-555-2211",
  "summary": "Chest pain for two days",
  "urgency": "high"
}

Input: "Hello, this is John Smith, DOB 01/15/1990. I need to refill my prescription for blood pressure medication. Call me at 415-555-1234."
Output:
{
  "intent": "prescription",
  "name": "John Smith",
  "dob": "1990-01-15",
  "phone": "415-555-1234",
  "summary": "Refill blood pressure prescription",
  "urgency": "low"
}

Now process the following text and return ONLY valid JSON:

Text:
${transcript}
`;


    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    let result = completion.choices[0].message.content;

    // Remove code fences if present
    result = result.replace(/```json/g, "").replace(/```/g, "").trim();

    res.json(JSON.parse(result));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// IMPORTANT: listen on 0.0.0.0 for Coolify
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
