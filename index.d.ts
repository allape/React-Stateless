import { Dispatch, SetStateAction } from 'react';
export interface StatelessWrapper<T> {
    value: T;
    lastModifiedTime: number;
}
export declare type TriggerChangeFunc = () => void;
export declare type UseStatelessReturn<T> = [StatelessWrapper<T>, TriggerChangeFunc];
/**
 * 手动更新修改的state的state, 类似于useState, 但是不会自动触发依赖更改
 * @param defaultValue 默认值
 */
export default function useStateless<T>(defaultValue?: T): UseStatelessReturn<T>;
export declare class UseOnlyOnceDuplicatedError extends Error {
    constructor(message?: string);
}
export declare type DoneFunc = () => boolean;
export declare type DoOnceFunc = (throwErrorOnDuplicated?: boolean) => void;
export declare type ResetFunc = () => void;
export declare type UseOnlyOnceReturn = [DoneFunc, DoOnceFunc, ResetFunc];
/**
 * 标记缓存, 用于那些只初始化/使用一次的内容
 */
export declare function useOnlyOnce(): UseOnlyOnceReturn;
/**
 * 停止计时器
 */
export declare type FinishFunc = () => void;
/**
 * 设置定时器
 * @param callback 回调
 * @param ms 毫秒计时
 * @return {@link setTimeout的返回值}
 */
export declare type SetTimerFunc = (callback: Function, ms?: number) => number;
/**
 * 当前定时器是否启动
 */
export declare type IsStartedFunc = () => boolean;
export declare type UseTimerReturn = [IsStartedFunc, SetTimerFunc, FinishFunc];
/**
 * 计时器
 * @param withAutoResourceManagement 是否自动关闭计时器
 */
export declare function useTimer(withAutoResourceManagement?: boolean): UseTimerReturn;
export declare type SetState<T> = Dispatch<SetStateAction<T>>;
export declare type SetStateProxy<T> = SetState<T>;
export declare type UseStateProxyReturn<T> = [T, StatelessWrapper<T>, SetStateProxy<T>];
export declare function useStateProxy<T>(defaultValue?: T): UseStateProxyReturn<T>;
