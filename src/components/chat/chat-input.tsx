'use client';
import React from 'react';
import DebouncedInput from '../DebouncedInput';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { FaMicrophone } from 'react-icons/fa';
import { CreateMessage, Message } from 'ai/react';

interface ChatInputBoxProps {
  sendANewMessage: (message: Message | CreateMessage) => void | Promise<void>;
  setTranscript: (transcript: string) => void;
  isLoading?: boolean;
  latestMessage?: Message | null;
  completedSpeaking?: boolean;
}

const ChatInputBox = ({
  sendANewMessage,
  isLoading,
  latestMessage,
  completedSpeaking,
  setTranscript,
}: ChatInputBoxProps) => {
  const [newMessage, setNewMessage] = React.useState('');
  const { transcript, finalTranscript, resetTranscript, listening } =
    useSpeechRecognition();

  /**
   * Send message handler
   * Should empty text field after sent
   */
  // const doSendMessage = () => {
  //   if (newMessage && newMessage.length > 0) {
  //     const newMessagePayload: Message = {
  //       sentAt: new Date(),
  //       sentBy: 'devlazar',
  //       isChatOwner: true,
  //       text: newMessage,
  //     };
  //     sendANewMessage(newMessagePayload);
  //     setNewMessage('');
  //   }
  // };
  const doSendMessage = React.useCallback(
    (message?: string) => {
      let messageToSend = message ?? newMessage;
      if (messageToSend && messageToSend.length > 0) {
        const newMessagePayload: CreateMessage = {
          content: messageToSend,
          role: 'user',
        };
        setNewMessage('');
        sendANewMessage(newMessagePayload);
      }
    },
    [newMessage, sendANewMessage],
  );
  React.useEffect(() => {
    setTranscript(transcript);
  }, [transcript, setTranscript]);

  React.useEffect(() => {
    if (finalTranscript) {
      setNewMessage(finalTranscript);
      doSendMessage(finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript, resetTranscript, doSendMessage]);
  React.useEffect(() => {
    if (completedSpeaking) {
      SpeechRecognition.startListening({
        language: 'en-US',
      });
    }
  }, [completedSpeaking]);
  const listeningColor = listening ? 'green' : 'red';
  console.log('listening', listeningColor);
  return (
    <div className="px-6 py-3 bg-white w-100 overflow-hidden rounded-bl-xl rounded-br-xla">
      <div className="flex flex-row items-center space-x-5">
        <button
          type="button"
          // className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center border-2 border-green-500  transistion-all duration-300 ease-in-out"
          className={`hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center border-2 border-${listeningColor}-500  transistion-all duration-300 ease-in-out`}
          onClick={() =>
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening({
                  language: 'en-US',
                })
          }
        >
          <FaMicrophone className="text-gray-600 w-5 h-5" />
        </button>

        <DebouncedInput
          value={newMessage ?? ''}
          debounce={100}
          onChange={(value) => setNewMessage(String(value))}
          send={doSendMessage}
        />

        <button
          type="button"
          disabled={!newMessage || newMessage.length === 0}
          className="px-3 py-2 text-xs font-medium text-center text-white bg-purple-500 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50"
          onClick={() => doSendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;
