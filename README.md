<div align="center">
    <h1>Taro3 Polyfill</h1>
</div>
<div align="center">
    <strong>让 Taro3 运行环境更接近现代浏览器</strong>
</div>

<br />

<div align="center">
    <a href="https://github.com/tarojsx/polyfill/blob/master/LICENSE">
        <img src="https://badgen.net/github/license/tarojsx/polyfill" alt="License" />
    </a>
    <a href="https://www.npmjs.com/package/@tarojsx/polyfill">
        <img src="https://badgen.net/npm/v/@tarojsx/polyfill" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/org/tarojsx">
        <img src="https://badgen.net/npm/dt/@tarojsx/polyfill" alt="npm downloads" />
    </a>
    <a href="https://github.com/tarojsx/polyfill/blob/master/package.json">
        <img src="https://badgen.net/github/dependents-pkg/tarojsx/polyfill" alt="dependents" />
    </a>
    <a href="http://makeapullrequest.com">
        <img src="https://badgen.net/badge/PRs/welcome/green" alt="PRs welcome" />
    </a>
</div>

<div align="center">
    Built with :purple_heart: by
    <a href="https://github.com/cncolder">@Colder</a> and
    <a href="https://github.com/tarojsx/polyfill/graphs/contributors">
        Contributors
    </a>
    <div align="center">
        :star2: :eyes: :zap: :boom:
    </div>
</div>

<br />

_当前代码提交频繁，一些特性时有变化。_

很多优秀的前端类库都是为现代浏览器而设计的。[Taro3 Runtime](https://github.com/NervJS/taro/tree/next/packages/taro-runtime) 为我们提供了基础的 BOM/DOM API，例如 window document navigator。我们需要自己动手在这个基础上打造一个更接近现代浏览器的运行环境。

这里搜集了一些扩展 Taro3 运行环境的 [小玩意儿(Polyfill)](https://developer.mozilla.org/zh-CN/docs/Glossary/Polyfill)

## 特性

- :electric_plug: 编译时注入。

- :clapper: 项目中直接使用。

- :octopus: 自动处理依赖关系。

## 需求

* **taro 3+**

## 安装

`npm i @tarojsx/polyfill`

## 使用

更新 config/index.js 配置如下

```js
const { TaroProvidePlugin } = require('@tarojsx/polyfill/dist/plugins')

const config = {
    mini: {
        webpackChain(chain, webpack) {
            // 注入默认 polyfills (详见下方列表)
            chain
                .plugin('taroProviderPlugin')
                .use(TaroProvidePlugin)

            // 注入更多 polyfills
            // chain
            //     .plugin('taroProviderPlugin')
            //     .use(TaroProvidePlugin, [['default', 'Intl']])
        }
    }
}
```

## Polyfills

### 默认

* [x] [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
* [x] [performance.now](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)
* [x] [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)
  *  [raf](https://github.com/chrisdickinson/raf)
* [x] [localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) by [@Songkeys](https://github.com/Songkeys)
* [x] [sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage) by [@Songkeys](https://github.com/Songkeys)

### 更多

* [x] [Intl](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)
  *  [intl](https://github.com/andyearnshaw/Intl.js)

## 支持

欢迎各种形式的支持。至少可以给颗星 :star:

### 测试步骤

1. 打开微信开发者工具 CLI/HTTP 调用功能，设置 - 安全设置 - 服务端口
2. 导入项目，目录指向当前项目文件夹。
3. 运行 `npm run test`
4. 如果提示 `Failed to launch wechat web devTools`，请先退出微信开发者工具。

## License

[MIT](LICENSE)
