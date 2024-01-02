import { User } from "../types/user";
import axiosClient from "./backend";

export const login = async (displayName: string) => {
  try {
    const result = axiosClient.post<User>("/api/user", { displayName });

    return result;
  } catch (e) {
    console.log(e);
  }
};
