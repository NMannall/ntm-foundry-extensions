import {NTMFoundryExtensions} from "./module.js";
import {Log} from "./log.js";
import {SETTINGS} from "./settings.js";

export function registerHooks() {
    Hooks.on('preUpdateToken', async function(tokenDocument, diff, options, userId) {

        // Check if we should skip the hook
        if (!game.settings.get(NTMFoundryExtensions.MODULE_ID, SETTINGS.SKIP_MOVE_ANIMATION) || (!diff.x && !diff.y)) {
            Log.log('Skipping preUpdateToken hook');
            return
        }

        // Use the 'alt' modifier key for now as conflicts least with other functionality
        // TODO: Let users select a key to use and add a toggle button to the UI
        if (game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.ALT)) {
            options.animation = {}
            options.animation.duration = -1
        }
    });
}
