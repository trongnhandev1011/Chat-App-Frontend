import { useInfiniteQuery } from "react-query";
import axiosClient from "../../services/backend";
import { Chat, ChatMessage } from "../../types/chat";
import ChatMessageCard from "../../components/ChatMessageCard/ChatMessageCard";

export default function ChatMessageList({
  chatId,
  socketMsgs,
}: {
  chatId: string;
  socketMsgs: ChatMessage[];
}) {
  const fetchMessages = async ({ pageParam = 0 }) => {
    const res = await axiosClient.get(
      `/api/chat/${chatId}/messages?page=${pageParam}`
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
    .map((page) =>
      page.data
        ?.map((item: Chat) => item?.messages)
        .flat()
        .reverse()
    )
    .flat();

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="mx-10 mt-10 flex flex-col gap-10">
      {[...socketMsgs, ...reversedMessages]
        .reverse()
        .map((msg: ChatMessage) => (
          <ChatMessageCard key={msg._id} message={msg} />
        ))}
    </div>
  );
}
