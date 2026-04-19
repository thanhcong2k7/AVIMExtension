const mainToggle = document.getElementById('main-toggle');
const methodRadios = document.getElementsByName('method');
const spellToggle = document.getElementById('spell-toggle');
const accentToggle = document.getElementById('accent-toggle');
const settingsContent = document.getElementById('settings-content');

// Default configurations
const defaultSettings = {
    enabled: true,
    method: 0,       // 0: Auto
    ckSpell: true,   // 1: On
    oldAccent: true  // 1: On (Script's default)
};

// 1. Load data and set UI
chrome.storage.local.get(defaultSettings, (settings) => {
    // Set Main Toggle
    mainToggle.checked = settings.enabled;
    updateContentOpacity(settings.enabled);

    // Set Radios
    for (let radio of methodRadios) {
        if (parseInt(radio.value) === settings.method) {
            radio.checked = true;
            break;
        }
    }

    // Set Option Switches
    spellToggle.checked = settings.ckSpell;
    accentToggle.checked = settings.oldAccent;
});

// 2. Listeners to save data instantly
mainToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.local.set({ enabled: isEnabled });
    updateContentOpacity(isEnabled);
});

methodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.checked) {
            chrome.storage.local.set({ method: parseInt(e.target.value) });
        }
    });
});

spellToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ ckSpell: e.target.checked });
});

accentToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ oldAccent: e.target.checked });
});

// Helper: Gray out the bottom menu if the extension is turned off
function updateContentOpacity(isEnabled) {
    if (isEnabled) {
        settingsContent.classList.remove('disabled');
    } else {
        settingsContent.classList.add('disabled');
    }
}
