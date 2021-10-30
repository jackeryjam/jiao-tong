import { useEffect, useState } from "react";

export const createModal = <T = any, CustomPayload = any>(init?: T) => {
  let oldData: T = null;
  let data = init;
  let updateTime: number = new Date().getTime();
  type ListenerFn = (val: T, oldVal: T, payload?: CustomPayload) => void;
  type CalcDataFn = (nowVal: T) => T;
  let listeners: Array<ListenerFn> = [];
  const subscribe = (
    listenerFn: ListenerFn,
    options?: {
      callAfterSubscibe?: boolean;
    }
  ) => {
    const callAfterSubscibe = !!options?.callAfterSubscibe;
    callAfterSubscibe && listenerFn(data, oldData);
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
      listeners.forEach((fn) => fn(data, oldData, options?.payload));
    });
  };

  const useUpdateTime = () => {
    const [value, setValue] = useState<number>(updateTime);
    useEffect(() => {
      return subscribe(() => setValue(updateTime));
    }, []);
    return [value, dispatch];
  };

  type Modal = {
    useModal: () => [T, (val: T) => void];
    getData: () => T;
    subscribe: typeof subscribe;
    dispatch: typeof dispatch;
    useUpdateTime: typeof useUpdateTime;
  };

  const modal: Modal = {
    useModal: () => {
      const [value, setValue] = useState<T>(data);
      useEffect(() => {
        return subscribe((newValue) => setValue(newValue));
      }, []);
      return [value, dispatch];
    },
    getData: () => {
      return data;
    },
    subscribe,
    dispatch,
    useUpdateTime,
  };

  return modal;
};
