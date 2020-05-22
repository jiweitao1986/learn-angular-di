import { Type, AbstractType, InjectFlags } from './type';
import { InjectionToken } from './injection_token';

/**
 * 注入器抽象类
 */
export abstract class Injector {

  /**
   * 根据token获取注入的实例
   * @returns 返回token对应的实例，或者notFoundValue指定的值
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   */
  abstract get<T>(
      token: Type<T>|InjectionToken<T>|AbstractType<T>,
      notFoundValue?: T,
      flags?: InjectFlags
  ): T;

}
