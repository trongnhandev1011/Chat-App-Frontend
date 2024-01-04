import { useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import axiosClient, { GENERAL_BASE_URL } from "../../services/backend";
import { UserContext } from "../../App";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getChatById } from "../../services/chat";
import { Button, Input } from "@nextui-org/react";

export default function ChatRoom() {
  const socket = useRef<Socket | null>(null);
  const [message, setMessage] = useState<string>();
  const { user } = useContext(UserContext);
  const params = useParams();
  const id = params?.id as string;

  const { data: res } = useQuery({
    queryKey: id,
    queryFn: () => axiosClient.get(`/api/chat/${id}`),
  });

  const [createdUserId, secondUserId] = id.split("_");

  const submitHandler = () => {
    socket?.current?.emit("messages", {
      message,
      sender: user?._id,
      receiver: createdUserId === user?._id ? secondUserId : createdUserId,
    });
  };

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(GENERAL_BASE_URL, {
        path: "/socket",
      });

      socket.current.connect();
      socket.current.on("messages", () => {
        console.log(1223);
      });
    }

    return () => {
      socket?.current?.off("messages", () => {});
    };
  }, []);

  return (
    <div className="chat-room">
      <div></div>
      <div className="flex fixed left-[300px] bottom-0 w-[calc(100vw-300px)] px-10 shadow gap-10 border border-top-black py-4 items-center">
        <div className="flex-1">
          <Input
            className="w-full"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div>
          <Button className="!bg-black !text-white" onClick={submitHandler}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
