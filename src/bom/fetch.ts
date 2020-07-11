import { request } from '@tarojs/taro'

export const fetch: Window['fetch'] = async (input, init = {}) => {
    const { method = 'GET', headers: header, body: data } = init
    const res = await request({
        url: input,
        method,
        dataType: 'text',
        header,
        data,
    } as request.Option)

    return {
        get type() {
            return 'default'
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
            return res.header
        },
        get trailer() {
            return Promise.resolve(res.header)
        },
        get url() {
            return input
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
    } as Response
}
