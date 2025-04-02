"use client";

import "./globals.css";
import SiderBar from "@/components/siderbar/siderbar";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, Layout, theme, App } from "antd";
import { ReactNode } from "react";
import '@ant-design/v5-patch-for-react-19';
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const { Sider, Content } = Layout;

interface Props {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  const LayoutContent: React.FC<Props> = ({ children }) => (
    <Layout style={{ height: "100vh", background: '#141414' }}>
      {/* 左侧栏 */}
      <Sider
        width={350}
        style={{
          background: "#141414",
          padding: "16px",
          height: "100vh",
          overflowY: 'auto',
        }}
      >
        <SiderBar />
      </Sider>

      {/* 右侧内容区域 */}
      <Layout style={{ height: '100vh', background: '#141414' }}>
        <Content
          style={{ 
            height: '100vh',
            position: 'relative',
            background: "#141414",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );

  return (
    <html lang="zh" className={inter.className}>
      <body style={{ margin: 0, padding: 0 }}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#1668dc', // 主题色：蓝色
                colorInfo: '#1668dc', // 信息色
                colorSuccess: '#52c41a', // 成功色
                colorWarning: '#faad14', // 警告色
                colorError: '#ff4d4f', // 错误色
                colorBgContainer: '#1f1f1f', // 容器背景色
                colorBgElevated: '#1f1f1f', // 浮层背景色
                colorBgLayout: '#141414', // 布局背景色
                colorBorder: '#303030', // 边框颜色
                colorText: '#ffffff', // 文字颜色
                colorTextSecondary: '#999999', // 次要文字颜色
                borderRadius: 8,
              },
            }}
            wave={{ disabled: true }}
          >
            <AntdRegistry>
              <App>
                <LayoutContent>{children}</LayoutContent>
              </App>
            </AntdRegistry>
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
