"use client";
import Profile from "@/components/ProfileComponent";
import userStore from "@/store/user.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ProfilePage() {
  const user = userStore.getState().user;
  const route = useRouter();
  useEffect(() => {
    if (!user) {
      route.push("/login");
      return;
    }
  }, []);
  return (
    <main className="flex-1 flex justify-center items-center">
      <Profile user={user!} />
    </main>
  );
}
