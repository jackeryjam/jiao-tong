import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const createModel = <T = any, CustomPayload = any>(
  init?: T | (() => T)
) => {
  let oldData: T = null;
  // @ts-ignore
  let data = typeof init === "function" ? init() : init;
  let updateTime: number = new Date().getTime();
  type ListenerFn = (
    val: T,
    options: { lastState: T; payload?: CustomPayload }
  ) => void;
  type CalcDataFn = (nowVal: T) => T;
  let listeners: Array<ListenerFn> = [];
  const subscribe = (
    listenerFn: ListenerFn,
    options?: {
      callAfterSubscibe?: boolean;
    }
  ) => {
    const callAfterSubscibe = !!options?.callAfterSubscibe;
    callAfterSubscibe && listenerFn(data, { lastState: oldData });
    listeners.push(listenerFn);
    return () => {
      listeners = listeners.filter((fn) => fn !== listenerFn);
    };
  };

  let timer: NodeJS.Timeout;
  const dispatch = (
    param: T | CalcDataFn,
    options?: {
      payload?: CustomPayload;
    }
  ) => {
    updateTime = new Date().getTime();
    oldData = data;
    // @ts-ignore
    data = typeof param === "function" ? param(data) : param;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      listeners.forEach((fn) =>
        fn(data, {
          lastState: oldData,
          payload: options?.payload,
        })
      );
    });
  };

  const useModel = (): [T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(data);
    useEffect(() => {
      return subscribe((newValue) => setValue(newValue));
    }, []);
    return [value, dispatch];
  };

  const useUpdateTime = (): [number, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<number>(updateTime);
    useEffect(() => {
      return subscribe(() => setValue(updateTime));
    }, []);
    return [value, dispatch];
  };

  return {
    useModel,
    getData: () => data,
    subscribe,
    dispatch,
    useUpdateTime,
    getUpdateTime: () => updateTime,
  };
};
