import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserVO } from "@/types/vo.types";
import { Maybe } from "@/types/common";
interface UserStore {
  user: Maybe<UserVO>;
  setUser: (user: Maybe<UserVO>) => void;
}
const userStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: Maybe<UserVO>) => set({ user }),
    }),
    {
      name: "user-storage",
    },
  ),
);
export default userStore;
