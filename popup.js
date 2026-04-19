const btnVi = document.getElementById('btn-vi');
const btnEn = document.getElementById('btn-en');

function updateUI(enabled) {
    if (enabled) {
        btnVi.classList.add('active');
        btnEn.classList.remove('active');
    } else {
        btnEn.classList.add('active');
        btnVi.classList.remove('active');
    }
}

// Load current state when opening the popup
chrome.storage.local.get(['avimEnabled'], (result) => {
    const enabled = result.avimEnabled !== false;
    updateUI(enabled);
});

// Click Listeners
btnVi.addEventListener('click', () => {
    chrome.storage.local.set({ avimEnabled: true });
    updateUI(true);
});

btnEn.addEventListener('click', () => {
    chrome.storage.local.set({ avimEnabled: false });
    updateUI(false);
});
