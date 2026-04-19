// Disable AVIM's built-in cookie persistence so we can manage it via chrome.storage
if (typeof AVIMGlobalConfig !== 'undefined') {
    AVIMGlobalConfig.useCookie = 0; 
}

// Helper to apply the state to the AVIM object
function applyState(enabled) {
    if (typeof AVIMObj === 'undefined') return;
    
    if (enabled) {
        AVIMObj.setMethod(0); // 0 = AUTO (Vietnamese ON)
    } else {
        AVIMObj.setMethod(-1); // -1 = OFF (English)
    }
}

// 1. Initialize state on page load
chrome.storage.local.get(['avimEnabled'], (result) => {
    // Default to true (Vietnamese) if it hasn't been set yet
    const enabled = result.avimEnabled !== false; 
    applyState(enabled);
});

// 2. Listen for changes (e.g., from the popup menu or other tabs)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.avimEnabled) {
        applyState(changes.avimEnabled.newValue);
    }
});

// 3. Unikey-style Ctrl+Shift shortcut logic
let ctrlShiftPressed = false;
let otherKeyPressed = false;

window.addEventListener('keydown', (e) => {
    // Check if Ctrl and Shift are held down
    if (e.key === 'Control' || e.key === 'Shift') {
        if (e.ctrlKey && e.shiftKey) {
            ctrlShiftPressed = true;
        }
    } else {
        // If any other key is pressed (e.g. 'C' for Ctrl+Shift+C), cancel the toggle
        otherKeyPressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    // When releasing either Ctrl or Shift
    if (e.key === 'Control' || e.key === 'Shift') {
        // Only toggle if exactly Ctrl+Shift were pressed together and NO other keys
        if (ctrlShiftPressed && !otherKeyPressed) {
            chrome.storage.local.get(['avimEnabled'], (result) => {
                const currentState = result.avimEnabled !== false;
                const newState = !currentState;
                
                // Save new state (this triggers the onChanged listener automatically)
                chrome.storage.local.set({ avimEnabled: newState });
                
                // Show floating indicator (Unikey style "E" or "V")
                showIndicator(newState);
            });
        }
        ctrlShiftPressed = false;
    }
    
    // Reset the "other key" blocker when both modifiers are released
    if (!e.ctrlKey && !e.shiftKey) {
        otherKeyPressed = false;
    }
});

// Optional: A tiny visual notification on the screen bottom right ("V" or "E")
function showIndicator(isVietnamese) {
    let indicator = document.getElementById('avim-lang-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'avim-lang-indicator';
        Object.assign(indicator.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 18px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            fontFamily: 'sans-serif',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '5px',
            zIndex: '2147483647', // Max z-index
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease-in-out'
        });
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = isVietnamese ? 'V' : 'E';
    indicator.style.opacity = '1';
    
    clearTimeout(indicator.hideTimeout);
    indicator.hideTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
    }, 800); // Fades out after 0.8 seconds
}
