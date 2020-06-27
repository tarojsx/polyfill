import Taro from '@tarojs/taro'

export class TaroStorage implements Storage {
    /**
     * Returns the number of key/value pairs currently present in the list associated with the object.
     */
    get length(): number {
        const { keys } = Taro.getStorageInfoSync()
        return keys.length
    }

    /**
     * Empties the list associated with the object of all key/value pairs, if there are any.
     */
    clear(): void {
        Taro.clearStorageSync()
    }

    /**
     * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
     */
    getItem(keyName: string): string | null {
        const { keys } = Taro.getStorageInfoSync()
        if (!keys.includes(keyName)) return null

        const value = Taro.getStorageSync(keyName)
        if (typeof value === 'string') return value
        return JSON.stringify(value)
    }

    /**
     * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
     */
    key(index: number): string | null {
        const { keys } = Taro.getStorageInfoSync()
        if (index >= keys.length || index < 0) return null
        return keys[index]
    }

    /**
     * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
     */
    removeItem(keyName: string): void {
        Taro.removeStorageSync(keyName)
    }

    /**
     * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
     *
     * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
     */
    setItem(keyName: string, keyValue: any): void {
        try {
            const value = String(keyValue)
            Taro.setStorageSync(keyName, value)
        } catch (e) {
            // should throw a "QuotaExceededError" DOMException
            throw e
        }
    }
}

export const localStorage = new Storage()
