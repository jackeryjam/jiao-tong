import { DependencyList, useEffect, useMemo } from 'react'

function debounce(fn, wait) {
  let callback = fn;    
  let timerId = null;

  function debounced() {
      // 保存作用域
      let context = this;
      // 保存参数，例如 event 对象
      let args = arguments;        

      clearTimeout(timerId);        
      timerId = setTimeout(function() {            
          callback.apply(context, args);
      }, wait);
  }
  
  // 返回一个闭包
  return debounced;         
}

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
