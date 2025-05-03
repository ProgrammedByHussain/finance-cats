const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export const VOICES = {
  bartholomew: "nPczCjzI2devNBz1zQrb",
  pounce: "2EiwWnXFnvU5JabPnv8n",
  clawdia: "ThT5KcBeYPX3keUQqHPh",
};

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface TextToSpeechRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

export const SPEECH_TEMPLATES = {
  bartholomew:
    "Hello human! I'm Doctor Bartholomeow, your credit card expert. Based on your preferences, I've found some purr-fect options for you. These cards will help maximize your rewards in the spending categories you've selected. Let me walk you through my recommendations!",
  pounce:
    "Meow there! Sir Pounce at your service. I've analyzed your spending habits and found some interesting patterns. Your budget could use a little fine-tuning in a few areas. Let me point out where you might be able to save some money each month!",
  clawdia:
    "Greetings, I'm Doctor Clawdia. I've created an investment portfolio tailored to your financial goals and risk tolerance. The asset allocation I've designed should help you reach your objectives within your desired timeframe. Let's review my investment recommendations!",
};

export type CatAdvisor = keyof typeof VOICES;

export class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private audioQueue: HTMLAudioElement[] = [];
  private isPlaying: boolean = false;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public playAudio(audio: HTMLAudioElement): void {
    if (this.isPlaying) {
      this.audioQueue.push(audio);
    } else {
      this.currentAudio = audio;
      this.isPlaying = true;

      audio.addEventListener("ended", () => this.playNext());

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        this.isPlaying = false;
        this.playNext();
      });
    }
  }

  private playNext(): void {
    this.isPlaying = false;

    if (this.audioQueue.length > 0) {
      const nextAudio = this.audioQueue.shift();
      if (nextAudio) {
        this.playAudio(nextAudio);
      }
    }
  }

  public stopAll(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.audioQueue = [];
    this.isPlaying = false;
  }
}

export async function generateSpeech(
  text: string,
  voiceId: string
): Promise<HTMLAudioElement | null> {
  try {
    if (!API_KEY) {
      console.error(
        "ElevenLabs API key not found. Make sure to set VITE_ELEVENLABS_API_KEY in your .env file."
      );
      return null;
    }

    // Check if we have the test audio element for development without API key
    if (!API_KEY && typeof window !== "undefined") {
      // Create a fallback audio element for development
      console.log("Using fallback audio for development");
      const audio = new Audio("/src/sounds/submit_meow.mp3");
      return audio;
    }

    const requestBody: TextToSpeechRequest = {
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };

    console.log(`Generating speech for voice ID: ${voiceId}`);

    const response = await fetch(`${API_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorText}`
      );
    }

    // Get response as arrayBuffer
    const audioData = await response.arrayBuffer();

    // Create audio blob
    const audioBlob = new Blob([audioData], { type: "audio/mpeg" });

    // Create URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create audio
    const audio = new Audio(audioUrl);

    return audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
}

export async function preloadCatSpeech(
  advisor: CatAdvisor,
  customText?: string
): Promise<HTMLAudioElement | null> {
  const text = customText || SPEECH_TEMPLATES[advisor];
  const voiceId = VOICES[advisor];

  try {
    const audio = await generateSpeech(text, voiceId);
    return audio;
  } catch (error) {
    console.error(`Error preloading speech for ${advisor}:`, error);
    return null;
  }
}

export async function playCatSpeech(
  advisor: CatAdvisor,
  customText?: string
): Promise<void> {
  const text = customText || SPEECH_TEMPLATES[advisor];
  const voiceId = VOICES[advisor];

  try {
    const audio = await generateSpeech(text, voiceId);

    if (audio) {
      const audioManager = AudioManager.getInstance();
      audioManager.playAudio(audio);
    }
  } catch (error) {
    console.error(`Error playing speech for ${advisor}:`, error);
  }
}

export function stopAllSpeech(): void {
  const audioManager = AudioManager.getInstance();
  audioManager.stopAll();
}
