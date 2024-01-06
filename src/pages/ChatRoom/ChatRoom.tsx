import { Button, Input } from "@nextui-org/react";
import { AxiosResponse } from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { UserContext } from "../../App";
import ChatMessageCard from "../../components/ChatMessageCard/ChatMessageCard";
import axiosClient, { GENERAL_BASE_URL } from "../../services/backend";
import { Chat, ChatMessage } from "../../types/chat";

export default function ChatRoom() {
  const socket = useRef<Socket | null>(null);
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>();
  const { user } = useContext(UserContext);
  const params = useParams();
  const id = params?.id as string;

  const { data: res } = useQuery<AxiosResponse<Chat>>({
    queryKey: id,
    queryFn: () => axiosClient.get(`/api/chat/${id}`),
  });

  const fetchMessages = async ({ pageParam = 1 }) => {
    const res = await axiosClient.get(
      `/api/chat/${id}/messages?page=${pageParam}`
    );
    return res;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  const reversedMessages = data?.pages
    .map((page) => page.data.flat().reverse())
    .flat();

  const submitHandler = () => {
    socket?.current?.emit("messages", {
      message,
      userId: user?._id,
      chatId: id,
    });
    setMessage("");
  };

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(GENERAL_BASE_URL, {
        path: "/socket",
      });

      socket.current.connect();
      socket.current.emit("join_chat_room", {
        userId: user?._id,
        chatId: id,
      });

      setTimeout(() => {
        const chatList = document.querySelector(".chat-message-list");

        if (chatList) {
          chatList.scrollTop = chatList?.scrollHeight + 100;
        }
      }, 500);

      socket.current?.on("messages", (msg: ChatMessage) => {
        setMessageList((prev) => [...prev, msg]);

        if (msg.createdUserId._id === user?._id) {
          const chatList = document.querySelector(".chat-message-list");

          if (chatList) {
            setTimeout(() => {
              chatList.scrollTop = chatList?.scrollHeight + 100;
            }, 100);
          }
        }
      });
    }

    return () => {
      socket?.current?.off("messages", () => {});
    };
  }, []);

  return (
    <div className="chat-room flex-1">
      <div className="w-full px-10 py-6 bg-blue-600">
        <div className="font-bold text-white text-lg">{res?.data.chatName}</div>
      </div>
      <div>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <div className="mx-10 mt-10 flex flex-col gap-10 max-h-[calc(100vh-240px)] overflow-y-scroll chat-message-list scroll-smooth pr-4">
            {[...reversedMessages, ...messageList].map((msg: ChatMessage) => (
              <ChatMessageCard key={msg?._id} message={msg} />
            ))}
          </div>
        )}
      </div>
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
