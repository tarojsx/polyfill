import React from 'react'
import Taro from '@tarojs/taro'

const polyfills = {
    fetch: fetch,
    'window.fetch': window.fetch,

    Intl: Intl,
    'window.Intl': window.Intl,

    navigator: navigator,
    'window.navigator': window.navigator,

    'performance.now': performance.now,
    'window.performance.now': window.performance.now,

    requestAnimationFrame: requestAnimationFrame,
    'window.requestAnimationFrame': window.requestAnimationFrame,
    cancelAnimationFrame: cancelAnimationFrame,
    'window.cancelAnimationFrame': window.cancelAnimationFrame,

    localStorage: localStorage,
    'window.localStorage': window.localStorage,
    sessionStorage: sessionStorage,
    'window.sessionStorage': window.sessionStorage,
}

export default () => {
    Taro.useDidShow(() => {
        Taro.getApp().globalData = polyfills
    })
    return <view>testing {Object.keys(polyfills).length} polyfills...</view>
}
