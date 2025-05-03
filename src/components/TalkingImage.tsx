import React, { useState, useEffect } from "react";
import {
  AudioManager,
  AudioEvent,
  isSpeechPlaying,
} from "@/services/elevenlabsService";

interface TalkingImageProps {
  imgIdle: string;
  imgTalking: string;
}

export default function TalkingImage({
  imgIdle,
  imgTalking,
}: TalkingImageProps) {
  const [isTalking, setIsTalking] = useState(false);
  const [blinkInterval, setBlinkInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Function to start the blinking animation
  const startTalking = () => {
    // Only start if not already talking
    if (blinkInterval) return;

    setIsTalking(true);
    const interval = setInterval(() => {
      setIsTalking((prevState) => !prevState);
    }, 250);
    setBlinkInterval(interval);
  };

  // Function to stop the blinking animation
  const stopTalking = () => {
    if (blinkInterval) {
      clearInterval(blinkInterval);
      setBlinkInterval(null);
    }
    setIsTalking(false);
  };

  // Set up event listeners for audio events
  useEffect(() => {
    const audioManager = AudioManager.getInstance();

    // Start talking animation when audio starts playing
    const handlePlayStart = () => {
      startTalking();
    };

    // Stop talking animation when audio stops playing
    const handlePlayEnd = () => {
      stopTalking();
    };

    // Also handle stop all event
    const handleAllStop = () => {
      stopTalking();
    };

    // Handle errors
    const handlePlayError = () => {
      stopTalking();
    };

    // Add event listeners
    audioManager.addEventListener(AudioEvent.PLAY_START, handlePlayStart);
    audioManager.addEventListener(AudioEvent.PLAY_END, handlePlayEnd);
    audioManager.addEventListener(AudioEvent.ALL_STOP, handleAllStop);
    audioManager.addEventListener(AudioEvent.PLAY_ERROR, handlePlayError);

    // Check if speech is already playing when component mounts
    if (isSpeechPlaying()) {
      startTalking();
    }

    // Clean up event listeners when component unmounts
    return () => {
      audioManager.removeEventListener(AudioEvent.PLAY_START, handlePlayStart);
      audioManager.removeEventListener(AudioEvent.PLAY_END, handlePlayEnd);
      audioManager.removeEventListener(AudioEvent.ALL_STOP, handleAllStop);
      audioManager.removeEventListener(AudioEvent.PLAY_ERROR, handlePlayError);

      if (blinkInterval) {
        clearInterval(blinkInterval);
      }
    };
  }, [blinkInterval]);

  return (
    <img
      src={isTalking ? imgTalking : imgIdle}
      alt={isTalking ? "Talking" : "Idle"}
      style={{
        position: "fixed",
        bottom: 0,
        left: "5px",
        height: "300px",
        objectFit: "contain",
        objectPosition: "left bottom",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
