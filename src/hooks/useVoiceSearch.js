import { useEffect, useState } from 'react';

export function useVoiceSearch(lang = 'en-US', onResult) {
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) {
      setIsSupported(false);
      return;
    }

    const rec = new Speech();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = false;
    
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (onResult) onResult(text);
    };

    setRecognition(rec);
    setIsSupported(true);
  }, [lang, onResult]);

  const startListening = () => {
    if (recognition) recognition.start();
  };

  return { isSupported, startListening };
}
