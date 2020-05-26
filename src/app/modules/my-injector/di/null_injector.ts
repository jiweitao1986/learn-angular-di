import { stringify } from './utils';
import { Injector } from './injector';

const _THROW_IF_NOT_FOUND = {};
export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;

/**
 * NullInjecto定义
 */
export class NullInjector implements Injector {

  get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
    if (notFoundValue === THROW_IF_NOT_FOUND) {
      const error = new Error(`NullInjectorError: No provider for ${stringify(token)}!`);
      error.name = 'NullInjectorError';
      throw error;
    }
    return notFoundValue;
  }

}

/**
 * 全局NullInjector实例
 */
export const NULL_INJECTOR: Injector = new NullInjector();
