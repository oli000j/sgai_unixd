import { GoogleGenAI } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTopicSummary = async (topicName: string, courseName: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
            Actúa como un profesor experto de la Universidad Nacional de Ingeniería (UNI).
            Curso: ${courseName}
            Tema: ${topicName}

            Genera un resumen educativo muy conciso (máximo 2 oraciones) explicando qué se estudia en este tema y por qué es importante para la ingeniería.
            Tono: Académico, motivador y claro.
            Idioma: Español.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "No se pudo generar el resumen.";
    } catch (error) {
        console.error("Error generating AI summary:", error);
        return "Hubo un error al conectar con la IA de Gemini.";
    }
};