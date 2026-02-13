import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze", async (req, res) => {
  try {
    const { transcript } = req.body;

    const prompt = `
You are an AI clinic phone assistant.

Extract and return ONLY valid JSON with:
intent: appointment | prescription | billing | urgent_medical_issue
name
dob (YYYY-MM-DD)
phone
summary
urgency: low | high

Text:
${transcript}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    let result = completion.choices[0].message.content;
    result = result.replace(/```json/g, "").replace(/```/g, "").trim();

    res.json(JSON.parse(result));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running");
});

