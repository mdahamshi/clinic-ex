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
