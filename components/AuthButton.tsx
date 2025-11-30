"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";


const AuthButton = () => {
    const { user, signOut } = useUser();
    const router = useRouter();

  if (user) {
    return (
      <>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Log out
        </Button>
      </>
    );
  }
  return (
    <>
    <Button
      variant="outline"
      onClick={() => {
        router.push("/signup");
      }}
    >
      Signup
    </Button>

    <Button
      variant="outline"
      onClick={() => {
        router.push("/login");
      }}
    >
      Login
    </Button>
    </>
  );
};

export default AuthButton;
