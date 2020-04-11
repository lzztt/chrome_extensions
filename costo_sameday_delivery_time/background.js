chrome.runtime.onMessage.addListener(slot => {
    chrome.notifications.create({
        type: "basic",
        title: "Costco Delivery Time Found",
        iconUrl: "icon.svg",
        message: slot,
    });
});