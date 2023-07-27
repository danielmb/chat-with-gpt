import { Voice } from '@/app/api/tts/eleven-labs-api';
import axios from 'axios';
export const generateSpeech = async (text: string, voice?: string | null) => {
  const { data } = await axios.post('/api/tts', { text, voice });
  let audio = new Audio(data.url);
  return audio;
};

export const play = async (audio: HTMLAudioElement) => {
  audio.play();
  return new Promise((resolve) => {
    audio.addEventListener('ended', resolve);
  });
};

export const getVoices = async () => {
  const { data } = await axios.get('/api/tts');
  return data.voices as Voice[];
};
