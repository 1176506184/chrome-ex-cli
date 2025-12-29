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

## 📦 生产构建与打包

当你准备发布插件到 Chrome 商店时，可以使用以下命令：

| 命令              | 描述                                          |
|-----------------|---------------------------------------------|
| `npm run build` | 构建生产环境代码，进行混淆和压缩优化。 自动将 `dist` 目录压缩并保存在根目录。 |
| `npm run dev`   | 开发模式热重载                                     |

---

## 📂 项目目录结构

```text
my-extension/
├── dist/               # 编译输出目录（加载至浏览器的最终代码）
├── release/            # 存放 npm run zip 生成的压缩包
├── src/
│   ├── popup/          # 插件弹窗界面 (Vue 3 源码)
│   ├── options/        # 插件配置页面 (Vue 3 源码)
│   ├── background/     # Service Worker 后台脚本
│   └── content/        # Content Scripts 内容脚本
├── scripts/            # 核心拦截脚本 (proxy.js 存放处)
├── templates/          # 基础 Manifest 与 HTML 模板
└── package.json

```

---

## 🔍 功能亮点：接口拦截 (Proxy Mode)

本工具默认集成了强大的接口监听逻辑。通过修改生成的项目中的 `scripts/proxy.js`，你可以：

* **实时监控**：在浏览器控制台直接打印网页的所有接口请求和返回结果。
* **动态 Mock**：根据需求拦截特定请求并修改返回数据，无需修改后端代码。
* **灵活控制**：通过插件内的 `chrome.storage.local` 动态开启或关闭拦截逻辑。

---

## 🤝 贡献与反馈

如果你在使用中遇到问题（如依赖安装失败或
Bug），欢迎提交 [Issue](https://www.google.com/search?q=https://github.com/1176506184/chrome-ex-cli/issues)。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 发起一个 Pull Request

---

## 📄 License

本项目基于 [MIT](https://www.google.com/search?q=LICENSE) 协议开源。

---

**如果这个工具对你有帮助，请给一个 Star ⭐️ 鼓励作者持续更新！**

---