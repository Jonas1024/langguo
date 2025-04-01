import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { axiosPost } from "@/utils/NetUtils";

interface StoreState {
  historyList: HistoryInfo[] | null;
}

interface StoreActions {
    generateVideo: () => Promise<void>;
}

const DEFAULT_STATE: StoreState = {
    historyList: null,
};

export const useUserStore = create<StoreState & StoreActions>()(
  persist(
    () => ({
      ...DEFAULT_STATE,
      generateVideo: async () => {
          await axiosPost("/temp");
      },
    }),

    {
      name: "session-storage",
    }
  )
);
