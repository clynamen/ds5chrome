console.log("YEYE BITCHES")


const apply_dpad_transformation_ds5_other_cases = (initialGamepads, dualsenseIndex) => {
    const PRESSED_BUTTON = {pressed: true, touched: true, value: 1}
    const UNPRESSED_BUTTON = {pressed: false, touched: false, value: 0}
    currentAxis = 9
    // DPad is Mapped to an Axis... this converts the axis into the DPad Values
    if (initialGamepads[dualsenseIndex].axes[currentAxis] == 1.2857143878936768) {
        // Reset all DPad Values
        emulatedDualSense.buttons[12] = UNPRESSED_BUTTON;
        emulatedDualSense.buttons[13] = UNPRESSED_BUTTON;
        emulatedDualSense.buttons[14] = UNPRESSED_BUTTON;
        emulatedDualSense.buttons[15] = UNPRESSED_BUTTON;
    } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == 0.14285719394683838) {
        if (PRESSED_BUTTON) {
            emulatedDualSense.buttons[13] = PRESSED_BUTTON;
            emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
        }
    } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == -0.4285714030265808) {
        if (PRESSED_BUTTON) {
            emulatedDualSense.buttons[15] = PRESSED_BUTTON;
            emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
        }
    } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == 0.7142857313156128) {
        if (PRESSED_BUTTON) {
            emulatedDualSense.buttons[14] = PRESSED_BUTTON;
            emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
        }
    } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == -1) {
        if (PRESSED_BUTTON) {
            emulatedDualSense.buttons[12] = PRESSED_BUTTON;
            emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
        }
    }
}

const setupDualSenseController = () => {
    const PRESSED_BUTTON = {pressed: true, touched: true, value: 1}
    const UNPRESSED_BUTTON = {pressed: false, touched: false, value: 0}
    const buttonCount = 17;
    const axis = 10;

    const emulatedDualSense = {
        id: "DualSense 5 Controller",
        index: 0,
        connected: true,
        timestamp: 0,
        mapping: "standard",
        axes: [0, 0, 0, 0],
        buttons: new Array(buttonCount).fill().map(m => ({pressed: false, touched: false, value: 0}))
    }
    let ds5_on_linux_via_usb = false;
    let ds5_other_cases = false;

    const initialGetGamepads = navigator.getGamepads;
    navigator.getGamepads = function() {
        const initialGamepads = initialGetGamepads.apply(navigator);
        let dualsenseIndex = 5;
        for (let index = 0; index < 4; index++) {
            if (initialGamepads[index] !== null ) {
                ds5_on_linux_via_usb = initialGamepads[index].id == "Sony Interactive Entertainment Wireless Controller (Vendor: 054c Product: 0ce6)"
                ds5_other_cases = ( (initialGamepads[index].id == "Wireless Controller (Vendor: 054c Product: 0ce6)") 
                        || (initialGamepads[index].id == "DUALSHOCK 4 Wireless Controller (Vendor: 054c Product: 0ce6)") )
            }

            if ( ds5_on_linux_via_usb || ds5_other_cases ) {
                dualsenseIndex = index;
                emulatedDualSense.index = dualsenseIndex;
                break;
            }
        }

        if (dualsenseIndex == 5) {
            return initialGamepads;
        }
        for(let button = 0; button < buttonCount; button++){
            if (initialGamepads[dualsenseIndex] && initialGamepads[dualsenseIndex].buttons[button]) {
                // Buttons 0,1,2 are all messed up so here's how we re-map them correctly
                if (button == 0) {
                    emulatedDualSense.buttons[2] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                } else if (button == 1) {
                    emulatedDualSense.buttons[0] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                } else if (button == 2) {
                    emulatedDualSense.buttons[1] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                } else {
                    emulatedDualSense.buttons[button] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                }
            }

        }

        for(let currentAxis = 0; currentAxis < axis; currentAxis++){
            if (initialGamepads[dualsenseIndex] && initialGamepads[dualsenseIndex].axes[currentAxis]) {
                if (currentAxis < 2) {
                    emulatedDualSense.axes[currentAxis] = Math.min(Math.max((initialGamepads[dualsenseIndex].axes[currentAxis] * 1), -1), 1);
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                }
                if (currentAxis == 9 && ds5_other_cases) {
                    apply_dpad_transformation_ds5_other_cases(initialGamepads, dualsenseIndex);
                } else if (currentAxis == 5) {
                    emulatedDualSense.axes[3] = Math.min(Math.max((initialGamepads[dualsenseIndex].axes[currentAxis] * 1), -1), 1);
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                }
            }
        }

        if (ds5_on_linux_via_usb) {
            emulatedDualSense.buttons[12] = (initialGamepads[dualsenseIndex].axes[7] < 0) ? PRESSED_BUTTON : UNPRESSED_BUTTON;
            emulatedDualSense.buttons[13] = (initialGamepads[dualsenseIndex].axes[7] > 0) ? PRESSED_BUTTON : UNPRESSED_BUTTON;
            emulatedDualSense.buttons[14] = (initialGamepads[dualsenseIndex].axes[6] < 0) ? PRESSED_BUTTON : UNPRESSED_BUTTON;
            emulatedDualSense.buttons[15] = (initialGamepads[dualsenseIndex].axes[6] > 0) ? PRESSED_BUTTON : UNPRESSED_BUTTON;

            emulatedDualSense.buttons[16] = (initialGamepads[dualsenseIndex].buttons[12].pressed) ? PRESSED_BUTTON : UNPRESSED_BUTTON;
            emulatedDualSense.buttons[17] = (initialGamepads[dualsenseIndex].buttons[13].pressed) ? PRESSED_BUTTON : UNPRESSED_BUTTON;
            emulatedDualSense.buttons[18] = (initialGamepads[dualsenseIndex].buttons[14].pressed) ? PRESSED_BUTTON : UNPRESSED_BUTTON;

            emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
        }

        // Only Apply Emulated Controller on DS5 Controllers
        let newGamepads = []
        for (let index = 0; index < 4; index++) {
            if (index == dualsenseIndex) {
                newGamepads[dualsenseIndex] = emulatedDualSense
            } else {
                newGamepads[index] = initialGamepads[index];
            }
        }
        return newGamepads;
    }
}

const injectSetupScript = () => {
    const injScript = document.createElement("script");
    injScript.appendChild(document.createTextNode("(" + setupDualSenseController + ")();"));
    (document.body || document.head || document.documentElement).appendChild(injScript);
}

injectSetupScript();
