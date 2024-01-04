import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { getSupabaseInstance } from "../../supabase/supabase";

export default function LoginPage() {
  return (
    <div className="h-screen flex w-screen justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="text-[60px] text-center mb-10">Chat Room</div>
        {/* <div className="max-w-[360px]">Button</div> */}
        <Auth
          supabaseClient={getSupabaseInstance()}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={["discord", "google"]}
        />
      </div>
    </div>
  );
}
