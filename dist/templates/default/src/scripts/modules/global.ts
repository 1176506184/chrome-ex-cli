function dealNum(num: any) {

    let result = num

    if (num === "" || num == null) {
        return 0;
    } else {

        result = num.replace(/[^\d.]/ig, "");

        if (num.toString().includes('万')) {
            result = result * 10000;
        }

        if (num.toString().includes('K')) {
            result = result * 1000;
        }

        return parseInt(result);
    }
}

async function wait(s: number) {
    return new Promise(r => {
        setTimeout(() => {
            r(true)
        }, s * 1000)
    })
}

async function scrollBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight)
}


type ScrollTarget = HTMLElement | Window;

class AutoScroller {
    private timer: ReturnType<typeof setInterval> | null = null;
    public speed: number;
    public time: number;
    public target: ScrollTarget;

    constructor(speed: number = 2, time: number = 20, target: ScrollTarget = window) {
        this.speed = speed;
        this.time = time;
        this.target = target;
    }

    /**
     * 开始滚动
     */
    start() {
        this.stop();

        // 检查目标是否存在
        if (!this.target) {
            console.error('❌ 滚动目标不存在');
            return;
        }

        this.timer = setInterval(() => {
            // 根据目标类型执行不同的滚动方法
            if (this.target === window) {
                window.scrollBy({
                    top: this.speed,
                    left: 0,
                    behavior: 'auto'
                });
            } else {
                // 如果是 HTMLElement (如 div)
                (this.target as HTMLElement).scrollTop += this.speed;
            }
        }, this.time);

        console.log(`🚀 启动滚动: 目标=${this.target === window ? 'window' : 'element'}, 速度=${this.speed}`);
    }

    /**
     * 停止滚动
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('🛑 滚动已停止');
        }
    }

    /**
     * 动态更新参数
     * @param newSpeed 速度
     * @param newTime 频率
     * @param newTarget 可选：更换滚动节点
     */
    update(newSpeed?: number, newTime?: number, newTarget?: ScrollTarget) {
        if (newSpeed !== undefined) this.speed = newSpeed;
        if (newTime !== undefined) this.time = newTime;

        if (newTarget !== undefined) {
            const isRunning = !!this.timer;
            this.stop();
            this.target = newTarget;
            if (isRunning) this.start(); // 如果之前在运行，更换节点后自动恢复
            return;
        }

        // 如果只是改了速度或频率，且正在运行，则重启定时器
        if (this.timer) {
            this.start();
        }
    }
}

export {dealNum, wait, scrollBottom, AutoScroller}