import {NTMFoundryExtensions} from "./module.js";

export class Log {

    static log(...args) {
        const shouldLog = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(NTMFoundryExtensions.MODULE_ID);

        if (shouldLog) {
            console.log(NTMFoundryExtensions.MODULE_ID, '|', ...args);
        }
    }
}
