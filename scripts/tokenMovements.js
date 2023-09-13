import { NTMFoundryExtensions } from './module.js'
import { Log } from './log.js'
import { SETTINGS } from './settings.js'

function skipAnimation(options) {
  /*
  GM can always choose to skip animation
  Players cannot skip animation during combat (Permission level could be determined by a selector setting)
  Anyone (or controlled by a setting) can set an animation duration limit
  Option to always skip animations? (Visibility should be controlled by another setting)
   */
  const shouldSkipAnimation =
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
  if (shouldSkipAnimation && (!game.combat?.started || game.user?.isGM)) {
    options.animation = {}
    options.animation.duration = -1
  }
}

export function registerHooks() {
  Hooks.on(
    'preUpdateToken',
    async function (tokenDocument, diff, options, userId) {
      // Check if we should skip the hook
      if (!diff.x && !diff.y) {
        Log.log('Skipping preUpdateToken hook')
        return
      }

      if (
        game.settings.get(
          NTMFoundryExtensions.MODULE_ID,
          SETTINGS.TOKEN_MOVEMENT.SKIP,
        )
      ) {
        skipAnimation(options)
      }
    },
  )

  Hooks.on('getSceneControlButtons', async function (controls) {
    // Add skip movement animation toggle button
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

function linkTokens() {
  const tokens = game.canvas.tokens

  const linkedTokens = tokens.controlled.map((token) => {
    return token.id
  })
  Log.log('Linking tokens: ', linkedTokens)

  tokens.placeables.forEach((token) => {
    if (!linkedTokens.includes(token.id)) {
      return token.document.unsetFlag(
        NTMFoundryExtensions.MODULE_ID,
        NTMFoundryExtensions.FLAGS.LINKED_TOKENS,
      )
    }
  })

  tokens.controlled.map((token) => {
    return token.document.setFlag(
      NTMFoundryExtensions.MODULE_ID,
      NTMFoundryExtensions.FLAGS.LINKED_TOKENS,
      linkedTokens.filter((id) => {
        return id !== token.id
      }),
    )
  })
}

export function registerBindings() {
  Log.log('Registering bindings')
  game.keybindings.register(NTMFoundryExtensions.MODULE_ID, 'link-tokens', {
    name: 'Link tokens',
    hint: 'Link token hint',
    editable: [
      {
        key: 'KeyL',
        modifiers: ['Shift'],
      },
    ],
    onDown: () => linkTokens(),
    reservedModifiers: ['Alt'],
  })
}
