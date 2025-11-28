import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const GeminiClient = {
  /**
   * Send a text message to Gemini and get the response
   * @param {string} prompt - The user’s message
   * @param {Array} contextMessages - Last few messages for context
   */
  async sendMessage(prompt, contextMessages = []) {
    try {
      // Convert the last few messages into a readable conversation
      const contextText = contextMessages
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      // Combine context + current prompt
      const contents = `
        You are an expert personal therapist and dementia-care assistant.
        Respond only in plain English text. No markdown or formatting.
        Keep responses warm, and empathetic. Don't ask difficult questions and suggest engaging things. 
        
        Conversation so far:
        ${contextText}

        User: ${prompt}
      `;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
      });

      const response = result.text;
      return response;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to get response from Gemini");
    }
  },
};

export default GeminiClient;
