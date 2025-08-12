import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const HF_API_KEY = process.env.HF_API_KEY;

// Speech-to-Text (Whisper)
app.post("/stt", async (req, res) => {
  const { audio } = req.body;
  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-base", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: audio })
  });
  const data = await response.json();
  res.json(data);
});

// Chat (LLaMA 3)
app.post("/chat", async (req, res) => {
  const { text } = req.body;
  const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });
  const data = await response.json();
  res.json(data);
});

// Text-to-Speech
app.post("/tts", async (req, res) => {
  const { text } = req.body;
  const response = await fetch("https://api-inference.huggingface.co/models/coqui/tts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });
  const arrayBuffer = await response.arrayBuffer();
  res.set("Content-Type", "audio/wav");
  res.send(Buffer.from(arrayBuffer));
});

app.listen(3000, () => console.log("Backend running on port 3000"));

