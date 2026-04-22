import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session.user;
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return user;
};
