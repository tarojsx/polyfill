import Taro from '@tarojs/taro'

export class Storage implements Storage {
    get length(): number {
        const { keys } = Taro.getStorageInfoSync()
        return keys.length
    }

    clear(): any {
        Taro.clearStorageSync()
    }

    getItem(keyName: string): any {
        return Taro.getStorageSync(keyName)
    }

    key(index: number): string {
        const { keys } = Taro.getStorageInfoSync()
        return keys[index]
    }

    removeItem(keyName: string): void {
        Taro.removeStorageSync(keyName)
    }

    setItem(keyName: string, keyValue: any): void {
        Taro.setStorageSync(keyName, keyValue)
    }
}

export const localStorage = new Storage()
