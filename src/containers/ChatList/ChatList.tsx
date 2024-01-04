import { useQuery } from "react-query";
import { getAllChat } from "../../services/chat";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
  const { data: chatRes } = useQuery({
    queryKey: "chats",
    queryFn: getAllChat,
  });

  const navigate = useNavigate();

  return (
    <div className="chat-list flex flex-col gap-4 mt-10">
      {chatRes?.chats.map((chat, idx) => (
        <div
          key={idx}
          className="flex gap-4 items-center cursor-pointer"
          onClick={() => navigate(`/chat-room/${chat._id}`)}
        >
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5962/5962463.png"
              width={40}
              height={40}
            />
          </div>
          <div>
            <div className="text-lg font-semibold">{chat?.chatName}</div>
            <div>
              {chat?.messages?.[0]?.content ?? `Chat này được đã được tạo`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
