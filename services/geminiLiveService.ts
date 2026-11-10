
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./geminiService";

// Manual base64 encoding implementation as required by guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual base64 decoding implementation as required by guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual PCM audio decoding logic as required by guidelines
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

export class AdliyaLiveSession {
  // Guidelines: Create a new GoogleGenAI instance right before making an API call
  private sessionPromise: any = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private currentInputTranscription = '';
  private currentOutputTranscription = '';

  constructor(
    private onStatus: (status: 'listening' | 'speaking' | 'idle') => void,
    private onTranscript: (user: string, ai: string, isFinal: boolean) => void,
    private onError: (error: string) => void
  ) { }

  async start() {
    // Check for Perplexity key and throw a clear error if found.
    if ((process.env.API_KEY || "").startsWith("pplx-")) {
      this.onError("خدمة الصوت المباشر تتطلب مفتاح Google Gemini وتعمل بشكل محدود مع مفاتيح أخرى. يرجى استخدام الدردشة النصية.");
      return;
    }

    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize client right before connection to avoid stale key issues
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      this.sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
          onopen: () => {
            const source = this.inputAudioContext!.createMediaStreamSource(stream);
            const scriptProcessor = this.inputAudioContext!.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              // Rely on sessionPromise to handle connection status gracefully
              this.sessionPromise.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(this.inputAudioContext!.destination);
            this.onStatus('listening');
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              this.currentInputTranscription += message.serverContent.inputTranscription.text;
              this.onTranscript(this.currentInputTranscription, this.currentOutputTranscription, false);
            }
            if (message.serverContent?.outputTranscription) {
              this.currentOutputTranscription += message.serverContent.outputTranscription.text;
              this.onTranscript(this.currentInputTranscription, this.currentOutputTranscription, false);
            }

            if (message.serverContent?.turnComplete) {
              this.onTranscript(this.currentInputTranscription, this.currentOutputTranscription, true);
              this.currentInputTranscription = '';
              this.currentOutputTranscription = '';
            }

            // Handle Model Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              this.onStatus('speaking');
              // Maintain nextStartTime to ensure gapless playback
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext!.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), this.outputAudioContext!, 24000, 1);
              const source = this.outputAudioContext!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputAudioContext!.destination);
              source.addEventListener('ended', () => {
                this.sources.delete(source);
                if (this.sources.size === 0) this.onStatus('listening');
              });
              source.start(this.nextStartTime);
              this.nextStartTime += audioBuffer.duration;
              this.sources.add(source);
            }

            if (message.serverContent?.interrupted) {
              this.sources.forEach(s => s.stop());
              this.sources.clear();
              this.nextStartTime = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Live session error:', e);
            this.onError('خطأ في الاتصال بالسحابة القانونية');
          },
          onclose: () => this.onStatus('idle'),
        },
        config: {
          responseModalities: [Modality.AUDIO], // Only Modality.AUDIO is permitted for Live API
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: SYSTEM_INSTRUCTION + "\nأنت الآن في وضع المحادثة الصوتية الحية. استجب بنبرة مهنية هادئة. ركز على تقديم النصيحة القانونية المصرية بدقة.",
        },
      });
    } catch (err) {
      console.error('Live session start failure:', err);
      this.onError('يرجى السماح بالوصول للميكروفون');
    }
  }

  stop() {
    this.sessionPromise?.then((s: any) => s.close());
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
    this.sources.forEach(s => s.stop()); // Stop any playing audio sources
    this.sources.clear(); // Clear the set of sources
    this.onStatus('idle');
    console.log("Voice session stopped");
  }
}
