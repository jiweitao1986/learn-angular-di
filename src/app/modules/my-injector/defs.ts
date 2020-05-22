/**
 * 注入标志
 */
export enum InjectFlags {

  /**
   * 检查当前Injector，找不到时向上检查父Injector
   */
  Default = 0b0000,

  /**
   * 仅检查当前Injector
   */
  Self = 0b0010,

  /**
   * 跳过当前Injector，从父开始
   */
  SkipSelf = 0b0100,

  /**
   * 找不到时，返回defaultValue
   */
  Optional = 0b1000,
}
