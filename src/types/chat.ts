import { User } from "./user";

export type ChatMessage = {
  _id: string;
  chatId: string;
  content: string;
  createdUserId: User;
  createdAt: string;
};

export type Chat = {
  chatName: string;
  _id: string;
  messages: ChatMessage[];
  users: string[];
};

export type ChatMessageResponse = {
  id: string;
  messages: ChatMessage[];
};
