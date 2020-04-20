import { now } from './now'

let lastTime = 0

// https://gist.github.com/paulirish/1579671
// https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
export const raf =
    typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame !== null
        ? requestAnimationFrame
        : function (callback: FrameRequestCallback) {
              const _now = now()
              const nextTime = Math.max(lastTime + 16, _now) // First time will execute it immediately but barely noticeable and performance is gained.
              return setTimeout(function () {
                  callback((lastTime = nextTime))
              }, nextTime - _now)
          }

export const caf =
    typeof cancelAnimationFrame !== 'undefined' && cancelAnimationFrame !== null ? cancelAnimationFrame : clearTimeout
