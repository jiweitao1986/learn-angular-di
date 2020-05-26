import { Type } from './types';
import { stringify, getClosureSafeProperty } from './utils';

const __forward_ref__ = getClosureSafeProperty({__forward_ref__: getClosureSafeProperty});

export function resolveForwardRef<T>(type: T): T {
  return isForwardRef(type) ? type() : type;
}

export interface ForwardRefFn {
  (): any;
}

export function forwardRef(forwardRefFn: ForwardRefFn): Type<any> {
  (forwardRefFn as any).__forward_ref__ = forwardRef;
  (forwardRefFn as any).toString = function() {
    return stringify(this());
  };
  return (forwardRefFn as any as Type<any>);
}

export function isForwardRef(fn: any): fn is() => any {
  return typeof fn === 'function' && fn.hasOwnProperty(__forward_ref__) &&
      fn.__forward_ref__ === forwardRef;
}
