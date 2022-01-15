import { useEffect, DependencyList } from "react";

export const createEvent = <EventName extends string, EventData = void>() => {
  type ListenerFn = (val: EventData) => void;
  const listeners: { [key: string]: Array<ListenerFn> } = {};
  const subscribe = (eventName: EventName, listenerFn: ListenerFn) => {
    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(listenerFn);
    return () => {
      listeners[eventName] = listeners[eventName].filter(
        (fn) => fn !== listenerFn
      );
    };
  };

  const dispatch = (eventName: EventName, val: EventData) => {
    const subscribers = listeners[eventName] || [];
    subscribers.forEach((fn) => fn(val));
  };

  return {
    useSubscribe: (
      eventName: EventName,
      fn: (e: EventData) => void,
      deps: DependencyList
    ) => {
      useEffect(() => {
        return subscribe(eventName, fn);
      }, deps);
    },
    dispatchEvent: dispatch,
    subscribeEvent: subscribe,
  };
};

export const createSimpleEvent = <EventData = void>() => {
  type ListenerFn = (val: EventData) => void;
  const {
    useSubscribe: useSimpleSubscribe,
    dispatchEvent: dispatchSimpleEvent,
    subscribeEvent: subscribeSimpleEvent,
  } = createEvent<"simple", EventData>();

  return {
    useSubscribe: (fn: (e: EventData) => void, deps: DependencyList) => {
      useSimpleSubscribe("simple", fn, deps);
    },
    dispatchEvent: (data: EventData) => dispatchSimpleEvent("simple", data),
    subscribeEvent: (listener: ListenerFn) =>
      subscribeSimpleEvent("simple", listener),
  };
};

export default createEvent;
