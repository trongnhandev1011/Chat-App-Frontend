import { User } from "../types/user";
import axiosClient from "./backend";

export const getChatById = async (id: string) => {
  try {
    const result = await axiosClient.get(`/api/chat/${id}`);

    return result.data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllChat = async () => {
  try {
    const result = await axiosClient.get(`/api/chat`);

    return result.data;
  } catch (e) {
    console.log(e);
  }
};

export const createChat = async (data: {
  createdUserId: string;
  chatName?: string;
  users: string[];
}) => {
  try {
    const result = await axiosClient.post("/api/chat", data);

    return result;
  } catch (e) {
    console.log(e);
  }
};
