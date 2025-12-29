import {proxy} from "ajax-hook";

proxy({
    // 监听请求发起
    onRequest: (config, handler) => {
        handler.next(config); // 继续执行，不拦截
    },
    // 监听响应返回
    onResponse: (response, handler) => {
        window.postMessage({
            type: "AJAX_MONITOR",
            direction: "response",
            url: response.config.url,
            data: response.response // 注意：这里可能是字符串，必要时需 JSON.parse
        }, "*");
        handler.next(response); // 继续执行，不拦截
    }
});