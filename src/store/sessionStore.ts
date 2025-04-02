import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { VideoTaskData } from "@/types/types";
import { getVideoById } from "@/services/generateVideo";

interface StoreState {
  videoTasks: Map<string, VideoTaskData>;
  onScrollToBottom?: () => void;
}

interface StoreActions {
  addTaskId: (taskId: string) => void;
  removeTaskId: (taskId: string) => void;
  fetchVideoData: () => Promise<void>;
  setScrollToBottom: (callback: () => void) => void;
}

const DEFAULT_STATE: StoreState = {
  videoTasks: new Map(),
  onScrollToBottom: undefined,
};

export const useSessionStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      addTaskId: async (taskId: string) => {
        set((state) => {
          const newMap = new Map(state.videoTasks);
          newMap.set(taskId, {
            taskId,
            status: 'CANCELLED',
            images: [],
            videos: []
          });
          return {
            videoTasks: newMap
          };
        });
        // 添加任务后立即获取视频数据
        await useSessionStore.getState().fetchVideoData();
        // 触发滚动到底部
        const state = useSessionStore.getState();
        state.onScrollToBottom?.();
      },
      removeTaskId: (taskId: string) => {
        set((state) => {
          const newMap = new Map(state.videoTasks);
          newMap.delete(taskId);
          return {
            videoTasks: newMap
          };
        });
      },
      fetchVideoData: async () => {
        try {
          const state = useSessionStore.getState();
          const tasks = Array.from(state.videoTasks.entries());
          const incompleteTasks = tasks.filter(([, task]) => task.status !== 'VIDEO_SUCCESS');
          
          // 如果没有未完成的任务，直接返回
          if (incompleteTasks.length === 0) {
            return;
          }
          
          // 并行请求所有未完成的任务
          const promises = incompleteTasks.map(async ([taskId]) => {
            try {
              const response = await getVideoById(taskId);
              return { taskId, data: response.data };
            } catch (error) {
              console.error(`Failed to fetch video data for task ${taskId}:`, error);
              return null;
            }
          });

          const results = await Promise.all(promises);
          
          set((state) => {
            const newMap = new Map(state.videoTasks);
            results.forEach(result => {
              if (result) {
                newMap.set(result.taskId, result.data);
              }
            });
            return {
              videoTasks: newMap
            };
          });
        } catch (error) {
          console.error('Failed to fetch video data:', error);
        }
      },
      setScrollToBottom: (callback: () => void) => {
        set({ onScrollToBottom: callback });
      },
    }),
    {
      name: "session-storage",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          const state = JSON.parse(str);
          // 从数组恢复 Map，确保 key 和 value 都被正确恢复
          if (state.state && state.state.videoTasks) {
            const entries = state.state.videoTasks;
            state.state.videoTasks = new Map(entries.map(([key, value]: [string, VideoTaskData]) => [String(key), value]));
          }
          return state;
        },
        setItem: (name, value) => {
          // 将 Map 转换为数组以保持顺序，确保 key 被正确序列化
          const stateToStore = {
            ...value,
            state: {
              ...value.state,
              videoTasks: Array.from(value.state.videoTasks.entries()).map(([key, value]: [string, VideoTaskData]) => [String(key), value])
            }
          };
          sessionStorage.setItem(name, JSON.stringify(stateToStore));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      }
    }
  )
);
