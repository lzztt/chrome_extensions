const HTML_SELECTOR = 'div.ufss-slotselect-container';
const NOT_AVAILABLE = 'No delivery windows available';
const REFRESH_SECONDS = 10;
const EXPIRE_SECONDS = 120;

const slot = document.querySelector(HTML_SELECTOR).innerText;
console.log(`${new Date().toLocaleTimeString()}: ${slot}`);

found = !slot.startsWith(NOT_AVAILABLE);
if (found) {
    chrome.runtime.sendMessage(slot);
}

setTimeout(() => {
    location.reload();
}, (found ? EXPIRE_SECONDS : REFRESH_SECONDS) * 1000);