/// <reference types="@minapp/wx" />

import path from 'path'
import automator from 'miniprogram-automator'
import MiniProgram from 'miniprogram-automator/out/MiniProgram'
import Page from 'miniprogram-automator/out/Page'

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
        miniProgram && (await miniProgram.close())
    })

    describe('polyfill', () => {
        it('have 6 polyfills and 6 window fields', async () => {
            let res = await miniProgram.evaluate(() => Object.keys(getApp()['globalData']))
            expect(res.length).toBe(6 * 2)
        })
    })

    describe('fetch', () => {
        it('has fetch', async () => {
            let res = await miniProgram.evaluate(() => {
                let { fetch, 'window.fetch': $fetch } = getApp()['globalData']
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
                    const fetch: Window['fetch'] = getApp()['globalData'].fetch
                    return await fetch('https://servicewechat.com')
                })()
            )
            expect(res.status).toBe(200)
        })
    })

    describe('Intl', () => {
        it('has Intl', async () => {
            let res = await miniProgram.evaluate(() => {
                let { Intl, 'window.Intl': $Intl } = getApp()['globalData']
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
                let { navigator, 'window.navigator': $navigator } = getApp()['globalData']
                return {
                    navigator,
                    $navigator,
                }
            })
            expect(res.navigator).toBeTruthy()
            expect(res.navigator).toEqual(res.$navigator)
        })

        it('is Taro product', async () => {
            let res = await miniProgram.evaluate(() => {
                let navigator: Navigator = getApp()['globalData'].navigator
                return navigator.product
            })
            expect(res).toBe('Taro')
        })
    })

    describe('performance.now', () => {
        it('has performance.now', async () => {
            let res = await miniProgram.evaluate(() => {
                let { 'performance.now': now, 'window.performance.now': $now } = getApp()['globalData']
                return {
                    same: now === $now,
                    type: typeof now,
                }
            })
            expect(res.same).toBe(true)
            expect(res.type).toBe('function')
        })

        it('return positive number', async () => {
            let res = await miniProgram.evaluate(() => {
                let now: Window['performance']['now'] = getApp()['globalData']['performance.now']
                return now()
            })
            expect(res).toBeGreaterThan(0)
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
                } = getApp()['globalData']

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
                    let data = getApp()['globalData']
                    let requestAnimationFrame: Window['requestAnimationFrame'] = data.requestAnimationFrame
                    let cancelAnimationFrame: Window['cancelAnimationFrame'] = data.cancelAnimationFrame

                    return await new Promise((resolve) => {
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
})
