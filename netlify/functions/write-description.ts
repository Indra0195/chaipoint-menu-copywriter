import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { dishName, ingredients } = JSON.parse(event.body || "{}");

    if (!dishName || !dishName.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Dish name is required." }),
      };
    }
    if (!ingredients || !ingredients.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingredients are required." }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "GEMINI_API_KEY environment variable is missing on Netlify. Please configure it in your Netlify Site Settings."
        }),
      };
    }

    // Lazy initialization of the Gemini SDK client
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-netlify",
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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: description.trim() }),
    };
  } catch (error: any) {
    console.error("Error in Netlify function write-description:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "An unexpected error occurred while generating the description."
      }),
    };
  }
};
