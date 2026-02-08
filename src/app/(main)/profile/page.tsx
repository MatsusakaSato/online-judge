"use client";
import Profile from "@/components/ProfileComponent";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ProfilePage() {
  const user = useUser();
  const route = useRouter();
  useEffect(() => {
    if (!user) {
      route.push("/login");
      return;
    }
  }, []);
  return (
    <main className="flex-1 flex justify-center items-center">
      <Profile user={user} />
    </main>
  );
}
