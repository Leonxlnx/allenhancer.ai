import { OPENROUTER_API_URL, OPENROUTER_API_KEY } from '../constants';

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to take the following details and generate a highly professional, detailed, and clear prompt.
- Expand on the user's ideas with rich context, technical specifics, and a clear goal.
- Structure the prompt logically with headings, bullet points, and bold text for clarity. Use Markdown for formatting.
- The final prompt should be ready to use with a powerful large language model.
- Do not ask for more information. Generate the best possible prompt with the given details.`;

export const generateFinalPrompt = async (initialPrompt: string, collectedAnswers: string): Promise<string> => {
  const userContent = `Initial prompt: "${initialPrompt}".\n\nAdditional context from our conversation: "${collectedAnswers}"`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-oss-20b:free",
        "messages": [
          { "role": "system", "content": SYSTEM_PROMPT },
          { "role": "user", "content": userContent }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw new Error("Failed to generate the final prompt.");
  }
};