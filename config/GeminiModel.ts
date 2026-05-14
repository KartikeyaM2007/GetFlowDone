import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // or gemini-1.5-flash
  generationConfig: {
    responseMimeType: "application/json",
  },
});


export const createChatSession = (history: any[] = []) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash"
  });

  return model.startChat({
    history: history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  });
};