'use strict'

import { registerSettings } from './settings.js'
import { Log } from './log.js'
import * as tokenMovement from './tokenMovements.js'

export class NTMFoundryExtensions {
  static MODULE_ID = 'ntm-foundry-extensions'
  static MODULE_NAME = 'NTM Foundry Extensions'

  static FLAGS = {
    LINKED_TOKENS: 'linkedTokens',
  }
}

Hooks.once('init', async function () {
  console.log(NTMFoundryExtensions.MODULE_ID, 'init')
  registerSettings()
  tokenMovement.registerBindings()

  libWrapper.register(
    NTMFoundryExtensions.MODULE_ID,
    'TokenLayer.prototype.moveMany',
    function (wrapped, args) {
      Log.log('TokenLayer.prototype.moveMany was called')

      if (game.combat?.started) {
        return wrapped(args)
      }

      // Determine the set of movable object IDs unless some were explicitly provided
      args.ids =
        args.ids instanceof Array
          ? args.ids
          : this.controlled.filter((o) => !o.document.locked).map((o) => o.id)

      const ids = [...args.ids]
      args.ids.forEach((id) => {
        const linkedIds = game.canvas.tokens
          .get(id)
          ?.document.getFlag(
            NTMFoundryExtensions.MODULE_ID,
            NTMFoundryExtensions.FLAGS.LINKED_TOKENS,
          )
        if (linkedIds) {
          ids.push(id, ...linkedIds)
        }
      })
      args.ids = [...new Set(ids)]

      Log.log('Ids: ', args.ids)

      return wrapped(args)
    },
    'MIXED',
  )
})

Hooks.once('ready', async function () {
  Log.log('Module getting ready')

  // Check libWrapper is installed - not currently needed, but likely will
  if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
    ui.notifications.error(
      `Module ${NTMFoundryExtensions.MODULE_NAME} requires the 'libWrapper' module. Please install and activate it.`,
    )
  } else {
    Log.log('Registering wrappers')
  }
})

/**
 * Register our module's debug flag with developer mode's custom hook
 */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(NTMFoundryExtensions.MODULE_ID)
})

tokenMovement.registerHooks()
