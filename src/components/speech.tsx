'use client';
import 'regenerator-runtime/runtime'; // I don't want to talk about it
import React, { FC, useEffect, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Speech: FC = () => {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
    finalTranscript,
  } = useSpeechRecognition({
    // clearTranscriptOnListen: true,
  });
  useEffect(() => {
    console.log('finalTranscript', finalTranscript);
  }, [finalTranscript]);
  useEffect(() => {
    console.log('listening', listening);
  }, [listening]);
  return (
    <main className="">
      <h1 className="text-4xl font-bold">Speech Recognition</h1>
      <p className="text-2xl font-bold">{finalTranscript}</p>
      {listening ? (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          Stop
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            SpeechRecognition.startListening({
              language: 'en-US',
            });
          }}
        >
          Start
        </button>
      )}
    </main>
  );
};

export default Speech;
