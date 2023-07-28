'use client';
import { Message } from 'ai/react';
import React from 'react';
// import { Message } from '../../data';
// import {} from '../../hooks/messages-transform.types';
// import Avatar from '../Avatar/Avatar';
import { FaUser } from 'react-icons/fa';

interface ChatContentProps {
  messages: Message[];
  transcript?: string;
}
const intlDateTime = new Intl.DateTimeFormat('no-NO', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});
const intlDate = new Intl.DateTimeFormat('no-NO', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});
const ChatContent = ({ messages, transcript }: ChatContentProps) => {
  // scroll to the bottom of the chat on load
  const latestChatRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    latestChatRef.current?.scrollIntoView();
  }, []);
  React.useEffect(() => {
    latestChatRef.current?.scrollIntoView();
  }, [messages]);
  return (
    <div className="max-h-64 h-64 px-6 py-1 overflow-auto">
      {messages.map((message: Message, index: number) => {
        const isChatOwner = message.role === 'user';
        return (
          <div
            key={index}
            className={`py-2 flex flex-row w-full ${
              // message.isChatOwner ? 'justify-end' : 'justify-start'
              isChatOwner ? 'justify-end' : 'justify-start'
            }`}
            ref={index === messages.length - 1 ? latestChatRef : null}
          >
            <div className={`${isChatOwner ? 'order-2' : 'order-1'}`}>
              <FaUser className="text-gray-600 w-5 h-5" />
            </div>
            <div
              className={`px-2 w-fit py-3 flex flex-col rounded-lg text-white ${
                isChatOwner
                  ? 'order-1 mr-2 bg-blue-500'
                  : 'order-2 ml-2 bg-green-500'
              }`}
            >
              <span className="text-xs text-gray-200">
                {message.role}&nbsp;-&nbsp;
                {intlDate.format(message.createdAt)}&nbsp;
              </span>
              <span className="text-md">{message.content}</span>
            </div>
          </div>
        );
      })}
      {transcript && transcript.length > 0 && (
        <div className="py-2 flex flex-row w-full justify-end">
          <div className="px-2 w-fit py-3 flex flex-col rounded-lg text-white order-1 mr-2 bg-blue-500">
            <span className="text-xs text-gray-200">
              Transcript&nbsp;-&nbsp;
              {intlDate.format(Date.now())}&nbsp;
            </span>
            <span className="text-md">{transcript}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
