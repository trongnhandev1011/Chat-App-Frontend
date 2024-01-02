import { LoadingButton } from "@mui/lab";
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { login } from "../../services/auth";
import { createChat } from "../../services/chat";
import { getAllUser } from "../../services/user";

export default function Dashboard() {
  const { user, setUser } = React.useContext(UserContext);
  const [displayName, setDisplayName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInHandler = async () => {
    if (displayName) {
      setLoading(true);
      const result = await login(displayName);

      if (result) {
        setUser(result.data);
      }
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="h-screen flex w-screen justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="text-[60px] text-center mb-10">Chat Room</div>
          <div className="max-w-[360px]">
            <div className="w-full">
              <TextField
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full"
                placeholder="Enter your display name"
              />
            </div>
            <div className="mt-4">
              <LoadingButton
                className="!bg-black !text-white w-full"
                disabled={!displayName}
                loading={loading}
                onClick={signInHandler}
              >
                Enter
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    );

  return <SignedInDashBoard />;
}

const SignedInDashBoard = () => {
  const { user } = React.useContext(UserContext);
  const { data: res } = useQuery({
    queryKey: "users",
    queryFn: getAllUser,
  });

  const { data: chatRes } = useQuery({
    queryKey: "users",
    queryFn: getAllUser,
  });
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const navigate = useNavigate();

  const users = res?.data.users;

  const createChatHandler = async () => {
    if (selectedUserId && user) {
      const result = await createChat({
        createdUserId: user?._id,
        secondUserId: selectedUserId,
        messages: [],
      });

      if (result) {
        navigate(`/chat-room/${result.data._id}`);
      }
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div>
        <div className="w-[400px]">
          <InputLabel id="demo-simple-select-label">Select user</InputLabel>
          <Select
            className="w-full"
            name="user"
            label="Select user"
            onChange={(e) => setSelectedUserId(e.target.value as string)}
          >
            {users
              ?.filter((u) => u._id !== user?._id)
              .map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.displayName}
                </MenuItem>
              ))}
          </Select>
        </div>
        <div className="bg-black text-center mt-2">
          <Button className="!text-white" onClick={createChatHandler}>
            Chat with this user
          </Button>
        </div>
      </div>
    </div>
  );
};
