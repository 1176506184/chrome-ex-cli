import {createRouter, createWebHashHistory} from 'vue-router';
import Home from "../views/Home.vue";

// 1. 定义路由组件（也可以从其他文件导入）
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
];

// 2. 创建路由实例
const router = createRouter({
    history: createWebHashHistory(), // 必须使用 Hash 模式
    routes
});

export default router;