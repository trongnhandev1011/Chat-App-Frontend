import React from "react";
import { UserContext } from "../../App";
import LoginPage from "../LoginPage/LoginPage";
import { SignedInDashBoard } from "./SignedInDashBoard";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const { user } = React.useContext(UserContext);

  if (!user) return <LoginPage />;

  return (
    <div className="flex">
      <SignedInDashBoard />
      <Outlet />
    </div>
  );
}
