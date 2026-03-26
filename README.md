# LinChat 🚀

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

LinChat is a high-performance, premium AI chat interface built with **Nuxt 4**. It provides a sleek, responsive, and feature-rich environment for interacting with various AI models through an OpenAI-compatible API proxy.

[中文说明](#linchat-中文) | [English](#linchat-)

---

## ✨ Features

- 🌈 **Multi-Model Support**: Effortlessly switch between different LLMs with category management.
- 🌊 **Real-time Streaming**: Smooth, responsive token streaming with support for reasoning/thinking process display.
- 📎 **Rich Attachments**: 
  - **Images**: Automatic WebP compression and resizing for optimal performance.
  - **PDFs**: Full document parsing with Mistral OCR support.
- 🛠️ **Tool Integration**: Visual feedback for tool calls and results.
- 📝 **Markdown Mastery**: Full support for Markdown, Syntax Highlighting, and LaTeX (KaTeX) mathematical formulas.
- 🕵️ **Incognito Mode**: Chat without saving history to local storage.
- 💾 **Local Persistence**: Conversations are saved locally using `localforage` (IndexedDB), ensuring your data stays in your browser.
- 🎨 **Premium UI**: Modern design with glassmorphism, dark mode support, and smooth animations.

## 🚀 Tech Stack

- **Framework**: Nuxt 4 (Vue 3)
- **Styling**: Vanilla CSS with modern CSS variables
- **API Client**: OpenAI SDK (compatible with OpenRouter, DeepSeek, etc.)
- **Storage**: `localforage` (IndexedDB)
- **Rendering**: `markdown-it`, `highlight.js`, `katex`

## 🛠️ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/linchat.git
cd linchat

# Install dependencies
npm install
```

### 2. Configuration

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
NUXT_OPENAI_API_KEY=your_api_key_here
NUXT_OPENAI_API_BASE=https://api.openai.com/v1 # Optional: defaults to proprietary proxy
```

### 3. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to start chatting!

## 📦 Build & Deployment

```bash
# Production Build
npm run build

# Preview Production Build
npm run preview

# Generate Static Site (SSG)
npm run generate
```

To deploy the production build:
```bash
node .output/server/index.mjs
```

## 📁 Project Structure

```text
├── app/                # Nuxt application source
│   ├── components/     # Vue components
│   ├── composables/    # Business logic & state management
│   ├── pages/          # Application routes
│   └── assets/         # Global styles and assets
├── server/             # Nitro server engine
│   └── api/            # API proxy routes (/api/ai, /api/models)
├── config/             # Model configurations (models.json)
├── public/             # Static assets
└── nuxt.config.ts      # Nuxt configuration
```

---

## LinChat (中文)

LinChat 是一个基于 **Nuxt 4** 构建的高性能 AI 聊天前端。它提供了一个流畅、美观且功能丰富的界面，支持通过 OpenAI 兼容接口连接各种 AI 模型。

### ✨ 功能特性

- 🌈 **多模型路由**：内置分类管理，支持在设置面板中实时编辑并持久化配置。
- 🌊 **深度思考流**：完整支持推理（Reasoning）过程展示，流式响应极其流畅。
- 📎 **附件增强**：
  - **图片**：自动压缩至 WebP 格式，在保证清晰度的同时减少带宽消耗。
  - **PDF**：支持通过 `file-parser` 插件进行 OCR 识别与内容解析。
- 🕵️ **无痕模式**：开启后对话数据不落库，保护隐私。
- 💾 **本地存储**：基于 `localforage` 实现的对话持久化，消息在发送瞬间即自动保存。
- 🎨 **现代设计**：精美的磨砂玻璃质感，适配深色模式，极致的微交互体验。

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## Docker Compose Deployment

If you want to deploy LinChat directly with the published Docker image, use `docker compose`.

### 1. Prerequisites

Install these first:

- Docker
- Docker Compose plugin

Check them with:

```bash
docker --version
docker compose version
```

### 2. Get the project files

Clone the repository:

```bash
git clone https://github.com/YforC/LinChat.git
cd LinChat
```

### 3. Create the environment file

Copy the example file:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your real OpenAI-compatible API configuration:

```env
NUXT_OPENAI_API_BASE=https://your-openai-compatible-endpoint.example.com/v1
NUXT_OPENAI_API_KEY=your_api_key_here
```

Notes:

- `NUXT_OPENAI_API_BASE` should be the full OpenAI-compatible base URL, usually ending with `/v1`
- `NUXT_OPENAI_API_KEY` is required
- Never commit your real `.env` file

### 4. Docker Compose file

The deployment compose file is:

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

### 5. Start the service

```bash
docker compose up -d
```

Open:

```text
http://localhost:3000
```

If you are deploying on a server, replace `localhost` with the server IP or domain.

### 6. Check status and logs

```bash
docker compose ps
docker compose logs -f
```

Stop the service:

```bash
docker compose down
```

### 7. Update to the latest image

Because the compose file uses `pull_policy: always`, the service will prefer the newest image when recreating the container.

Manual update commands:

```bash
docker compose pull
docker compose up -d
```

### 8. Common operations

Restart:

```bash
docker compose restart
```

Recreate:

```bash
docker compose down
docker compose up -d
```

Remove unused images:

```bash
docker image prune -f
```

### 9. Troubleshooting

If the page opens but chat requests fail:

- Check whether `.env` contains the correct API base URL
- Check whether the API key is valid
- Confirm your upstream service supports OpenAI-compatible requests
- Inspect logs with `docker compose logs -f`

If port `3000` is occupied:

```yaml
ports:
  - '8080:3000'
```

Then visit:

```text
http://localhost:8080
```

### 10. Production suggestions

- Put LinChat behind Nginx or Caddy
- Enable HTTPS
- Restrict access if the deployment is private
- Back up your `.env` securely

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
- 不要把真实 `.env` 提交到 Git 仓库

### 4. 启动服务

在项目根目录执行：

```bash
docker compose up -d
```

启动成功后访问：

```text
http://localhost:3000
```

如果是服务器部署，就把 `localhost` 换成服务器 IP 或域名。

### 5. 查看运行状态

查看容器：

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

### 6. 更新镜像

当前 compose 使用的是：

```yaml
image: bilon/linchat:latest
pull_policy: always
```

手动更新命令：

```bash
docker compose pull
docker compose up -d
```

### 7. 常见问题

如果页面能打开，但聊天失败：

- 检查 `.env` 里的接口地址是否正确
- 检查 API key 是否有效
- 检查上游是否兼容 OpenAI SDK 请求格式
- 用 `docker compose logs -f` 看错误日志

如果 `3000` 端口被占用，可以改成：

```yaml
ports:
  - '8080:3000'
```

然后访问：

```text
http://localhost:8080
```

### 8. 生产环境建议

- 建议放到 Nginx / Caddy 后面
- 建议启用 HTTPS
- 私有部署建议加访问控制
- 妥善保管 `.env`

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
