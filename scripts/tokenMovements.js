import { NTMFoundryExtensions } from './module.js'
import { Log } from './log.js'
import { SETTINGS } from './settings.js'

export function registerHooks() {
  Hooks.on(
    'preUpdateToken',
    async function (tokenDocument, diff, options, userId) {
      // Check if we should skip the hook
      if (
        !game.settings.get(
          NTMFoundryExtensions.MODULE_ID,
          SETTINGS.TOKEN_MOVEMENT.SKIP,
        ) ||
        (!diff.x && !diff.y)
      ) {
        Log.log('Skipping preUpdateToken hook')
        return
      }

      const skipAnimation =
        game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.ALT) ^
        (game.settings.get(
          NTMFoundryExtensions.MODULE_ID,
          SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.VALUE,
        ) &&
          game.settings.get(
            NTMFoundryExtensions.MODULE_ID,
            SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.SHOW,
          ))

      // Use the 'alt' modifier key for now as conflicts least with other functionality
      // TODO: Let users select a key to use
      if (skipAnimation && (!game.combat?.started || game.user?.isGM)) {
        options.animation = {}
        options.animation.duration = -1
      }

      // GM can always choose to skip animation
      // Players cannot skip animation during combat (Permission level could be determined by a selector setting)
      // Anyone (or controlled by a setting) can set an animation duration limit
      // Option to always skip animations? (Visibility should be controlled by another setting)
    },
  )

  Hooks.on('getSceneControlButtons', async function (controls) {
    if (
      game.settings.get(
        NTMFoundryExtensions.MODULE_ID,
        SETTINGS.TOKEN_MOVEMENT.SKIP,
      ) &&
      game.settings.get(
        NTMFoundryExtensions.MODULE_ID,
        SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.SHOW,
      )
    ) {
      const skipMoveAnimationToggleButton = {
        name: 'token-movement-toggle-button',
        title: 'Skip Movement Animation',
        icon: 'fa-solid fa-step-forward',
        toggle: true,
        active: game.settings.get(
          NTMFoundryExtensions.MODULE_ID,
          SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.VALUE,
        ),
        onClick: (value) => {
          game.settings.set(
            NTMFoundryExtensions.MODULE_ID,
            SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.VALUE,
            value,
          )
        },
        // TODO: Add a toolclip
      }
      const tokenMenuButton = controls.find((button) => button.name === 'token')
      tokenMenuButton.tools.push(skipMoveAnimationToggleButton)
    } else {
      Log.log('Not adding toggle button')
    }
  })
}
