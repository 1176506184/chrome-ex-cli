async function injectedScript(path: string) {
    const scriptNode = document.createElement('script');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.async = true;
    scriptNode.crossOrigin = 'anonymous'
    scriptNode.setAttribute('data-eden-async-asset', 'true')
    scriptNode.setAttribute('src', chrome.runtime.getURL(path));
    document.documentElement.appendChild(scriptNode);
    return scriptNode;
}


chrome.storage.local.get('open', (res) => {
    injectedScript('scripts/proxy.js').then(r => {
        console.log('接口监听已开启')
    })
})


chrome.runtime.sendMessage({
    Message: "loadScript",
    script: 'test.js'
}).then(() => {
    console.log("注入完成")
})