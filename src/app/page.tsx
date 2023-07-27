import Chat from '@/components/chat/chat';
import Speech from '@/components/speech';
import Image from 'next/image';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Chat />
    </main>
  );
}
