import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import { User } from "./types/user";
import ChatRoom from "./pages/ChatRoom/ChatRoom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/chat-room/:id",
    element: <ChatRoom />,
  },
]);

export const UserContext = React.createContext<{
  user: User | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: any;
}>({
  user: undefined,
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState<User>();

  const queryClient = new QueryClient();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
