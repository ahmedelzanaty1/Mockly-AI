import { useState, useCallback } from 'react';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);

  // 1. Text to Speech (AI speaks)
  const speak = (text, onEndCallback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    
    window.speechSynthesis.cancel(); // Clear any existing speech
    window.speechSynthesis.speak(utterance);
  };

  // 2. Speech to Text (User speaks)
  const listen = (onResultCallback) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResultCallback) onResultCallback(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return { speak, listen, isListening };
};