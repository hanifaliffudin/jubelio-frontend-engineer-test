import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string;
  refreshToken: string;
  updateToken: (token: string) => void;
  updateRefreshToken: (refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      refreshToken: "",
      updateToken: (token: string) => set({ token: token }),
      updateRefreshToken: (refreshToken: string) =>
        set({ refreshToken: refreshToken }),
    }),
    {
      name: "token-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
