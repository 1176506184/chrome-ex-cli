# 🚀 chrome-ex-cli

**chrome-ex-cli** 是一个专为现代 Chrome 扩展开发设计的命令行工具。它集成了 **Vue 3** 技术栈、**接口热拦截**、**自动化打包**
等核心功能，让你像开发普通网页一样快速构建强大的浏览器插件。

---

## ✨ 核心特性

* 📦 **开箱即用**：一键生成标准化的 Chrome Extension 项目结构，无需繁琐配置。
* 🎨 **Vue 3 支持**：内置 Vue 3 + Vite 配置，支持热更新开发 Popup 和 Options 页面。
* 🕵️ **接口拦截系统**：独家内置 `proxy.js` 逻辑，支持实时监听和拦截网页 Fetch/XHR 请求。
* 🤐 **自动化打包**：内置压缩脚本，一键生成 `release/xxx.zip`，告别手动打包流程。
* ⚡ **极速编译**：基于 Vite 构建，享受秒级的热重载（HMR）开发体验。

---

## 🛠️ 初始化与开发流程

### 1. 安装工具

首先，通过 npm 全局安装 CLI 工具：

```bash
git clone [https://github.com/1176506184/chrome-ex-cli](https://github.com/1176506184/chrome-ex-cli)
npm install chrome-ex-cli -g

```

### 2. 初始化项目

在你想存放项目的文件夹下运行以下命令：

```bash
chrome-ex create my-extension

```

按照提示完成创建后，进入目录并安装依赖：

```bash
cd my-extension
npm install

```

### 3. 开发调试 (运行)

启动本地开发服务器，工具会持续监听文件变化：

```bash
npm run dev

```

### 4. 加载到浏览器

1. 打开 Chrome 浏览器，访问：`chrome://extensions/`
2. 在右上角开启 **“开发者模式”**。
3. 点击左上角 **“加载已解压的扩展程序”**。
4. 选择你项目文件夹中的 **`dist`** 目录。
5. 现在，你的扩展已经运行！修改代码后，插件会自动重载。

---

## 🛠 安装与克隆

你可以直接克隆仓库到本地进行开发：

```bash
git clone [https://github.com/1176506184/chrome-ex-cli](https://github.com/1176506184/chrome-ex-cli)
```

---

## 🔍 功能亮点详析

### 🕸️ 深度接口拦截 (基于 ajax-hook)

本工具底层集成了 **ajax-hook** 库，通过对全局 `XMLHttpRequest` 和 `fetch` 的劫持，实现在 `scripts/proxy.js` 中对数据的掌控：

* **全量监控**：实时捕获网页发出的所有网络请求及返回的 Response 数据。
* **动态 Mock**：在不修改后端代码的情况下，直接修改请求参数或替换返回结果。
* **持久化配置**：支持结合 `chrome.storage.local` 动态开启或关闭拦截逻辑。

### 🌈 极致开发体验 (Vue 3 + Tailwind CSS)

* **Vue 3 (Composition API)**：使用响应式开发模式构建复杂的 Popup 和 Sidepanel 交互。
* **Tailwind CSS**：项目已预设 twcss 环境，支持通过类名快速布局。例如：
```html
<div class="p-4 bg-blue-500 text-white rounded-lg shadow-lg">
  Hello Chrome Extension!
</div>

```



---

## 📄 License

本项目基于 [MIT](https://www.google.com/search?q=LICENSE) 协议开源。

---

**如果这个工具对你有帮助，请给一个 Star ⭐️ 鼓励作者持续更新！**

---