import { ProvidePlugin } from 'webpack'

export type TaroProvidePluginDefinitions = Partial<typeof TaroProvidePlugin['identifierDefinitions']>
export type TaroProvidePluginIdentifiers = 'default' | keyof TaroProvidePluginDefinitions

const { name } = require('../../package.json')
const prefix: string = `${name}/dist`

const fetch = [`${prefix}/bom/fetch`, 'fetch']

const requestAnimationFrame = ['raf']
const cancelAnimationFrame = ['raf', 'cancel']

const Intl = ['intl']

export class TaroProvidePlugin extends ProvidePlugin {
    constructor(identifiers?: TaroProvidePluginIdentifiers[]) {
        super(TaroProvidePlugin.buildDefinitions(identifiers))
    }

    static buildDefinitions(identifiers = ['default'] as TaroProvidePluginIdentifiers[]): Record<string, string[]> {
        const defaultIdentifiers: TaroProvidePluginIdentifiers[] = ['fetch', 'requestAnimationFrame']

        return identifiers.reduce((obj, id) => {
            const defs =
                id === 'default' ? this.buildDefinitions(defaultIdentifiers) : this.identifierDefinitions[id] || {}

            return { ...obj, ...defs }
        }, {})
    }

    static identifierDefinitions = {
        get fetch() {
            return {
                fetch,
                ['window.fetch']: fetch,
            }
        },

        get requestAnimationFrame() {
            return {
                requestAnimationFrame,
                cancelAnimationFrame,
                ['window.requestAnimationFrame']: requestAnimationFrame,
                ['window.cancelAnimationFrame']: cancelAnimationFrame,
            }
        },

        get Intl() {
            return {
                Intl,
                ['window.Intl']: Intl,
            }
        },
    }
}
