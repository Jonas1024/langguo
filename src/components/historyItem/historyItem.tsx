'use client';

import { Card, Progress, Typography, Image, theme } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './historyItem.module.scss';

const { Text } = Typography;

const HistoryItem: React.FC<HistoryInfo> = ({ thumbnail, prompt, videoUrl, loading, progress, timestamp }) => {
  const { token } = theme.useToken();
  
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
            <Text className={styles.timestamp} style={{ color: token.colorTextSecondary }}>{timestamp}</Text>
          </div>
          <Text className={styles.prompt} style={{ color: token.colorTextSecondary }}>{prompt}</Text>
        </div>
        <Image 
          src={thumbnail}
          width={40} 
          height={40} 
          preview={false}
          className={styles.thumbnail}
          style={{ borderRadius: token.borderRadius }}
          alt="Thumbnail" 
        />
      </div>

      {/* 视频内容区域 */}
      <div className={styles.videoContainer} style={{ background: token.colorBgContainer }}>
        <div className={styles.videoWrapper}>
          {loading && (
            <>
              <Image
                src={thumbnail}
                alt="Thumbnail"
                preview={false}
                className={styles.loadingImage}
              />
              <div className={styles.loadingOverlay} style={{ background: token.colorBgMask }}>
                <Progress 
                  type="circle" 
                  percent={progress} 
                  size={48} 
                  strokeColor={token.colorPrimary}
                  trailColor={token.colorBgContainer}
                />
                <Text className={styles.loadingText} style={{ color: token.colorText }}>
                  生成排队中，预计等待{Math.max(0, (100 - progress) / 5)}秒
                </Text>
              </div>
            </>
          )}

          {!loading && (
            <video
              src={videoUrl}
              poster={thumbnail}
              controls
              className={styles.video}
              style={{ background: token.colorBgContainer }}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default HistoryItem;