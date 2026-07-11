import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // API Endpoint: Write Description using Gemini 3.5 Flash
  app.post("/api/write-description", async (req, res) => {
    try {
      const { dishName, ingredients } = req.body;

      if (!dishName || !dishName.trim()) {
        return res.status(400).json({ error: "Dish name is required." });
      }
      if (!ingredients || !ingredients.trim()) {
        return res.status(400).json({ error: "Ingredients are required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured in the server environment. Please set GEMINI_API_KEY in the Secrets panel."
        });
      }

      // Lazy initialization of the Gemini SDK client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Dish name: ${dishName.trim()}\nThree key ingredients: ${ingredients.trim()}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a food copywriter for Chai Point, a cosy Kolkata café. Write ONE mouth-watering menu description (35-45 words) for the dish below. Warm, sensory, inviting. No emojis, no exaggerated claims.",
          temperature: 0.7,
        },
      });

      const description = response.text;
      if (!description) {
        throw new Error("No description text was returned from the Gemini model.");
      }

      return res.json({ description: description.trim() });
    } catch (error: any) {
      console.error("Error in /api/write-description:", error);
      return res.status(500).json({
        error: error.message || "An unexpected error occurred while generating the description."
      });
    }
  });

  // Serve static assets or configure Vite middleware depending on the environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
