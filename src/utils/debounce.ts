import { DependencyList, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'

export const useDebounce = (fn: Function, ms?: number, deps?: DependencyList) => {
  const debunceInstance = useMemo(() => {
    let dbFn: Function
    return {
      updateFn: (fn: Function) => (dbFn = fn),
      debounceFn: debounce((...argv: any[]) => {
        dbFn && dbFn(argv)
      }, ms)
    }
  }, [])

  useEffect(() => {
    debunceInstance.updateFn(fn)
    debunceInstance.debounceFn()
  }, [...deps, debunceInstance])
}
