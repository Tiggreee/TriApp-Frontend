import { isSoundOn } from './sound';

// Reads a label out loud so kids who can't read yet still know what they tapped.
export function speak(text: string): void {
  if (!isSoundOn() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    utterance.pitch = 1.15;
    window.speechSynthesis.speak(utterance);
  } catch {
    // speech is a nicety, never a requirement
  }
}
