import { User } from "../types/user";
import axiosClient from "./backend";

export const getAllUser = () => {
  try {
    const result = axiosClient.get<{ users: User[] }>("/api/user");

    return result;
  } catch (e) {
    console.log(e);
  }
};
