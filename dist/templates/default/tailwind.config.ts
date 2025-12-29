// tailwind.config.ts
import type {Config} from 'tailwindcss'

export default {
    content: [
        "./src/popup/index.html",             // 如果根目录有 html
        "./src/**/*.{vue,js,ts,jsx,tsx}", // 递归匹配 src 下所有文件夹（包括 src/vue）里的 vue 和 ts 文件
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config