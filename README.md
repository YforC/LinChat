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

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
