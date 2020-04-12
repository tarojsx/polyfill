import { ProvidePlugin } from 'webpack'
import path from 'path'
import semver from 'semver'

export type TaroProvidePluginDefinitions = Partial<typeof TaroProvidePlugin['identifierDefinitions']>
export type TaroProvidePluginIdentifiers = 'default' | keyof TaroProvidePluginDefinitions

const { name } = require('../../package.json')
const prefix: string = `${name}/dist`

const fetch = [`${prefix}/bom/fetch`, 'fetch']

const navigator = ['@tarojs/runtime', 'navigator']

const requestAnimationFrame = ['raf']
const cancelAnimationFrame = ['raf', 'cancel']

const Intl = ['intl']

/**
 * taro 各版本能力提升:
 * * 3.0.0-beta.3
 *   * raf
 * * 3.0.0-alpha.6
 *   * navigator
 */
export class TaroProvidePlugin extends ProvidePlugin {
    constructor(identifiers?: TaroProvidePluginIdentifiers[]) {
        super(TaroProvidePlugin.buildDefinitions(identifiers))
    }

    static buildDefinitions(identifiers = ['default'] as TaroProvidePluginIdentifiers[]): Record<string, string[]> {
        const defaultIdentifiers: TaroProvidePluginIdentifiers[] = ['fetch']

        try {
            const { version } = require(path.join(
                path.resolve(require.resolve('@tarojs/runtime', { paths: [process.cwd()] }), '..', '..'),
                'package.json'
            ))

            if (semver.lt(version, '3.0.0-beta.3')) defaultIdentifiers.push('requestAnimationFrame')
            if (semver.lt(version, '3.0.0-alpha.6')) defaultIdentifiers.push('navigator')
        } catch (err) {
            console.warn('TaroProvidePlugin buildDefinitions error:', err && err.message)
        }

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

        get navigator() {
            return {
                navigator,
                ['window.navigator']: navigator,
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
