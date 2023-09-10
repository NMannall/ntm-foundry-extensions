'use strict'

import {registerSettings} from './settings.js'
import {Log} from './log.js'
import * as tokenMovement from './tokenMovements.js'

export class NTMFoundryExtensions {
    static MODULE_ID = 'ntm-foundry-extensions';
    static MODULE_NAME = 'NTM Foundry Extensions';

    static FLAGS = {}
}

Hooks.once('init', async function() {
    console.log(NTMFoundryExtensions.MODULE_ID, "init")
    registerSettings();
});

Hooks.once('ready', async function() {
    Log.log('Module getting ready')

    // Check libWrapper is installed - not currently needed, but likely will
    if(!game.modules.get('lib-wrapper')?.active && game.user.isGM)
        ui.notifications.error(`Module ${NTMFoundryExtensions.MODULE_NAME} requires the 'libWrapper' module. Please install and activate it.`);
    else
        Log.log('Registering wrappers');
});

/**
 * Register our module's debug flag with developer mode's custom hook
 */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(NTMFoundryExtensions.MODULE_ID);
});

tokenMovement.registerHooks();
