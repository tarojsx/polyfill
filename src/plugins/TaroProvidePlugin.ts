import { ProvidePlugin } from 'webpack'
import path from 'path'
import semver from 'semver'

export type TaroProvidePluginDefinitions = Partial<typeof TaroProvidePlugin['identifierDefinitions']>
export type TaroProvidePluginIdentifiers = 'default' | keyof TaroProvidePluginDefinitions

const { name } = require('../../package.json')
const prefix: string = `${name}/dist`

const fetch = [`${prefix}/bom/fetch`, 'fetch']

const navigator = ['@tarojs/runtime', 'navigator']

const performanceNow = [`${prefix}/bom/performance`, 'now']

const requestAnimationFrame = [`${prefix}/bom/raf`, 'raf']
const cancelAnimationFrame = [`${prefix}/bom/raf`, 'caf']

const Intl = ['intl']

const Storage = [`${prefix}/bom/storage`, 'Storage']
const localStorage = [`${prefix}/bom/storage`, 'localStorage']

let taroRuntimeVersion = '0.0.0'
try {
    const { version } = require(path.join(
        path.resolve(require.resolve('@tarojs/runtime', { paths: [process.cwd()] }), '..', '..'),
        'package.json'
    ))
    taroRuntimeVersion = version
} catch (err) {
    console.warn(`找不到 @tarojs/runtime, ${name} 需要以 window 对象为目标.`)
}

/**
 * taro 各版本能力提升:
 * * 3.0.0-rc.1
 *   * raf (只存在于 window 对象下)
 * * 3.0.0-beta.3
 *   * raf (仅内部使用)
 * * 3.0.0-alpha.6
 *   * navigator
 */
export class TaroProvidePlugin extends ProvidePlugin {
    constructor(identifiers?: TaroProvidePluginIdentifiers[]) {
        super(TaroProvidePlugin.buildDefinitions(identifiers))
    }

    static buildDefinitions(identifiers = ['default'] as TaroProvidePluginIdentifiers[]): Record<string, string[]> {
        const defaultIdentifiers: TaroProvidePluginIdentifiers[] = [
            'fetch',
            'performanceNow',
            'requestAnimationFrame',
            'Storage',
        ]

        // if (semver.lt(taroRuntimeVersion, '3.0.0-rc.1')) defaultIdentifiers.push('requestAnimationFrame')
        if (semver.lt(taroRuntimeVersion, '3.0.0-alpha.6')) defaultIdentifiers.push('navigator')

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

        get performanceNow() {
            return {
                'performance.now': performanceNow,
                'window.performance.now': performanceNow,
            }
        },

        get requestAnimationFrame() {
            return {
                requestAnimationFrame,
                cancelAnimationFrame,
                ...(semver.lt(taroRuntimeVersion, '3.0.0-rc.1')
                    ? {
                          ['window.requestAnimationFrame']: requestAnimationFrame,
                          ['window.cancelAnimationFrame']: cancelAnimationFrame,
                      }
                    : {}),
            }
        },

        get Intl() {
            return {
                Intl,
                ['window.Intl']: Intl,
            }
        },

        get Storage() {
            return {
                Storage,
                localStorage,
                ['window.Storage']: Storage,
                ['window.localStorage']: localStorage,
            }
        },
    }
}
