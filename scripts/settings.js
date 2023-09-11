const confirmReload = async () => {
  const confirmed = await Dialog.confirm({
    title: game.i18n.localize('NTM-EXT.confirms.reload.Title'),
    content: game.i18n.localize('NTM-EXT.confirms.reload.Content'),
  })
  if (confirmed) {
    foundry.utils.debouncedReload()
  }
}

export const SETTINGS_KEY = 'ntm-foundry-extensions'

export const SETTINGS = {
  TOKEN_MOVEMENT: {
    SKIP: 'token-movement-skip',
    TOGGLE_BUTTON: {
      SHOW: 'token-movement-toggle-button-show',
      VALUE: 'token-movement-toggle-button-value',
    },
  },
}

export function registerSettings() {
  game.settings.register(SETTINGS_KEY, SETTINGS.TOKEN_MOVEMENT.SKIP, {
    name: `NTM-EXT.settings.${SETTINGS.TOKEN_MOVEMENT.SKIP}.Name`,
    hint: `NTM-EXT.settings.${SETTINGS.TOKEN_MOVEMENT.SKIP}.Hint`,
    default: true,
    type: Boolean,
    scope: 'world',
    config: true,
    onChange: confirmReload,
  })

  game.settings.register(
    SETTINGS_KEY,
    SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.SHOW,
    {
      name: `NTM-EXT.settings.${SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.SHOW}.Name`,
      hint: `NTM-EXT.settings.${SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.SHOW}.Hint`,
      default: true,
      type: Boolean,
      scope: 'world',
      config: true,
      onChange: confirmReload,
    },
  )

  game.settings.register(
    SETTINGS_KEY,
    SETTINGS.TOKEN_MOVEMENT.TOGGLE_BUTTON.VALUE,
    {
      default: false,
      type: Boolean,
      scope: 'client',
      config: false,
    },
  )
}
