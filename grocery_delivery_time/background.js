chrome.runtime.onMessage.addListener(msg => {
    chrome.notifications.create({
        type: "basic",
        title: `${msg.store} Delivery Time`,
        iconUrl: "icon.svg",
        message: msg.time,
    });
});