
export const SETTINGS_KEY = 'ntm-foundry-extensions'

export const SETTINGS = {
    SKIP_MOVE_ANIMATION: 'skip-move-animation'
}
export function registerSettings() {
    game.settings.register(SETTINGS_KEY, SETTINGS.SKIP_MOVE_ANIMATION, {
        name: `NTM-EXT.settings.${SETTINGS.SKIP_MOVE_ANIMATION}.Name`,
        hint: `NTM-EXT.settings.${SETTINGS.SKIP_MOVE_ANIMATION}.Hint`,
        default: true,
        type: Boolean,
        scope: 'world',
        config: true
    })
}
