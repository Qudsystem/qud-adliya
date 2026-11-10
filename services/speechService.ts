
import { GoogleGenAI, Modality } from "@google/genai";
import { db } from "./databaseService";

let currentSource: AudioBufferSourceNode | null = null;
let audioCtx: AudioContext | null = null;
let lastRequestId = 0;

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const cleanTextForSpeech = (text: string) => {
  return text
    .replace(/[#*_\(\)\[\]"'`<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * ADLIYA NEURAL ENGINE v6.0 - CUSTOMIZABLE SPEECH
 */
export const speak = async (text: string, lang: 'ar' | 'en' = 'ar') => {
  const requestId = ++lastRequestId;

  // Added notificationSound to the default settings object to match AppSettings interface
  const settings = db.getSettings({
    language: 'ar',
    narrationEnabled: true,
    darkMode: false,
    simplifiedExplanations: true,
    fontSize: 'medium',
    eyeProtection: false,
    voiceGender: 'male',
    voiceSpeed: 1.0,
    notificationSound: 'default'
  });

  if (!settings.narrationEnabled) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) { }
    currentSource = null;
  }

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) return;

  try {
    if (navigator.vibrate) navigator.vibrate(10);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Choose voice based on settings
    const voiceName = settings.voiceGender === 'male' ? 'Zephyr' : 'Kore';

    const prompt = lang === 'ar'
      ? `اقرأ النص التالي بوضوح: ${cleanedText}`
      : `Read clearly: ${cleanedText}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    if (requestId !== lastRequestId) return;

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioCtx,
        24000,
        1
      );

      if (requestId !== lastRequestId) return;

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      // Apply variable playback rate (Speed)
      source.playbackRate.value = settings.voiceSpeed;

      source.connect(audioCtx.destination);

      currentSource = source;
      source.start(0);

      source.onended = () => {
        if (currentSource === source) {
          currentSource = null;
        }
      };
    }
  } catch (error) {
    console.error("Speech Error:", error);
  }
};
