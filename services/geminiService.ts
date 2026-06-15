
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-flash-preview to stay within higher rate limits and provide faster feedback
const PRIMARY_MODEL = 'gemini-3-flash-preview';

export const analyzeAnswer = async (
  question: string,
  transcript: string,
  role: string
): Promise<FeedbackData> => {
  try {
    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: `
        Analyze this interview answer for a ${role} position.
        Question: "${question}"
        Candidate's Answer: "${transcript}"
        
        Provide a detailed critique in JSON format.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidenceScore: { type: Type.NUMBER },
            clarityScore: { type: Type.NUMBER },
            technicalDepthScore: { type: Type.NUMBER },
            overallScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            tipsForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["confidenceScore", "clarityScore", "technicalDepthScore", "overallScore", "summary", "strengths", "weaknesses", "tipsForImprovement"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as FeedbackData;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateAggregateFeedback = async (
  sessionData: any
): Promise<FeedbackData> => {
    try {
      const response = await ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: `Analyze the overall performance across multiple interview questions: ${JSON.stringify(sessionData)}`,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    confidenceScore: { type: Type.NUMBER },
                    clarityScore: { type: Type.NUMBER },
                    technicalDepthScore: { type: Type.NUMBER },
                    overallScore: { type: Type.NUMBER },
                    summary: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tipsForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["confidenceScore", "clarityScore", "technicalDepthScore", "overallScore", "summary", "strengths", "weaknesses", "tipsForImprovement"]
              }
          }
      });
      return JSON.parse(response.text || '{}') as FeedbackData;
    } catch (error: any) {
      console.error("Gemini API Aggregate Error:", error);
      throw error;
    }
}
