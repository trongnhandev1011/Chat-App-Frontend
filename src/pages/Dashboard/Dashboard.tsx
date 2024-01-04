import React, { useState } from "react";
import { UserContext } from "../../App";
import { login } from "../../services/auth";
import { createChat } from "../../services/chat";
import LoginPage from "../LoginPage/LoginPage";
import { SignedInDashBoard } from "./SignedInDashBoard";

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

  if (!user) return <LoginPage />;

  return <SignedInDashBoard />;
}


