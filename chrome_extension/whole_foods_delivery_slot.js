const HTML_SELECTOR = 'div.ufss-slotselect-container';
const NOT_AVAILABLE = 'No delivery windows available';
const REFRESH_SECONDS = 10;

const slot = document.querySelector(HTML_SELECTOR).innerText;
console.log(`${new Date().toLocaleTimeString()}: ${slot}`);

if (!slot.startsWith(NOT_AVAILABLE)) {
    alert(slot);
} else {
    setTimeout(() => { location.reload(); }, REFRESH_SECONDS * 1000);
}