
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

export const generateLessonPlan = async (
  subject: string,
  topic: string,
  gradeLevel: string,
  details: string
): Promise<LessonPlan | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const prompt = `
      بصفتك خبير تربوي، قم بإنشاء خطة درس احترافية ومبتكرة باللغة العربية.
      المادة: ${subject}
      الموضوع: ${topic}
      الصف: ${gradeLevel}
      ملاحظات المعلم: ${details}
      
      يجب أن تتضمن الخطة:
      1. أهداف تعليمية واضحة (طبق تصنيف بلوم).
      2. استراتيجية تدريس حديثة (مثل: فكر-زاوج-شارك، التعلم باللعب، الخرائط الذهنية).
      3. محتوى تعليمي مقسم زمنياً (مقدمة، عرض، خاتمة).
      4. واجب منزلي إبداعي.
    `;

    // Fix: Using direct string for contents as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            materials: {
              type: Type.STRING
            },
            content: {
              type: Type.STRING,
              description: "المحتوى التعليمي مقسم لفقرات"
            },
            strategy: {
              type: Type.STRING,
              description: "اسم الاستراتيجية وكيفية تطبيقها"
            },
            homework: {
              type: Type.STRING
            }
          },
          required: ["objectives", "materials", "content", "strategy", "homework"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      id: Math.random().toString(36).substring(7),
      subject,
      topic,
      isGenerated: true,
      objectives: data.objectives || [],
      materials: data.materials || '',
      content: data.content || '',
      strategy: data.strategy || '',
      homework: data.homework || ''
    };

  } catch (error) {
    console.error("AI Assistant Error:", error);
    return null;
  }
};
