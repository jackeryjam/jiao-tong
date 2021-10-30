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
  };
};

export default createEvent;
