import {defineConfig} from 'vite';
import {resolve} from 'path';
import {copyManifest, getScriptEntries, htmlPathFixer, zipBundle} from "./utils";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    base: './',
    css: {
        postcss: resolve(__dirname, 'postcss.config.ts'), // 强制指向根目录的文件
    },
    plugins: [vue(), copyManifest(), htmlPathFixer(), zipBundle()],
    publicDir: resolve(__dirname, 'public'),
    build: {
        emptyOutDir: true,
        outDir: resolve(__dirname, 'dist'),
        // 1. 禁用 CSS 代码分割，有时在插件中更易管理
        cssCodeSplit: false,
        rollupOptions: {
            // 2. 配置多入口
            input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
                vMin: resolve(__dirname, 'src/vue/main.ts'),
                ...getScriptEntries()
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                manualChunks: undefined
            },
        }
    },
});