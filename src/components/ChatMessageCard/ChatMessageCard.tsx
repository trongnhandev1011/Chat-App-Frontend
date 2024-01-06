import { useContext } from "react";
import { ChatMessage } from "../../types/chat";
import { UserContext } from "../../App";
import clsx from "clsx";

export default function ChatMessageCard({ message }: { message: ChatMessage }) {
  const { user } = useContext(UserContext);

  return (
    <div
      className={clsx(
        "chat-message-card flex",
        user?._id === message?.createdUserId._id ? "justify-end" : ""
      )}
    >
      <div className="flex items-center gap-4">
        <div>
          <img
            className="rounded-full"
            src={message?.createdUserId?.avatarUrl}
            width={40}
            height={40}
          />
        </div>
        <div className="bg-blue-600 text-white w-fit px-4 py-2 rounded-lg">
          {message?.content}
        </div>
      </div>
    </div>
  );
}
