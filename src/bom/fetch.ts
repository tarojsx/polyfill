import Taro from '@tarojs/taro'

export const fetch: Window['fetch'] = async (input, init = {}) => {
    const { method = 'GET', headers: header, body: data } = init
    const res = await Taro.request({
        url: input as string,
        method: method as Taro.request.Option['method'],
        dataType: 'text',
        header: header,
        data,
    })

    return {
        get type() {
            return 'default' as ResponseType
        },
        get status() {
            return res.statusCode
        },
        get statusText() {
            return 'OK'
        },
        get ok() {
            return res.statusCode >= 200 && res.statusCode < 300
        },
        get headers() {
            return res.header as Headers
        },
        get trailer() {
            return Promise.resolve(res.header as Headers)
        },
        get url() {
            return input as string
        },
        get redirected() {
            return false
        },
        get body() {
            return null
        },
        get bodyUsed() {
            return true
        },
        async text() {
            return res.data
        },
        async json() {
            return JSON.parse(res.data)
        },
        async formData() {
            return null
        },
        async arrayBuffer() {
            return null
        },
        async blob() {
            return null
        },
        clone() {
            return this
        },
    }
}
