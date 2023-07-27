import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages, personality } = await req.json();
  let messagesForResponse: ChatCompletionRequestMessage[] = messages;

  console.log(messages);
  if (typeof personality === 'string') {
    messagesForResponse.unshift({
      role: 'system',
      content: personality,
    });
  }
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messagesForResponse,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
