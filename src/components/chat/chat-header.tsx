'use client';
import React from 'react';
// import { PhoneIcon, CameraIcon } from '@heroicons/react/24/outline';
// import Avatar from '../Avatar/Avatar';
import { FaArrowCircleDown, FaUser, FaPhone, FaVideo } from 'react-icons/fa';
import UserSettings from './chat-settings';

interface ChatHeaderProps {
  name: string;
  numberOfMessages: number;
  setCustomPersonality: (personality: string) => void;
  setCustomVoice: (voice: string) => void;
}

const ChatHeader = ({
  name,
  numberOfMessages = 0,
  setCustomPersonality,
  setCustomVoice,
}: ChatHeaderProps) => {
  const [settings, setSettings] = React.useState(false);
  return (
    <div className="border-b-2 border-b-gray-200 py-3 px-6 flex flex-row justify-between items-center">
      <div className="flex flex-row items-center space-x-1.5">
        <button type="button" onClick={() => setSettings((prev) => !prev)}>
          <FaUser className="text-gray-600 w-5 h-5" />
        </button>
        {settings && (
          <UserSettings
            changePersonality={setCustomPersonality}
            changeVoice={setCustomVoice}
          />
        )}
        <div className="flex flex-col">
          <p className="text-xs text-gray-600">{name}</p>
          <p className="text-xs text-gray-400">{numberOfMessages} messages</p>
        </div>
      </div>
      <div className="space-x-1">
        <button
          type="button"
          className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center"
        >
          <FaPhone className="text-gray-600 w-5 h-5" />
        </button>
        <button
          type="button"
          className="hover:bg-gray-100 rounded-full font-medium text-sm p-1.5 text-center inline-flex items-center"
        >
          <FaVideo className="text-gray-600 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
