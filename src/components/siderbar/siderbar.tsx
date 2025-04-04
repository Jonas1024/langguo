'use client';

import { useState, useEffect } from 'react';
import { Upload, Button, Typography, App, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { text2Video } from '@/services/generateVideo';
import styles from './sidebar.module.scss';
import { useSessionStore } from '@/store/sessionStore';
import { findBestMatch } from '@/utils/stringUtils';

const { Title } = Typography;

// 是否显示自定义提示词输入框
const showCustomizePrompt = true;

const Sidebar = () => {
  const [productFileList, setProductFileList] = useState<UploadFile[]>([]);
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const { addTaskId, fetchReferenceImages, referenceImages, videoPrompt } = useSessionStore();

  useEffect(() => {
    fetchReferenceImages();
  }, [fetchReferenceImages]);

  // 处理产品图片选择
  const handleProductImageChange = (info: UploadChangeParam) => {
    const { file } = info;
    const { status, response } = file;
    
    // 更新文件列表
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 限制只能上传一个文件
    
    // 根据上传状态更新文件信息
    if (status === 'done') {
      if (response?.data?.url) {
        file.url = response.data.url;
        setProductImageUrl(response.data.url);
        message.success('产品图片上传成功');
      } else {
        message.error('上传失败：未获取到图片URL');
      }
    } else if (status === 'error') {
      message.error('产品图片上传失败');
    }
    
    setProductFileList(newFileList);
  };

  // 处理文件上传前的验证
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }
    return true;
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!productImageUrl) {
      message.warning('请先选择产品图片');
      return;
    }

    const prompt = form.getFieldValue('prompt');
    if (!prompt) {
      message.warning('请输入提示词');
      return;
    }

    // 查找最佳匹配的参考图片
    const bestMatch = findBestMatch(prompt, referenceImages);
    let referImageUrl = productImageUrl;

    if (bestMatch && referenceImages[bestMatch]?.length > 0) {
      referImageUrl = referenceImages[bestMatch][0].url;
    } else {
      // 随机选择一个类别的第一张图片
      const categories = Object.keys(referenceImages);
      if (categories.length > 0) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        if (referenceImages[randomCategory]?.length > 0) {
          referImageUrl = referenceImages[randomCategory][0].url;
        }
      }
    }
    const promptStr = form.getFieldValue('customizePrompt').length > 0 ? form.getFieldValue('customizePrompt') : videoPrompt[Math.floor(Math.random() * videoPrompt.length)];

    try {
      setIsGenerating(true);
      // 调用 text2Video 接口
      const response = await text2Video({
        templateUuId: "dd02ba6dc96d4767aa719964ae954b0d",
        params: {
          productImage: productImageUrl,
          referImage: referImageUrl,
          prompt: promptStr
        }
      });

      if (response.data.taskId) {
        // 清除已选择的图片
        form.setFieldValue('productImage', undefined);
        form.setFieldValue('prompt', undefined);
        form.setFieldValue('customizePrompt', undefined);
        setProductImageUrl('');
        setProductFileList([]);
        addTaskId(response.data.taskId);
        message.info('视频生成中，请稍候...');
      } else {
        message.error('未获取到任务ID');
      }
    } catch (error) {
      message.error('生成视频失败');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.sidebarContainer}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* 标题：上传产品图片 */}
        <div className={styles.section}>
          <Title level={5} className={styles.title}>
            上传产品图片
          </Title>
          <div className={styles.uploadSection}>
            <Form.Item
              name="productImage"
              rules={[{ required: true, message: '请上传产品图片' }]}
            >
              <Upload
                accept="image/*"
                listType="picture"
                maxCount={1}
                fileList={productFileList}
                onChange={handleProductImageChange}
                action="https://cms-test.imlightease.top/api/ai/agent/upload"
                beforeUpload={beforeUpload}
              >
                {productFileList.length === 0 && (
                  <Button icon={<UploadOutlined />} type="dashed" block size="large" className={styles.uploadButton}>
                    选择产品图片
                  </Button>
                )}
              </Upload>
            </Form.Item>
          </div>
        </div>

        {/* 提示词输入框 */}
        <div className={styles.section}>
          <Title level={5} className={styles.title}>
            提示词
          </Title>
          <Form.Item
            name="prompt"
            rules={[{ required: true, message: '请输入提示词' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入提示词，描述您想要的视频效果"
              className={styles.promptInput}
            />
          </Form.Item>
        </div>

        {/* 自定义提示词输入框 */}
        {showCustomizePrompt && (
          <div className={styles.section}>
            <Title level={5} className={styles.title}>
              自定义图生视频提示词(debug)
            </Title>
            <Form.Item
              name="customizePrompt"
              rules={[{ required: true, message: '请输入自定义提示词' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="请输入自定义提示词"
                className={styles.promptInput}
              />
            </Form.Item>
          </div>
        )}

        {/* 生成按钮 */}
        <Form.Item>
          <Button
            type="primary"
            block
            size="large"
            className={styles.generateButton}
            htmlType="submit"
            loading={isGenerating}
          >
            生成视频
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Sidebar;