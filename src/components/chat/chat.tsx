'use client';
import React from 'react';
// import { ArrowPathIcon } from '@heroicons/react/solid';
import { FaArrowCircleDown } from 'react-icons/fa';
import ChatHeader from './chat-header';
import ChatContent from './chat-content';
import { useLocalStorage } from '@rehooks/local-storage';

import ChatInputBox from './chat-input';
import { CreateMessage, Message, useChat } from 'ai/react';
import { generateSpeech } from '@/services/tts';
type SpeechQueue = {
  text: string;
  url: Promise<HTMLAudioElement>;
};
const Chat = () => {
  const [latestMessage, setLatestMessage] = React.useState<Message | null>(
    null,
  );
  const [transcript, setTranscript] = React.useState('t');
  const [speechQueue, setSpeechQueue] = React.useState<SpeechQueue[]>([]);
  const [speechQueueIndex, setSpeechQueueIndex] = React.useState(0);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [completedSpeaking, setCompletedSpeaking] = React.useState(false);
  const [customPersonality, setCustomPersonality] = useLocalStorage(
    'personality',
    '',
  );
  const [customVoice, setCustomVoice] = useLocalStorage<string | null>(
    'voice',
    null,
  );

  const { messages, append, isLoading } = useChat({
    body: {
      personality: customPersonality,
    },
    onFinish: (message) => {
      setLatestMessage(message);
    },
  });

  React.useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.role === 'assistant') {
      // Every sentence should be added to the speech queue
      const regex = /([^.!?]+[.!?])\s*/g;
      const sentences = latestMessage.content.match(regex);
      if (sentences) {
        setSpeechQueue((prev) => {
          let newSentences = sentences
            // .filter((sentence) => !prev.includes(sentence.trim()))
            .filter((sentence) => {
              return !prev.find((s) => s.text === sentence.trim());
            })
            .map((sentence) => {
              return {
                text: sentence.trim(),
                url: generateSpeech(sentence.trim(), customVoice),
              };
            });

          console.log('newSentences', newSentences);
          return [...prev, ...newSentences];
        });
      }
    }
  }, [customVoice, messages]);
  React.useEffect(() => {
    console.log('speechQueue', speechQueue);
    if (
      !isSpeaking &&
      speechQueue.length > 0 &&
      speechQueueIndex < speechQueue.length
    ) {
      // const utterance = new SpeechSynthesisUtterance(
      //   speechQueue[speechQueueIndex],
      // );
      // utterance.onend = () => {
      //   setSpeechQueueIndex((prev) => prev + 1);
      //   setIsSpeaking(false);
      // };
      // speechSynthesis.speak(utterance);
      speechQueue[speechQueueIndex].url.then((audio) => {
        audio.onended = () => {
          setSpeechQueueIndex((prev) => prev + 1);
          setIsSpeaking(false);
        };
        audio.play();
      });
    }
    console.log(speechQueueIndex >= speechQueue.length);

    if (speechQueueIndex >= speechQueue.length) {
      setCompletedSpeaking(true);
    } else {
      setCompletedSpeaking(false);
    }
  }, [speechQueue, isSpeaking, speechQueueIndex, customVoice]);
  const sendANewMessage = React.useCallback(
    async (message: Message | CreateMessage) => {
      try {
        await append(message);
      } catch (error) {
        console.error(error);
      }
      console.log('message', message);
    },
    [append],
  );
  /**
   * Reset chat to the default messages
   */
  const resetChat = () => {};

  return (
    <div className="w-1/2 mx-auto mt-32">
      <div className="flex flex-row justify-between items-center py-2">
        {/* <p className="text-md text-white bg-purple-500 px-2 py-1 font-semibold animate-pulse"> */}
        <p
          className={`text-md text-white bg-purple-500 px-2 py-1 font-semibold ${
            isLoading ? 'animate-pulse' : ''
          }`}
        >
          Tiny Chat App
        </p>
        <button
          type="button"
          onClick={() => resetChat()}
          className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center"
        >
          <FaArrowCircleDown className="text-gray-600 w-5 h-5" />
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow relative">
        <ChatHeader
          name={'Assistant'}
          numberOfMessages={messages.length}
          setCustomPersonality={setCustomPersonality}
          setCustomVoice={setCustomVoice}
        />
        <ChatContent messages={messages} transcript={transcript} />
        <ChatInputBox
          sendANewMessage={sendANewMessage}
          isLoading={isLoading}
          latestMessage={latestMessage}
          completedSpeaking={completedSpeaking}
          setTranscript={setTranscript}
        />
      </div>
    </div>
  );
};

export default Chat;
