// Create audio context
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

// Load the sound file
let audioBuffer: AudioBuffer | null = null;

// Function to load the audio file
const loadAudio = async () => {
  try {
    const response = await fetch('/src/sounds/submit_meow.mp3');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error('Error loading audio:', error);
  }
};

// Load the audio file immediately
loadAudio();

export const playMeowSound = async () => {
  try {
    if (!audioBuffer) {
      console.error('Audio not loaded yet');
      return;
    }

    // Create a new audio source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.5; // Set volume to 1.5x
    
    // Connect the nodes
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play the sound
    source.start(0);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}; 