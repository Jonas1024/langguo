'use client';

import { useState } from 'react';
import HistoryItem from '../historyItem/historyItem';
import styles from './historyList.module.scss';

const HistoryList = () => {
  const [videos] = useState([
    { 
      id: 1, 
      thumbnail: 'https://picsum.photos/640/360', 
      prompt: '帮我生成一个穿着汉服在竹林漫步的女孩视频，帮我生成一个穿着汉服在竹林漫步的女孩视频，帮我生成一个穿着汉服在竹林漫步的女孩视频，帮我生成一个穿着汉服在竹林漫步的女孩视频，帮我生成一个穿着汉服在竹林漫步的女孩视频', 
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
      loading: false, 
      progress: 100,
      timestamp: '03-31 11:21'
    },
    { 
      id: 2, 
      thumbnail: 'https://picsum.photos/640/360?random=1', 
      prompt: '生成一个女孩在海边奔跑的视频，要有夕阳的感觉', 
      videoUrl: '', 
      loading: true, 
      progress: 75,
      timestamp: '03-31 11:23'
    },
    { 
      id: 3, 
      thumbnail: 'https://picsum.photos/640/360?random=2', 
      prompt: '帮我生成一个女孩在咖啡厅看书的视频，要有文艺气息', 
      videoUrl: '', 
      loading: true, 
      progress: 45,
      timestamp: '03-31 11:24'
    },
    { 
      id: 4, 
      thumbnail: 'https://picsum.photos/640/360?random=3', 
      prompt: '生成一个女孩在雨中撑伞漫步的视频，要有意境美', 
      videoUrl: '', 
      loading: true, 
      progress: 15,
      timestamp: '03-31 11:25'
    },
  ]);

  return (
    <div className={styles.container}>
      {videos.map((video) => (
        <HistoryItem key={video.id} {...video} />
      ))}
    </div>
  );
};

export default HistoryList;