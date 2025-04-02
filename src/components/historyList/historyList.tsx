'use client';

import { useEffect, useRef } from 'react';
import HistoryItem from '../historyItem/historyItem';
import styles from './historyList.module.scss';
import { useSessionStore } from '@/store/sessionStore';

const HistoryList = () => {
  const { videoTasks, setScrollToBottom } = useSessionStore();
  const videos = Array.from(videoTasks.values());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 注册滚动到底部的回调
    setScrollToBottom(() => {
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 100); // 给一点延迟确保新内容已渲染
      }
    });
  }, [setScrollToBottom]);

  useEffect(() => {
    // 每5秒调用一次 fetchVideoData
    const interval = setInterval(() => {
      useSessionStore.getState().fetchVideoData();
    }, 5000);

    // 组件卸载时清理定时器
    return () => clearInterval(interval);
  }, []); // 空依赖数组，因为 getState() 总是获取最新的 store 状态

  return (
    <div ref={containerRef} className={styles.container}>
      {videos.map((video) => (
        <HistoryItem key={video.taskId} {...video} />
      ))}
    </div>
  );
};

export default HistoryList;