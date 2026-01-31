import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserVO } from "@/types/vo.types";
interface UserStore {
  user: UserVO | null;
  setUser: (user: UserVO | null) => void;
}
const userStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserVO | null) => set({ user }),
    }),
    {
      name: "user-storage",
    },
  ),
);
export default userStore;
