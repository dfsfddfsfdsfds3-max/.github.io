
import { GoogleGenAI } from "@google/genai";
import type { ImageFile } from '../types';

const API_KEY = new GoogleGenerativeAI("AIzaSyDFpQ9MhexgViAI54WxkogX7C1SUK57Vp0");

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-pro";

const SYSTEM_INSTRUCTION = "You are an expert programmer. Your task is to solve the given programming problem and provide only the complete, functional code solution. Do not include any comments, explanations, introductory text, or markdown formatting like ```language```. Just the raw code.";

export const solveProblem = async (promptText: string, image: ImageFile | null): Promise<string> => {
  try {
    const parts: any[] = [{ text: promptText }];

    if (image) {
      parts.unshift({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred: ${error.message}`;
    }
    return "An unknown error occurred while trying to get a solution.";
  }
};
