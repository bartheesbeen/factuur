import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LineItem } from '../types';

// Initialize the Gemini client
// Note: In a real production app, this should be handled securely.
// Since this is a frontend-only demo, we assume the key is in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lineItemSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      description: { type: Type.STRING, description: "A professional description of the work or product" },
      quantity: { type: Type.NUMBER, description: "The number of units or hours" },
      price: { type: Type.NUMBER, description: "The price per unit (estimate if not provided)" },
    },
    required: ["description", "quantity", "price"],
  },
};

export const parseWorkDescriptionToItems = async (rawText: string): Promise<LineItem[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert invoicing assistant. 
      Convert the following raw text description of work done into a structured list of invoice line items.
      Use professional business language (Dutch).
      
      Raw Text: "${rawText}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lineItemSchema,
        systemInstruction: "You extract invoice data from rough notes. Provide realistic price estimates if none are given, but prefer given numbers.",
      },
    });

    const text = response.text;
    if (!text) return [];

    const parsedItems = JSON.parse(text);
    
    return parsedItems.map((item: any) => ({
      ...item,
      amount: item.quantity * item.price
    }));

  } catch (error) {
    console.error("Error parsing work description:", error);
    throw error;
  }
};
