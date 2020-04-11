const REFRESH_SECONDS = 10;

const getTimeNode = () => {
    let retry = true;
    let node = document.querySelector('button[aria-label="Change Delivery time"]');
    if (node) {
        node = node.nextElementSibling;
        retry = !node || node.innerText.trim() === '';
    }
    return { node, retry };
};

const check = () => {
    const { node, retry } = getTimeNode();
    if (retry) {
        setTimeout(check, 100);
        return;
    }

    slot = node.querySelector('input[name=delivery_option]');
    if (slot) {
        chrome.runtime.sendMessage(node.innerText);
        slot.click();
    } else {
        setTimeout(() => location.reload(), REFRESH_SECONDS * 1000);
    }
}

check();