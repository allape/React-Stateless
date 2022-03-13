var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useCallback, useEffect, useState } from 'react';
/**
 * 手动更新修改的state的state, 类似于useState, 但是不会自动触发依赖更改
 * @param defaultValue 默认值
 */
export default function useStateless(defaultValue) {
    var _a = useState({
        value: defaultValue,
        lastModifiedTime: Date.now(),
    }), stateless = _a[0], setStateless = _a[1];
    var triggerChange = useCallback(function () {
        setStateless(function (old) { return (__assign(__assign({}, old), { lastModifiedTime: Date.now() })); });
    }, []);
    return [stateless, triggerChange];
}
// endregion
// region useOnlyOnce
var UseOnlyOnceDuplicatedError = /** @class */ (function (_super) {
    __extends(UseOnlyOnceDuplicatedError, _super);
    function UseOnlyOnceDuplicatedError(message) {
        return _super.call(this, message || 'useOnlyOnce duplicated error') || this;
    }
    return UseOnlyOnceDuplicatedError;
}(Error));
export { UseOnlyOnceDuplicatedError };
/**
 * 标记缓存, 用于那些只初始化/使用一次的内容
 */
export function useOnlyOnce() {
    var cache = useState([])[0];
    var done = useCallback(function () {
        return cache.length > 0;
    }, [cache]);
    var doOnce = useCallback(function (throwErrorOnDuplicated) {
        if (throwErrorOnDuplicated === void 0) { throwErrorOnDuplicated = true; }
        if (throwErrorOnDuplicated && cache.length > 0) {
            throw new UseOnlyOnceDuplicatedError();
        }
        cache.push(Date.now());
    }, [cache]);
    var reset = useCallback(function () {
        cache.splice(0, cache.length);
    }, [cache]);
    return [done, doOnce, reset];
}
/**
 * 计时器
 * @param withAutoResourceManagement 是否自动关闭计时器
 */
export function useTimer(withAutoResourceManagement) {
    if (withAutoResourceManagement === void 0) { withAutoResourceManagement = true; }
    // 用于标记当前启动了计时器, 避免重复启动
    var _a = useOnlyOnce(), done = _a[0], doOnce = _a[1], reset = _a[2];
    // 当前启动了的计时器的ID
    var timeoutId = useStateless(-1)[0];
    var setTimeoutFunc = useCallback(function (callback, ms) {
        if (ms === void 0) { ms = 0; }
        if (!done()) {
            doOnce();
            timeoutId.value = setTimeout(function () {
                reset();
                callback();
            }, ms);
        }
        return timeoutId.value;
    }, [done, doOnce, reset, timeoutId]);
    var finishFunc = useCallback(function () {
        clearTimeout(timeoutId.value);
        reset();
    }, [reset, timeoutId]);
    useEffect(function () {
        return function () {
            if (withAutoResourceManagement) {
                finishFunc();
            }
        };
    }, [withAutoResourceManagement, finishFunc]);
    return [done, setTimeoutFunc, finishFunc];
}
export function useStateProxy(defaultValue) {
    if (typeof defaultValue === 'function') {
        console.warn('useStateProxy may produce an error when value is a function, use useCallback instead.');
    }
    var _a = useState(defaultValue), state = _a[0], setState = _a[1];
    var stateProxy = useStateless(state)[0];
    var setStateProxy = useCallback(function (value) {
        if (typeof value === 'function') {
            setState(function (old) {
                var newValue = value(old);
                stateProxy.value = newValue;
                return newValue;
            });
        }
        else {
            stateProxy.value = value;
            setState(value);
        }
    }, [stateProxy]);
    return [state, stateProxy, setStateProxy];
}
// endregion
