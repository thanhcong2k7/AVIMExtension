# AVIM Vietnamese Input Extension

A lightweight, Manifest V3 compatible browser extension that integrates the classic **AVIM (A Vietnamese Input Method)** script directly into your web browser. This extension allows you to type Vietnamese natively on almost any webpage without needing external OS-level software like Unikey or EVKey.

## Features

- **Multiple Input Methods**: Supports TELEX, VNI, VIQR, and VIQR* natively.
- **Auto-Detection**: By default, the script intelligently supports typing in multiple formats (TELEX and VNI) simultaneously.
- **Universal Support**: Works seamlessly on standard text inputs (`<input>`), text areas (`<textarea>`), and rich-text/WYSIWYG editors (iframes and `contenteditable` elements).
- **Smart Spell Checking**: Prevents invalid Vietnamese word formations.
- **Accent Styles**: Supports both the new accent style (e.g., *hòa*, *thủy*) and the old accent style (e.g., *hoà*, *thuỷ*).
- **Privacy-Friendly**: Runs entirely locally in your browser as a content script.

## Installation

Since this is a custom extension, you can install it manually by loading it as an unpacked extension in Chrome, Edge, Brave, or any Chromium-based browser.

1. Download or clone the files to a folder on your computer (ensure both `manifest.json` and `avim.js` are in the same folder).
2. Open your browser and navigate to the Extensions page:
   - Chrome/Brave: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Turn on **Developer mode** (usually a toggle in the top right corner).
4. Click on the **Load unpacked** button.
5. Select the folder containing your extension files. 
6. The extension is now active and will work on all newly loaded web pages!

## Usage

Simply click on any text box on any webpage and start typing. 
- The default method is **Auto**, which will recognize both TELEX and VNI keystrokes.
- **F12 Shortcut**: Pressing `F12` triggers the internal AVIM Control toggle (Note: The visual control panel is hidden by default in the script configuration but the shortcut remains bound).

### Advanced Configuration
If you wish to change default behaviors (like default input method, disabling spell check, or forcing a specific input type), you can edit the `AVIMGlobalConfig` object at the top of the `avim.js` file:
```javascript
AVIMGlobalConfig = {
	method: 0,       // Default input method: 0=AUTO, 1=TELEX, 2=VNI, 3=VIQR, 4=VIQR*
	onOff: 1,        // Starting status: 0=Off, 1=On
	ckSpell: 1,      // Spell Check: 0=Off, 1=On
	oldAccent: 1,    // Accent style: 0=New way (hòa), 1=Old way (hoà)
	// ...
};