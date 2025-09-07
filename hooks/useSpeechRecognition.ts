import { useState, useEffect, useRef } from 'react';

// FIX: Add type declarations for SpeechRecognition APIs to the global Window object to resolve TypeScript errors.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const getSpeechRecognition = () => {
  if (typeof window !== 'undefined') {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  return undefined;
};

const SpeechRecognition = getSpeechRecognition();

export const useSpeechRecognition = (onTranscriptChange) => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if(finalTranscript){
        onTranscriptChange(finalTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    language,
    setLanguage,
    hasSupport: !!SpeechRecognition
  };
};
