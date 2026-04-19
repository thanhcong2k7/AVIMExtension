// Disable AVIM's built-in cookie persistence so we can manage it entirely via Chrome Storage
if (typeof AVIMGlobalConfig !== 'undefined') {
    AVIMGlobalConfig.useCookie = 0; 
}

const defaultSettings = {
    enabled: true,
    method: 0,
    ckSpell: true,
    oldAccent: true
};

// Apply settings to the global AVIM object
function applySettings(settings) {
    if (typeof AVIMObj === 'undefined') return;
    
    // Toggle state & Input Method
    if (settings.enabled) {
        AVIMObj.setMethod(settings.method);
    } else {
        AVIMObj.setMethod(-1); // -1 = OFF
    }

    // Check Spell
    AVIMObj.setSpell(settings.ckSpell ? 1 : 0);

    // Old Accents
    AVIMObj.setDauCu(settings.oldAccent ? 1 : 0);
}

// 1. Initialize state on page load
chrome.storage.local.get(defaultSettings, (result) => {
    applySettings(result);
});

// 2. Listen for changes from the popup or other tabs
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        chrome.storage.local.get(defaultSettings, (result) => {
            applySettings(result);
        });
    }
});

// 3. Unikey-style Ctrl+Shift shortcut logic
let ctrlShiftPressed = false;
let otherKeyPressed = false;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Control' || e.key === 'Shift') {
        if (e.ctrlKey && e.shiftKey) {
            ctrlShiftPressed = true;
        }
    } else {
        otherKeyPressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'Control' || e.key === 'Shift') {
        // Trigger toggle if strictly Ctrl+Shift were pressed
        if (ctrlShiftPressed && !otherKeyPressed) {
            chrome.storage.local.get(['enabled'], (result) => {
                const currentState = result.enabled !== false;
                const newState = !currentState;
                
                // Save new state
                chrome.storage.local.set({ enabled: newState });
                
                // Show floating indicator
                showIndicator(newState);
            });
        }
        ctrlShiftPressed = false;
    }
    
    // Reset blocker when modifiers are released
    if (!e.ctrlKey && !e.shiftKey) {
        otherKeyPressed = false;
    }
});

// Visual notification (V or E)
function showIndicator(isVietnamese) {
    let indicator = document.getElementById('avim-lang-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'avim-lang-indicator';
        Object.assign(indicator.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isVietnamese ? '#1976D2' : '#757575',
            color: 'white',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '50%',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: '2147483647',
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease-in-out, background-color 0.2s'
        });
        document.body.appendChild(indicator);
    } else {
        indicator.style.backgroundColor = isVietnamese ? '#1976D2' : '#757575';
    }
    
    indicator.textContent = isVietnamese ? 'V' : 'E';
    indicator.style.opacity = '1';
    
    clearTimeout(indicator.hideTimeout);
    indicator.hideTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
    }, 800);
}
