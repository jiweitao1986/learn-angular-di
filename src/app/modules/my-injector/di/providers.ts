import { Type } from './types';

/**
 * 值Provider
 */
export interface ValueProvider {

  provide: any;

  useValue: any;

  multi?: boolean;
}

/**
 * 类型Provider
 */
export interface StaticClassProvider {

  provide: any;

  useClass: Type<any>;

  deps: any[];

  multi?: boolean;
}

/**
 * 构造函数Provider
 */
export interface ConstructorProvider {

  provide: Type<any>;

  deps: any[];

  multi?: boolean;
}

/**
 * 转用已存在的Provider
 */
export interface ExistingProvider {

  provide: any;

  useExisting: any;

  multi?: boolean;
}

/**
 * 工厂注入器
 */
export interface FactoryProvider {

  provide: any;

  useFactory: Function;

  deps?: any[];

  multi?: boolean;
}

export type StaticProvider =
  ValueProvider | ExistingProvider | StaticClassProvider | ConstructorProvider | FactoryProvider | any[];

export type SupportedProvider =
    ValueProvider|ExistingProvider|StaticClassProvider|ConstructorProvider|FactoryProvider;
