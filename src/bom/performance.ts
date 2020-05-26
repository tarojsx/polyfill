const getTime = () => Date.now?.() ?? new Date().getTime()
const loadTime = getTime()

/**
 * @see https://github.com/myrne/performance-now
 */
export const now =
    typeof performance !== 'undefined' && performance !== null && performance.now
        ? function () {
              return performance.now()
          }
        : function () {
              return getTime() - loadTime
          }
