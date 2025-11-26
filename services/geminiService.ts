
import { GoogleGenAI } from "@google/genai";
import { getSettings } from "./settingsService";

// Helper for env vars (Fallback only)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

export const generatePoemWithAI = async (promptInput: string, isCategory: boolean = false): Promise<{ title: string; content: string } | null> => {
  
  // 1. Try fetching from Database Settings
  const settings = await getSettings();
  let apiKey = settings.geminiApiKey;

  // 2. Fallback to Env Var if DB key is empty
  if (!apiKey) {
    apiKey = getEnv('VITE_GEMINI_KEY') || getEnv('API_KEY') || '';
  }

  if (!apiKey) {
    console.error("API Key not found in Settings or Environment");
    return null;
  }

  // Initialize client with the dynamic key
  const ai = new GoogleGenAI({ apiKey });

  try {
    let userInstruction = "";
    
    if (isCategory) {
      userInstruction = `"${promptInput}" teması üzerine,`;
    } else {
      userInstruction = `Şu isteğe uygun: "${promptInput}".`;
    }

    const prompt = `
      Sen ödüllü bir Türk şairisin. 
      ${userInstruction} derinlikli, duygusal ve edebi değeri yüksek kısa bir şiir yaz.
      
      Çıktıyı sadece geçerli bir JSON formatında ver. Başka hiçbir açıklama yazma.
      JSON formatı şöyle olmalı:
      {
        "title": "Şiirin Başlığı",
        "content": "Şiirin içeriği buraya gelecek (satır sonları \\n ile)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;

    const result = JSON.parse(text);
    return {
      title: result.title,
      content: result.content
    };
  } catch (error) {
    console.error("Error generating poem:", error);
    return null;
  }
};
