# 使用 Node.js 的官方 LTS 镜像作为基础镜像
FROM node:lts-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 构建项目
RUN npm run build

# 暴露 Next.js 应用程序运行的端口
EXPOSE 3000

# 启动应用
CMD  npm run start
