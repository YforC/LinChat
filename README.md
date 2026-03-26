# LinChat

LinChat 是一个基于 Nuxt 4 构建的 AI 聊天应用，支持通过 OpenAI 兼容接口接入不同模型，并提供流式输出、附件上传、文件阅读、图片与视频结果展示、本地会话保存、无痕模式等能力。

## 项目特点

- 支持多模型切换与模型分类管理
- 支持 OpenAI 兼容请求格式
- 支持流式聊天、推理过程展示、工具调用结果展示
- 支持图片上传、文件阅读、图片生成、视频生成
- 支持本地保存历史会话
- 支持移动端适配
- 支持通过 Docker Compose 快速部署

## 技术栈

- 前端框架：Nuxt 4、Vue 3
- 接口调用：OpenAI SDK
- 本地存储：localforage
- Markdown 渲染：markdown-it
- 代码高亮：highlight.js
- 数学公式：katex

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/YforC/LinChat.git
cd LinChat
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例文件：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
NUXT_OPENAI_API_BASE=https://your-openai-compatible-endpoint.example.com/v1
NUXT_OPENAI_API_KEY=your_api_key_here
```

说明：

- `NUXT_OPENAI_API_BASE` 为你的 OpenAI 兼容接口地址，通常以 `/v1` 结尾
- `NUXT_OPENAI_API_KEY` 为接口密钥

### 4. 启动开发环境

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 构建与运行

### 构建生产版本

```bash
npm run build
```

### 本地预览生产版本

```bash
npm run preview
```

### 直接运行构建产物

```bash
node .output/server/index.mjs
```

## Docker Compose 部署教程

如果你想直接通过已经发布好的 Docker 镜像部署 LinChat，可以按下面步骤操作。

### 1. 安装 Docker 环境

确保机器已经安装：

- Docker
- Docker Compose 插件

检查命令：

```bash
docker --version
docker compose version
```

### 2. 获取项目文件

直接克隆仓库：

```bash
git clone https://github.com/YforC/LinChat.git
cd LinChat
```

### 3. 配置 `.env`

先复制示例文件：

```bash
cp .env.example .env
```

然后把 `.env` 改成你自己的接口配置：

```env
NUXT_OPENAI_API_BASE=https://your-openai-compatible-endpoint.example.com/v1
NUXT_OPENAI_API_KEY=your_api_key_here
```

说明：

- `NUXT_OPENAI_API_BASE` 填完整的 OpenAI 兼容接口地址，通常以 `/v1` 结尾
- `NUXT_OPENAI_API_KEY` 必填
- 不要把真实 `.env` 提交到代码仓库

### 4. 当前 Docker Compose 配置

项目当前使用的 `docker-compose.yml` 如下：

```yaml
services:
  linchat:
    image: bilon/linchat:latest
    pull_policy: always
    env_file:
      - .env
    ports:
      - '3000:3000'
    environment:
      NITRO_HOST: 0.0.0.0
      NITRO_PORT: 3000
    restart: unless-stopped
```

说明：

- 镜像直接使用已发布的 `bilon/linchat:latest`
- `pull_policy: always` 表示每次重建容器时优先拉取最新镜像
- `env_file` 会把 `.env` 中的接口配置传进容器

### 5. 启动服务

在项目根目录执行：

```bash
docker compose up -d
```

启动后访问：

```text
http://localhost:3000
```

如果部署在服务器上，请把 `localhost` 改成服务器 IP 或域名。

### 6. 查看运行状态

查看容器状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f
```

停止服务：

```bash
docker compose down
```

### 7. 更新镜像

手动更新命令：

```bash
docker compose pull
docker compose up -d
```

如果你希望彻底重建容器，可以执行：

```bash
docker compose down
docker compose up -d
```

### 8. 常用运维命令

重启服务：

```bash
docker compose restart
```

仅查看最近日志：

```bash
docker compose logs --tail=200
```

清理无用镜像：

```bash
docker image prune -f
```

### 9. 端口占用处理

如果本机 `3000` 端口已被占用，可以修改 `docker-compose.yml`：

```yaml
ports:
  - '8080:3000'
```

然后访问：

```text
http://localhost:8080
```

### 10. 常见问题排查

如果页面能打开，但聊天请求失败：

- 检查 `.env` 中的接口地址是否正确
- 检查接口密钥是否有效
- 检查上游服务是否兼容 OpenAI 请求格式
- 使用 `docker compose logs -f` 查看容器报错

如果容器启动失败：

- 先执行 `docker compose ps`
- 再执行 `docker compose logs -f`
- 检查 `.env` 是否存在且内容完整

### 11. 生产环境建议

- 建议放在 Nginx 或 Caddy 反向代理后面
- 建议启用 HTTPS
- 私有部署建议增加访问控制
- 妥善保管 `.env` 文件

## 项目结构

```text
app/
  components/      页面组件
  composables/     组合式逻辑与状态管理
  pages/           页面路由
  assets/          全局样式与资源
server/
  api/             服务端接口代理
  utils/           服务端工具函数
public/            静态资源
tests/             测试文件
nuxt.config.ts     Nuxt 配置
docker-compose.yml Docker Compose 部署配置
Dockerfile         Docker 镜像构建文件
```

## 许可证

本项目基于 MIT 许可证发布，详见 `LICENSE` 文件。

## 贡献方式

如果你希望参与贡献，可以按下面流程操作：

1. Fork 本仓库
2. 新建功能分支
3. 提交你的修改
4. 推送到你的分支
5. 发起合并请求
