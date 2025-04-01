'use client';

import { useState } from 'react';
import { Upload, Input, Button, Typography, App, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import styles from './sidebar.module.scss';

const { TextArea } = Input;
const { Title } = Typography;

const Sidebar = () => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  // 处理文件选择，保留已选文件
  const handleFileChange: UploadProps['onChange'] = (info: UploadChangeParam) => {
    const newFiles = info.fileList.map((file) => file.originFileObj as RcFile).filter(Boolean);

    setFileList((prevFiles) => {
      const allFiles = [...prevFiles, ...newFiles];
      const uniqueFiles = Array.from(new Map(allFiles.map((file) => [file.name, file])).values());
      return uniqueFiles;
    });
  };

  // 处理文件删除
  const handleRemove = (file: UploadFile) => {
    setFileList((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
  };

  // 处理上传
  const handleGenerateVideo = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择图片');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('视频生成成功！');
      console.log('上传成功', response.data);
    } catch (error) {
      message.error('上传失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.sidebarContainer}>
      {/* 标题：上传参考图片 */}
      <Title level={5} className={styles.title}>
        上传参考图片
      </Title>
      <Upload
        multiple
        accept="image/*"
        beforeUpload={() => false} // 阻止自动上传
        onChange={handleFileChange}
        onRemove={handleRemove} // 添加删除功能
        fileList={fileList.map((file) => ({
          uid: file.name,
          name: file.name,
          status: 'done',
        }))}
      >
        <Button icon={<UploadOutlined />} type="dashed" block size="large" className={styles.uploadButton}>
          选择文件
        </Button>
      </Upload>

      {/* 标题：输入提示词 */}
      <Title level={5} className={styles.title}>
        输入提示词
      </Title>
      <TextArea placeholder="请输入提示词..." autoSize={{ minRows: 4, maxRows: 6 }} className={styles.textArea} />

      {/* 生成按钮 */}
      <Button
        type="primary"
        block
        size="large"
        className={styles.generateButton}
        onClick={handleGenerateVideo}
        loading={loading}
      >
        生成视频
      </Button>
    </div>
  );
};

export default Sidebar;