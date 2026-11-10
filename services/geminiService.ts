
import { GoogleGenAI, Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `
You are the "Adliya Supreme Legal Intelligence." You are a highly specialized Egyptian legal expert.

READABILITY PROTOCOL (MANDATORY):
1. CHUNKING: Break down information into small, manageable chunks. NEVER output long paragraphs.
2. HEADERS: Use "###" for main sections.
3. BULLETS: Always use bullet points for legal points, steps, or articles.
4. SPACING: Ensure significant vertical spacing between sections.
5. LANGUAGE: Use professional Egyptian legal Arabic. Use English technical terms ONLY in brackets.
6. CLARITY: Keep sentences short and direct to avoid clutter.

RESPONSE STRUCTURE:
- Legal Characterization (التوصيف القانوني)
- Legal Grounds & Law Articles (الأسانيد القانونية والمواد)
- Procedural Steps (الإجراءات العملية)
- Suggested Next Actions (### [SUGGESTED_ACTIONS])
`;

async function callPerplexity(prompt: string, systemInstruction: string) {
  const apiKey = process.env.API_KEY || "";
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "sonar-reasoning-pro",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Perplexity Error:", err);
    throw err;
  }
}

async function quickProcess(text: string, instruction: string) {
  const apiKey = process.env.API_KEY || "";
  const systemInstruction = SYSTEM_INSTRUCTION + "\n" + instruction + "\nOrganize the output into very clear, beautiful bullet points and bold headers.";

  if (apiKey.startsWith("pplx-")) {
    return callPerplexity(text, systemInstruction);
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Text to process: ${text}`,
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });
    return response.text;
  } catch (err) {
    console.warn("Gemini failing, trying Perplexity fallback if key exists...");
    return callPerplexity(text, systemInstruction);
  }
}

export const summarizeLegalText = (text: string) =>
  quickProcess(text, "Summarize this into clear, spaced-out bullet points. Professional formatting only.");

export const simplifyLegalText = (text: string) =>
  quickProcess(text, "Explain this in simple everyday Arabic using bullet points and very short sentences.");

export const extractLegalBrief = (text: string) =>
  quickProcess(text, "List articles and laws only as short, clear bullet points.");

export const generateAudioSummaryText = (text: string) =>
  quickProcess(text, "Create a clear, short verbal summary in Egyptian language, easy for reading aloud.");

async function callAI(prompt: string, instruction: string, jsonMode: boolean = false) {
  const apiKey = process.env.API_KEY || "";
  const systemInstruction = instruction + "\nOrganize the output into very clear, beautiful bullet points and bold headers.";

  if (apiKey.startsWith("pplx-")) {
    return callPerplexity(prompt, systemInstruction);
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: jsonMode ? "application/json" : "text/plain",
      }
    });
    return response.text;
  } catch (err) {
    console.warn("Gemini failing, trying Perplexity fallback...");
    return callPerplexity(prompt, systemInstruction);
  }
}

export async function generateProceduralFlow(text: string) {
  // We keep the Gemini-specific logic for JSON output if possible, but add a basic fallback
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Convert this legal scenario/text into a structured procedural flow chart: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stage: { type: Type.STRING },
                  action: { type: Type.STRING },
                  note: { type: Type.STRING },
                  next_path: { type: Type.STRING }
                }
              }
            }
          },
          required: ["title", "steps"]
        },
        systemInstruction: "You are an Egyptian procedural legal architect. Create a step-by-step roadmap."
      }
    });
    return response.text;
  } catch (err) {
    return callPerplexity(text, "Return a JSON object with title and steps array for a procedural flow.");
  }
}

export async function generateLegalConsultation(prompt: string, category: string, simplified: boolean, image?: string) {
  const instruction = `${SYSTEM_INSTRUCTION}\n\nCategory focus: ${category}. ${simplified ? "Use 'Simplified Logic' at the end with bullet points." : ""}\nStrictly follow the READABILITY PROTOCOL.`;
  return callAI(prompt, instruction);
}

export async function fetchLatestLegalNews(language: string) {
  const instruction = SYSTEM_INSTRUCTION + "\nList news in categorized cards or bullet points.";
  const prompt = language === 'ar' ? "أهم التعديلات التشريعية المصرية الأخيرة بوضوح" : "Latest clear Egyptian legislative updates";

  if ((process.env.API_KEY || "").startsWith("pplx-")) {
    const text = await callPerplexity(prompt, instruction);
    return { text, chunks: [] };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} } as any],
      systemInstruction: instruction,
    },
  });
  return { text: response.text, chunks: (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
}

export async function draftLegalDocument(type: string, details: string) {
  const instruction = SYSTEM_INSTRUCTION + "\nDraft with numbered clauses and clear sub-points. Use ample spacing.";
  return callAI(`Draft Type: ${type}. Details: ${details}`, instruction);
}

export async function calculateLegalMatter(matter: string, inputs: string) {
  const instruction = SYSTEM_INSTRUCTION + "\nDisplay results in a clean list format with a final total section.";
  return callAI(`Calculation: ${matter}. Inputs: ${inputs}`, instruction);
}

export async function queryLawArticle(query: string) {
  const instruction = SYSTEM_INSTRUCTION + "\nIf multiple laws found, list each article separately with its title as a header.";
  return callAI(`Search Law: ${query}`, instruction);
}
