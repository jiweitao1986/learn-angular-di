import { Type, AbstractType, InjectFlags } from './types';
import { InjectionToken } from './injection_token';

/**
 * 注入器抽象类
 */
export abstract class Injector {

  abstract get<T>(
      token: Type<T>|InjectionToken<T>|AbstractType<T>,
      notFoundValue?: T,
      flags?: InjectFlags
  ): T;

  abstract get(token: any, notFoundValue?: any): any;

}
