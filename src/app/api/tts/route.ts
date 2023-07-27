import { NextRequest, NextResponse } from 'next/server';
import generateSpeech, { getVoices, maleVoices } from './eleven-labs-api';
export const GET = async (req: NextRequest) => {
  const voices = await getVoices();
  return NextResponse.json({
    voices,
  });
};
export const POST = async (req: NextRequest) => {
  let url = new URL(req.nextUrl);
  // use this to create a new URL
  const { text, voice } = await req.json();
  const dataStream = await generateSpeech(text, voice);
  return NextResponse.json({
    url: dataStream.replace('./public', `${url.origin}`),
  });
};
