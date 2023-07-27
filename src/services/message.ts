export interface Message {
  text: string;
  sentBy: string;
  sentAt: Date;
  isChatOwner?: boolean;
}
let messages: Message[] = [];

export const getMessages = async (messages: Message[]) => {
  // const { data } = await axios.post('/api/getMessages', { messages });
  const data = messages; // TODO: replace with axios call :)
  return data;
};

export const postMessage = async (message: Message) => {};
