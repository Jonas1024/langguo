'use client';

import { Card, Typography, Image, theme } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './historyItem.module.scss';
import { VideoTaskData } from '@/types/types';

const { Text } = Typography;

const HistoryItem: React.FC<VideoTaskData> = ({ status, videos, params }) => {
  const { token } = theme.useToken();
  
  const getStatusText = (status: VideoTaskData['status']) => {
    switch (status) {
      case 'VIDEO_SUCCESS':
        return '已完成';
      case 'FAILED':
        return '生成失败';
      case 'CANCELLED':
        return '已取消';
      case 'VIDEO_PROCESSING':
        return '视频生成中，预计需要 3 分钟';
      case 'IMAGE_SUCCESS':
        return '图片生成完成，准备生成视频';
      case 'IMAGE_PROCESSING':
        return '图片生成中，预计需要 4 分钟';
      case 'CREATED':
        return '等待处理，预计需要 5 分钟';
    }
  };
  
  return (
    <Card
      className={styles.card}
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
      }}
      styles={{
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
        }
      }}
    >
      {/* 顶部标题部分 */}
      <div className={styles.header} style={{ borderBottom: `1px solid ${token.colorBorder}` }}>
        <VideoCameraOutlined className={styles.icon} style={{ color: token.colorPrimary }} />
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <Text className={styles.title} style={{ color: token.colorText }}>驰电-视频生成</Text>
          </div>
          <Text className={styles.prompt} style={{ color: token.colorTextSecondary }}>驰电-视频生成</Text>
        </div>
        {params?.productImage && (
          <Image 
            src={params?.productImage}
            width={40} 
            height={40} 
            preview={false}
            className={styles.thumbnail}
            style={{ borderRadius: token.borderRadius }}
            alt="Thumbnail" 
          />
        )}
      </div>

      {/* 视频内容区域 */}
      <div className={styles.videoContainer}>
        {videos && videos.length > 0 ? (
          <video
            src={videos[0].url}
            controls
            className={styles.video}
          />
        ) : (
          <>
            <div className={styles.imageContainer}>
              <Image 
                src={params?.productImage} 
                alt="Video thumbnail" 
                className={styles.image}
                preview={false}
              />
            </div>
            <div className={styles.statusOverlay}>
              <Text className={styles.statusText} style={{ color: token.colorTextSecondary }}>
                {getStatusText(status)}
              </Text>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default HistoryItem;