const REFRESH_SECONDS = 10;
const DEFER_SECONDS = 0.25;
const NOT_FOUND_PREFIX = 'No';
const AMAZON_FRESH = 'Amazon Fresh';
const WHOLE_FOODS = 'Whole Foods';
const COSTCO_SAMEDAY = 'Costco Sameday';
const INSTACART = 'Instacart';
const AMAZON_URL = 'https://www.amazon.com/gp/buy/shipoptionselect/handlers/display.html?hasWorkingJavascript=1';
const COSTCO_URL = 'https://sameday.costco.com/store/checkout_v3';
const INSTACART_URL = 'https://www.instacart.com/store/checkout_v3';
const SUBMIT_SELECTOR = 'input[type=submit]';

const NOT_FOUND = {
    store: '',
    time: '',
    nodes: [],
};

const getTimeAndNodes_Instacart = () => {
    const node = document.querySelector('button[aria-label="Change Delivery time"]');
    if (!node || !node.nextElementSibling) {
        return NOT_FOUND;
    }

    return {
        store: COSTCO_URL === location.href ? COSTCO_SAMEDAY : INSTACART,
        time: node.nextElementSibling.innerText.trim(),
        nodes: [node.nextElementSibling.querySelector('input[name=delivery_option]')].filter(i => i),
    };
};

const getTimeAndNodes_AmazonFresh = () => {
    const node = document.querySelector('div.Date-slot-container[style="display: block;"]');
    if (!node) {
        return NOT_FOUND;
    }

    return {
        store: AMAZON_FRESH,
        time: node.innerText.trim().substr(13).trim(),
        nodes: [document.querySelector(SUBMIT_SELECTOR)].filter(i => i),
    };
};

const getTimeAndNodes_WholeFoods = () => {
    const node = document.querySelector('div.ufss-slotselect-container');
    if (!node) {
        return NOT_FOUND;
    }

    return {
        store: WHOLE_FOODS,
        time: node.innerText.trim(),
        nodes: [
            node.querySelector('div.ufss-slot.ufss-available'),
            document.querySelector(SUBMIT_SELECTOR),
        ].filter(i => i),
    };
};

const getTimeAndNodes = url => {
    switch (url) {
        case COSTCO_URL:
        case INSTACART_URL:
            return getTimeAndNodes_Instacart();
        case AMAZON_URL:
            let data = getTimeAndNodes_WholeFoods();
            if (data.store === NOT_FOUND.store) {
                data = getTimeAndNodes_AmazonFresh();
            }
            return data;
        default:
            return NOT_FOUND;
    }
};

const check = retry => {
    const defer = DEFER_SECONDS * 1000;
    const { store, time, nodes } = getTimeAndNodes(location.href);

    if (time.startsWith(NOT_FOUND_PREFIX)) {
        setTimeout(() => location.reload(), defer * retry);
        return;
    }

    if (time && nodes) {
        chrome.runtime.sendMessage({ time, store });
        nodes.map((n, i) => setTimeout(() => n.click(), defer * (i + 1)));
        return;
    }

    if (retry > 0) {
        setTimeout(check, defer, retry - 1);
    } else {
        const error = `${location.href}: page may be slow or has been changed.`;
        console.error(error);
        chrome.runtime.sendMessage({
            time: error,
            store: 'Error',
        });
        location.reload();
    }
};

const retryCount = REFRESH_SECONDS / DEFER_SECONDS;
check(retryCount);