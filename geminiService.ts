import { GoogleGenAI, Type } from "@google/genai";
import type { AISuggestionPayload, AISuggestion } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to disable the feature instead of throwing an error
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const suggestionSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'عنوان جذاب ومختصر للإعلان المبوّب، يعكس المنتج وحالته. يجب أن يكون أقل من 60 حرفًا.',
    },
    description: {
      type: Type.STRING,
      description: 'وصف تفصيلي للمنتج يتضمن أهم مميزاته وحالته وأي معلومات أخرى تهم المشتري. يجب أن يكون بين 20 و 70 كلمة.',
    },
  },
  required: ["title", "description"],
};

export const getAdSuggestion = async (payload: AISuggestionPayload): Promise<AISuggestion> => {
   if (!API_KEY) {
    throw new Error("AI functionality is not available. API key is not configured.");
  }
  const { keywords, category } = payload;

  const prompt = `
    أنت خبير في كتابة الإعلانات المبوبة للمواقع العربية مثل السوق المفتوح وحراج. مهمتك هي إنشاء عنوان ووصف جذاب لإعلان جديد.

    الرجاء استخدام التفاصيل التالية:
    - الكلمات الرئيسية للمنتج: ${keywords}
    - قسم الإعلان: ${category}

    الهدف هو جذب انتباه المشترين المحتملين وتقديم معلومات واضحة ومقنعة.
    اكتب بأسلوب مباشر وواضح وموجز.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionSchema,
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }

    const suggestion: AISuggestion = JSON.parse(jsonText);
    return suggestion;
  } catch (error) {
    console.error("Error generating ad suggestion:", error);
    throw new Error("Failed to generate ad suggestion from Gemini API.");
  }
};
