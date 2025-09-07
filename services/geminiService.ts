import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  console.warn("Gemini API key is not set in process.env.API_KEY. The application may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are a prompt engineering assistant. Your goal is to help a user refine their initial prompt by asking one clarifying question at a time.
Analyze the provided initial prompt and the conversation history.
Your task is to identify a single, crucial missing piece of information. This could be about the target audience, desired tone, output format, specific constraints, or essential context.
- Ask only ONE concise question to elicit that information.
- Do NOT ask questions if the information is already present in the prompt or history.
- Frame your questions clearly and directly.
- After 3-4 rounds of questions, or if you believe you have sufficient information to create a detailed prompt, you MUST respond with the single word: DONE`;

export const askFollowUpQuestion = async (initialPrompt: string, history: ChatMessage[]): Promise<string> => {
  const model = "gemini-2.5-flash";

  let fullPrompt = `Initial Prompt: "${initialPrompt}"\n\n`;
  if (history.length > 0) {
    fullPrompt += "Conversation History:\n";
    history.forEach(msg => {
      fullPrompt += `${msg.role === 'ai' ? 'AI' : 'User'}: ${msg.content}\n`;
    });
  }
  fullPrompt += "\nBased on this, what is the single most important clarifying question you should ask next? If you have enough information, respond with only 'DONE'.";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    
    const text = response.text.trim();
    if (!text) {
        throw new Error("Received empty response from Gemini API.");
    }
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI assistant.");
  }
};
