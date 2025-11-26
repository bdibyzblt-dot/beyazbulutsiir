
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client safely
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generatePoemWithAI = async (promptInput: string, isCategory: boolean = false): Promise<{ title: string; content: string } | null> => {
  if (!ai) {
    console.error("API Key not found");
    return null;
  }

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
