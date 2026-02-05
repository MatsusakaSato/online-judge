import { UserSelectModel } from "@/schema/user.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: Partial<UserSelectModel>;
  setUser: (user: Partial<UserSelectModel>) => void;
}

const userStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {},
      setUser: (user: Partial<UserSelectModel>) => set({ user }),
    }),
    {
      name: "user-storage",
    },
  ),
);
export default userStore;
