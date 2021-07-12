import {useCallback, useEffect, useState} from 'react';

// region useStateless

export interface StatelessWrapper<T>{
  value: T;
  lastModifiedTime: number;
}

export type TriggerChangeFunc = () => void;

export type UseStatelessReturn<T> = [StatelessWrapper<T>, TriggerChangeFunc];

/**
 * 手动更新修改的state的state, 类似于useState, 但是不会自动触发依赖更改
 * @param defaultValue 默认值
 */
export default function useStateless<T>(defaultValue?: T): UseStatelessReturn<T> {
  const [stateless, setStateless] = useState<StatelessWrapper<T>>({
    value: defaultValue as any,
    lastModifiedTime: Date.now(),
  });

  const triggerChange = useCallback(() => {
    setStateless(old => ({
      ...old,
      lastModifiedTime: Date.now(),
    }));
  }, [setStateless]);

  return [stateless, triggerChange];
}

// endregion

// region useOnlyOnce

export class UseOnlyOnceDuplicatedError extends Error {
  constructor(message?: string) {
    super(message || 'useOnlyOnce duplicated error');
  }
}

export type DoneFunc = () => boolean;
export type DoOnceFunc = (throwErrorOnDuplicated?: boolean) => void;
export type ResetFunc = () => void;
export type UseOnlyOnceReturn = [DoneFunc, DoOnceFunc, ResetFunc];

/**
 * 标记缓存, 用于那些只初始化/使用一次的内容
 */
export function useOnlyOnce(): UseOnlyOnceReturn {
  const [cache] = useState<number[]>([]);

  const done = useCallback(() => {
    return cache.length > 0;
  }, [cache]);

  const doOnce = useCallback((throwErrorOnDuplicated: boolean = true) => {
    if (throwErrorOnDuplicated && cache.length > 0) {
      throw new UseOnlyOnceDuplicatedError();
    }
    cache.push(Date.now());
  }, [cache]);

  const reset = useCallback(() => {
    cache.splice(0, cache.length);
  }, [cache]);

  return [done, doOnce, reset];
}

// endregion

// region useTimer

/**
 * 停止计时器
 */
export type FinishFunc = () => void;

/**
 * 设置定时器
 * @param callback 回调
 * @param ms 毫秒计时
 * @return {@link setTimeout的返回值}
 */
export type SetTimerFunc = (callback: Function, ms?: number) => number;

/**
 * 当前定时器是否启动
 */
export type IsStartedFunc = () => boolean;

export type UseTimerReturn = [IsStartedFunc, SetTimerFunc, FinishFunc];

/**
 * 计时器
 * @param withAutoResourceManagement 是否自动关闭计时器
 */
export function useTimer(withAutoResourceManagement: boolean = true): UseTimerReturn {
  // 用于标记当前启动了计时器, 避免重复启动
  const [done, doOnce, reset] = useOnlyOnce();

  // 当前启动了的计时器的ID
  const [timeoutId] = useStateless(-1);

  const setTimeoutFunc = useCallback((callback: Function, ms: number = 0) => {
    if (!done()) {
      doOnce();
      timeoutId.value = setTimeout(() => {
        reset();
        callback();
      }, ms) as unknown as number;
    }
    return timeoutId.value;
  }, [done, doOnce, reset, timeoutId]);

  const finishFunc = useCallback(() => {
    reset();
    clearTimeout(timeoutId.value);
  }, [reset, timeoutId]);

  useEffect(() => {
    return () => {
      if (withAutoResourceManagement) {
        finishFunc();
      }
    };
  }, [withAutoResourceManagement, finishFunc]);

  return [done, setTimeoutFunc, finishFunc];
}

// endregion
