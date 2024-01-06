import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import Dashboard from "./pages/Dashboard/Dashboard";
import { getSupabaseInstance } from "./supabase/supabase";
import axiosClient from "./services/backend";
import { NextUIProvider } from "@nextui-org/react";
import { getMyProfile } from "./services/user";
import { User } from "./types/user";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/chat-room/:id",
        element: <ChatRoom />,
      },
    ],
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

  const supabase = getSupabaseInstance();

  const queryClient = new QueryClient();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event !== "SIGNED_OUT") {
        supabase.auth.getSession().then((value) => {
          axiosClient.defaults.headers[
            "Authorization"
          ] = `Bearer ${value.data.session?.access_token}`;

          getMyProfile()
            ?.then((data) => {
              if (data.data.user) {
                setUser(data.data.user);
              }
            })
            .catch(() => {
              setUser(undefined);
              // window.location.assign("/");
            });
        });
      } else {
        setUser(undefined);
      }
    });
  }, []);

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ user, setUser }}>
          <RouterProvider router={router} />
          {/* <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route path="/chat-room/:id" element={<ChatRoom />} />
            </Route>
          </Routes> */}
        </UserContext.Provider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default App;
