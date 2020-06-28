/// <reference types="@minapp/wx" />

import path from 'path'
import automator from 'miniprogram-automator'
import _MiniProgram from 'miniprogram-automator/out/MiniProgram'
import Page from 'miniprogram-automator/out/Page'

declare global {
    interface App {
        globalData: {
            fetch: Window['fetch']
            'window.fetch': Window['fetch']

            Intl: typeof window.Intl
            'window.Intl': typeof window.Intl

            navigator: Navigator
            'window.navigator': Navigator

            'performance.now': Window['performance']['now']
            'window.performance.now': Window['performance']['now']

            requestAnimationFrame: Window['requestAnimationFrame']
            'window.requestAnimationFrame': Window['requestAnimationFrame']
            cancelAnimationFrame: Window['cancelAnimationFrame']
            'window.cancelAnimationFrame': Window['cancelAnimationFrame']

            localStorage: Storage
            'window.localStorage': Storage
            sessionStorage: Storage
            'window.sessionStorage': Storage
        }
    }

    class MiniProgram extends _MiniProgram {
        evaluate<T = any>(appFunction: string | (() => T | Promise<T>)): Promise<T>
    }
}

const cwd = path.resolve(__dirname, '..')

jest.setTimeout(10000)

describe('weapp', () => {
    let miniProgram: MiniProgram
    let page: Page

    beforeAll(async () => {
        miniProgram = await automator.launch({
            projectPath: cwd,
        })
        page = await miniProgram.currentPage()
        page.waitFor(500)
    }, 30000)

    afterAll(async () => {
        // miniProgram && (await miniProgram.close())
    })

    describe('polyfill', () => {
        it('have 8 polyfills and 8 window fields', async () => {
            await expect(miniProgram.evaluate(() => Object.keys(getApp().globalData))).resolves.toHaveLength(8 * 2)
        })
    })

    describe('fetch', () => {
        it('has fetch', async () => {
            let res = await miniProgram.evaluate(() => {
                let { fetch, 'window.fetch': $fetch } = getApp().globalData
                return {
                    same: fetch === $fetch,
                    type: typeof fetch,
                }
            })
            expect(res.same).toBe(true)
            expect(res.type).toBe('function')
        })

        it('fetch website', async () => {
            let res = await miniProgram.evaluate(() =>
                (async () => {
                    const { fetch } = getApp().globalData
                    return await fetch('https://servicewechat.com')
                })()
            )
            expect(res.status).toBe(200)
        })
    })

    describe('Intl', () => {
        it('has Intl', async () => {
            let res = await miniProgram.evaluate(() => {
                let { Intl, 'window.Intl': $Intl } = getApp().globalData
                return {
                    Intl,
                    $Intl,
                }
            })
            expect(res.Intl).toBeTruthy()
            expect(res.Intl).toEqual(res.$Intl)
        })
    })

    describe('navigator', () => {
        it('has navigator', async () => {
            let res = await miniProgram.evaluate(() => {
                let { navigator, 'window.navigator': $navigator } = getApp().globalData
                return {
                    navigator,
                    $navigator,
                }
            })
            expect(res.navigator).toBeTruthy()
            expect(res.navigator).toEqual(res.$navigator)
        })

        it('is Taro product', async () => {
            await expect(miniProgram.evaluate(() => getApp().globalData.navigator.product)).resolves.toBe('Taro')
        })
    })

    describe('performance.now', () => {
        it('has performance.now', async () => {
            let res = await miniProgram.evaluate(() => {
                let { 'performance.now': now, 'window.performance.now': $now } = getApp().globalData
                return {
                    same: now === $now,
                    type: typeof now,
                }
            })
            expect(res.same).toBe(true)
            expect(res.type).toBe('function')
        })

        it('return positive number', async () => {
            await expect(miniProgram.evaluate(() => getApp().globalData['performance.now']())).resolves.toBeGreaterThan(
                0
            )
        })
    })

    describe('raf', () => {
        it('has raf', async () => {
            let res = await miniProgram.evaluate(() => {
                let {
                    requestAnimationFrame,
                    cancelAnimationFrame,
                    'window.requestAnimationFrame': $requestAnimationFrame,
                    'window.cancelAnimationFrame': $cancelAnimationFrame,
                } = getApp().globalData

                return {
                    same:
                        requestAnimationFrame === $requestAnimationFrame &&
                        cancelAnimationFrame === $cancelAnimationFrame,
                    type: typeof requestAnimationFrame,
                    type2: typeof cancelAnimationFrame,
                }
            })
            expect(res.same).toBe(true)
            expect(res.type).toBe('function')
            expect(res.type2).toBe('function')
        })

        it('invoke callback', async () => {
            let res = await miniProgram.evaluate(() =>
                (async () => {
                    let { requestAnimationFrame, cancelAnimationFrame } = getApp().globalData

                    return await new Promise(resolve => {
                        let timer = requestAnimationFrame(() => {
                            cancelAnimationFrame(timer)
                            resolve(true)
                        })
                    })
                })()
            )
            expect(res).toBe(true)
        })
    })

    describe('localStorage', () => {
        beforeEach(async () => await miniProgram.evaluate(() => wx.clearStorageSync()))

        afterEach(async () => await miniProgram.evaluate(() => wx.clearStorageSync()))

        it('has localStorage', async () => {
            let res = await miniProgram.evaluate(() => {
                let { localStorage, 'window.localStorage': $localStorage } = getApp().globalData

                return {
                    same: localStorage === $localStorage,
                    type: typeof requestAnimationFrame,
                }
            })
            expect(res.same).toBe(true)
            expect(res.type).toBe('function')
        })

        it('store localStorage values', async () => {
            /* { } */

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.length)).resolves.toBe(0)

            await expect(
                miniProgram.evaluate(() => getApp().globalData.localStorage.getItem('--non-exists-key--'))
            ).resolves.toBeNull()

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.key(999))).resolves.toBeNull()
            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.key(-1))).resolves.toBeNull()

            /* { test: '' } */

            await miniProgram.evaluate(() => getApp().globalData.localStorage.setItem('test', ''))

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.getItem('test'))).resolves.toBe('\"\"')

            /* { test: 'test' } */

            await miniProgram.evaluate(() => getApp().globalData.localStorage.setItem('test', 'test'))

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.getItem('test'))).resolves.toBe(
                '"test"'
            )
            await expect(miniProgram.evaluate(() => wx.getStorageSync('test'))).resolves.toBe('"test"')

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.length)).resolves.toBe(1)

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.key(0))).resolves.toBe('test')

            /* { test: { a: 1 } } */

            await miniProgram.evaluate(() => wx.setStorageSync('test', { a: 1 }))

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.getItem('test'))).resolves.toBe(
                '{"a":1}'
            )

            /* { test: { a: 1 }, test2: 'test2' } */

            await miniProgram.evaluate(() => getApp().globalData.localStorage.setItem('test2', 'test2'))

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.length)).resolves.toBe(2)

            /* { test: { a: 1 } } */

            await miniProgram.evaluate(() => {
                let { localStorage } = getApp().globalData
                localStorage.removeItem('test-none')
                localStorage.removeItem('test2')
            })

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.length)).resolves.toBe(1)

            /* { } */

            await miniProgram.evaluate(() => getApp().globalData.localStorage.clear())

            await expect(miniProgram.evaluate(() => getApp().globalData.localStorage.length)).resolves.toBe(0)
        })
    })

    describe('sessionStorage', () => {
        it('has sessionStorage', async () => {
            let res = await miniProgram.evaluate(() => {
                let { sessionStorage, 'window.sessionStorage': $sessionStorage } = getApp().globalData

                return {
                    same: sessionStorage === $sessionStorage,
                    type: typeof requestAnimationFrame,
                }
            })
            expect(res.same).toBe(true)
            expect(res.type).toBe('function')
        })

        it('store sessionStorage values', async () => {
            /* { } */

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.length)).resolves.toBe(0)

            await expect(
                miniProgram.evaluate(() => getApp().globalData.sessionStorage.getItem('--non-exists-key--'))
            ).resolves.toBeNull()

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.key(999))).resolves.toBeNull()
            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.key(-1))).resolves.toBeNull()

            /* { test: '' } */

            await miniProgram.evaluate(() => getApp().globalData.sessionStorage.setItem('test', ''))

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.getItem('test'))).resolves.toBe('\"\"')

            /* { test: 'test' } */

            await miniProgram.evaluate(() => getApp().globalData.sessionStorage.setItem('test', 'test'))

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.length)).resolves.toBe(1)

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.key(0))).resolves.toBe('test')

            /* { test: 'test', test2: 'test2' } */

            await miniProgram.evaluate(() => getApp().globalData.sessionStorage.setItem('test2', 'test2'))

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.length)).resolves.toBe(2)

            /* { test: 'test' } */

            await miniProgram.evaluate(() => {
                let { sessionStorage } = getApp().globalData
                sessionStorage.removeItem('test-none')
                sessionStorage.removeItem('test2')
            })

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.length)).resolves.toBe(1)

            /* { } */

            await miniProgram.evaluate(() => getApp().globalData.sessionStorage.clear())

            await expect(miniProgram.evaluate(() => getApp().globalData.sessionStorage.length)).resolves.toBe(0)
        })
    })
})
