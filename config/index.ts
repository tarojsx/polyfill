import path from 'path'
import WebpackChain from 'webpack-chain'
import { TaroProvidePlugin } from '../dist/plugins'
import { IProjectConfig } from '@tarojs/taro/types/compile'

const config: IProjectConfig = {
    projectName: 'test',
    date: '2020-2-22',
    designWidth: 750,
    deviceRatio: { 750: 1 },
    sourceRoot: 'test/src',
    outputRoot: 'test/dist',
    framework: 'react',
    alias: {
        '@': path.resolve(__dirname, '..', 'src'),
        '@tarojsx/polyfill': path.resolve(__dirname, '..'),
    },
    mini: {
        webpackChain(chain: WebpackChain) {
            chain.optimization.sideEffects(false)
            chain.plugin('taroProvidePlugin').use(TaroProvidePlugin, [['default', 'Intl']])
        },
    },
}

export default function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, { env: { NODE_ENV: '"development"' } })
    }
    return merge({}, config, { env: { NODE_ENV: '"production"' } })
}
