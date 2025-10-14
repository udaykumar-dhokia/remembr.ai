import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

export const llm = new GoogleGenAI({});
