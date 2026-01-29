import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserVO } from "@/types/vo.types";
interface UserStore {
  user: UserVO | null;
  setUser: (user: UserVO) => void;
}
const userStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserVO) => set({ user }),
    }),
    {
      name: "user-storage",
    },
  ),
);
export default userStore;
