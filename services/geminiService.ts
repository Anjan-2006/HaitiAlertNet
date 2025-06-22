
import { GoogleGenerativeAI , GenerateContentResponse, Part } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL_TEXT } from '../constants';

const ai = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

interface GeminiAnalysisResult {
  summary?: string;
  suggestedType?: string;
  safetyTip?: string;
}

export const analyzeDisasterReport = async (description: string, imageBase64?: string): Promise<GeminiAnalysisResult> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("Gemini API key is not configured. Skipping AI analysis.");
    // Simulate a delay and provide a mock response if API key is not set
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        summary: "AI analysis is currently unavailable. Ensure API key is configured.",
        suggestedType: "N/A",
        safetyTip: "Stay informed through official channels and prioritize your safety."
    };
  }
  
  const parts: Part[] = [
    { text: `Analyze the following disaster report description. Provide:
      1. A concise summary of the situation (max 30 words).
      2. A suggested disaster type (e.g., Flood, Fire, Earthquake, Landslide, Other).
      3. One brief, actionable safety tip relevant to the described situation (max 20 words).
      
      Format the response as a JSON object with keys "summary", "suggestedType", and "safetyTip".
      Description: "${description}"`
    },
  ];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming jpeg, adjust if necessary
        data: imageBase64,
      },
    });
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT, // Use the correct text model
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        // For this task, higher quality is preferred, so default thinkingConfig is fine (enabled)
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as GeminiAnalysisResult;
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI.");
  }
};

export const generateSafetyTipForDisasterType = async (disasterType: string): Promise<string> => {
   if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("Gemini API key is not configured. Skipping AI safety tip generation.");
    await new Promise(resolve => setTimeout(resolve, 500));
    return "Prioritize safety and follow guidance from local authorities.";
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: `Provide a single, concise safety tip (max 25 words) for a "${disasterType}" disaster.`,
       // For this task, higher quality is preferred, so default thinkingConfig is fine (enabled)
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating safety tip:", error);
    return "Could not generate safety tip. Stay alert and follow official advice.";
  }
};
