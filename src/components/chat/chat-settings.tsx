'use client';
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getVoices } from '@/services/tts';

interface UserSettingsProps {
  changePersonality: (personality: string) => void;
  changeVoice: (voice: string) => void;
}
function UserSettings({ changePersonality, changeVoice }: UserSettingsProps) {
  const [personality, setPersonality] = useLocalStorage(
    'personality',
    `You are an personal friend of the user. 
You will pretend to be a friend of the user. Respond to the user's messages with a friendly tone. Use Emojis to express your emotions.`,
  );
  const [voice, setVoice] = useLocalStorage<string | null>('voice', null);
  const queryClient = useQueryClient();

  const voices = useQuery({
    queryKey: ['voices'],
    queryFn: () => getVoices(),
  });

  const [isSaving, setIsSaving] = React.useState(false);
  // debounce
  React.useEffect(() => {
    setIsSaving(true);
    const timeout = setTimeout(() => {
      changePersonality(personality);
      setIsSaving(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [personality, changePersonality]);

  React.useEffect(() => {
    if (voice) {
      changeVoice(voice);
    }
  }, [voice, changeVoice]);

  return (
    <div className="absolute top-10 left-0 w-full h-full bg-white border border-gray-200 rounded-md shadow-md z-20 ">
      <div className="flex flex-col justify-center items-center space-y-2">
        <p className="text-md text-gray-600 font-semibold">Settings</p>
        <p className="text-sm text-gray-400">
          Change the personality of the bot
        </p>
        <div className="flex flex-row justify-center items-center space-x-2">
          <p className="text-sm text-gray-600 font-semibold">Personality</p>
        </div>
        <textarea
          className="w-5/6 h-32 border border-gray-200 rounded-md p-2"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
        />
        {isSaving && (
          <p className="text-sm text-gray-400">Saving personality...</p>
        )}
        {!isSaving && (
          <p className="text-sm text-gray-400">Personality saved</p>
        )}
      </div>
      <div className="flex flex-col justify-center items-center space-y-2">
        <p className="text-md text-gray-600 font-semibold">Voices</p>
        <p className="text-sm text-gray-400">Change the voice of the bot</p>
        <div className="flex flex-row justify-center items-center space-x-2">
          <p className="text-sm text-gray-600 font-semibold">Voice</p>
          <select
            className="w-5/6 h-32 border border-gray-200 rounded-md p-2"
            value={voice ?? undefined}
            onChange={(e) => setVoice(e.target.value)}
          >
            {/* <option value={null}>Default</option> there is no default */}
            {voices.data?.map((voice) => (
              <option key={voice.voice_id} value={voice.voice_id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
