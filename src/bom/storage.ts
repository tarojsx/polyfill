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
    setItem(keyName: string, keyValue: string): void {
        try {
            const value = keyValue === 'string' ? keyValue : JSON.stringify(keyValue)
            Taro.setStorageSync(keyName, value)
        } catch (e) {
            // should throw a "QuotaExceededError" DOMException
            throw e
        }
    }
}

class SessionStorage implements Storage {
    private storage: Map<string, string>

    constructor() {
        this.storage = new Map<string, string>()
    }

    /**
     * Returns the number of key/value pairs currently present in the list associated with the object.
     */
    get length(): number {
        return this.storage.size
    }

    /**
     * Empties the list associated with the object of all key/value pairs, if there are any.
     */
    clear(): void {
        this.storage.clear()
    }

    /**
     * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
     */
    getItem(keyName: string): string | null {
        const value = this.storage.get(keyName)
        if (!value) return null

        if (typeof value === 'string') return value
        return JSON.stringify(value)
    }

    /**
     * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
     */
    key(index: number): string | null {
        const keys = [...this.storage.keys()]
        if (index >= keys.length || index < 0) return null
        return keys[index]
    }

    /**
     * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
     */
    removeItem(keyName: string): void {
        this.storage.delete(keyName)
    }

    /**
     * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
     *
     * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
     */
    setItem(keyName: string, keyValue: string): void {
        const value = keyValue === 'string' ? keyValue : JSON.stringify(keyValue)
        this.storage.set(keyName, value)
    }
}

export const localStorage = new TaroStorage()
export const sessionStorage = new SessionStorage()
