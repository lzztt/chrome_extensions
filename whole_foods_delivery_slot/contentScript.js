const SLOT_SELECTOR = 'div.ufss-slot.ufss-available';
const SUBMIT_SELECTOR = 'input[type=submit]';
const REFRESH_SECONDS = 10;

const slot = document.querySelector(SLOT_SELECTOR);
if (slot) {
    chrome.runtime.sendMessage(slot.innerText);
    setTimeout(() => {
        slot.click();
        document.querySelector(SUBMIT_SELECTOR).click();
    }, 1000);
} else {
    setTimeout(() => { location.reload(); }, REFRESH_SECONDS * 1000);
}