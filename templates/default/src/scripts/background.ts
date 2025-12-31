import {SUCCESS} from "../eums";

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'loadScript') {
        await chrome.scripting.executeScript({
            //@ts-ignore
            target: {tabId: sender.tab.id},
            files: ['scripts/modules/' + Message.script],
            injectImmediately: true,
        });
        sendResponse(SUCCESS);
    }
})