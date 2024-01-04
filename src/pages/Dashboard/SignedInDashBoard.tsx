import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { createChat } from "../../services/chat";
import { getAllUser } from "../../services/user";
import ChatList from "../../containers/ChatList/ChatList";

export const SignedInDashBoard = () => {
  const { user } = React.useContext(UserContext);
  const { data: res } = useQuery({
    queryKey: "users",
    queryFn: getAllUser,
  });

  const [values, setValues] = useState(new Set([]));
  const [chatName, setChatName] = useState<string>();
  const navigate = useNavigate();

  const handleSelectionChange = (e) => {
    setValues(new Set(e.target.value.split(",")));
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const users = res?.data.users ?? [];

  const createChatHandler = async () => {
    if (values.size && user) {
      const result = await createChat({
        createdUserId: user?._id,
        users: [...Array.from(values), user._id],
        chatName,
      });
      if (result) {
        navigate(`/chat-room/${result.data._id}`);
      }
    }
  };
  return (
    <div className="w-screen h-screen">
      <div className="px-10 pt-10 h-full shadow w-[300px]">
        <div className="text-center mt-4 rounded-md">
          <Button
            variant="faded"
            size="md"
            className="!text-white bg-black py-2 px-4 rounded-md"
            onClick={onOpen}
          >
            Create new chat
          </Button>
        </div>
        <ChatList />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={() => setValues(new Set([]))}
        >
          <ModalContent>
            {(_onClose) => (
              <ModalBody>
                <Tabs aria-label="Loại">
                  <Tab key="group" title="Group">
                    <Input
                      label="Chat name"
                      placeholder="Enter chat name here..."
                      className="mb-4"
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                    />
                    <Select
                      label="Members"
                      selectionMode="multiple"
                      placeholder="Select your members..."
                      selectedKeys={values}
                      className="max-w-xs"
                      onChange={handleSelectionChange}
                    >
                      {users
                        ?.filter((u) => u.email !== user?.email)
                        .map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.displayName}
                          </SelectItem>
                        ))}
                    </Select>
                  </Tab>
                  <Tab key="direct" title="Direct Message">
                    <Select
                      label="User"
                      placeholder="Select user you want to text..."
                      selectedKeys={values}
                      className="max-w-xs"
                      onChange={handleSelectionChange}
                    >
                      {users
                        ?.filter((u) => u.email !== user?.email)
                        .map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.displayName}
                          </SelectItem>
                        ))}
                    </Select>
                  </Tab>
                </Tabs>
                <Button className="mb-4" onClick={createChatHandler}>
                  Create chat
                </Button>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
      <div className="absolute right-6 top-6 flex items-center gap-4">
        <div>
          <img
            src={user?.avatarUrl}
            className="w-[40px] h-[40px] rounded-full"
          />
        </div>
        <div>
          <span>{user?.displayName}</span>
        </div>
      </div>
    </div>
  );
};
