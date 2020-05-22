import { Type } from './type';

/**
 * A type which has an `InjectorDef` static field.
 *
 * `InjectorDefTypes` can be used to configure a `StaticInjector`.
 *
 * @publicApi
 */
export interface InjectorType<T> extends Type<T> {

  /**
   * Opaque type whose structure is highly version dependent. Do not rely on any properties.
   */
  ɵinj: never;

}


/**
 * Information about how a type or `InjectionToken` interfaces with the DI system.
 *
 * At a minimum, this includes a `factory` which defines how to create the given type `T`, possibly
 * requesting injection of other types if necessary.
 *
 * Optionally, a `providedIn` parameter specifies that the given type belongs to a particular
 * `InjectorDef`, `NgModule`, or a special scope (e.g. `'root'`). A value of `null` indicates
 * that the injectable does not belong to any scope.
 */
export interface ɵɵInjectableDef<T> {

  /**
   * Specifies that the given type belongs to a particular injector:
   * - `InjectorType` such as `NgModule`,
   * - `'root'` the root injector
   * - `'any'` all injectors.
   * - `null`, does not belong to any injector. Must be explicitly listed in the injector
   *   `providers`.
   */
  providedIn: InjectorType<any>|'root'|'platform'|'any'|null;

  /**
   * The token to which this definition belongs.
   *
   * Note that this may not be the same as the type that the `factory` will create.
   */
  token: unknown;

  /**
   * Factory method to execute to create an instance of the injectable.
   */
  factory: (t?: Type<any>) => T;

  /**
   * In a case of no explicit injector, a location where the instance of the injectable is stored.
   */
  value: T|undefined;
}


export function ɵɵdefineInjectable<T>(opts: {
  token: unknown,
  providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T,
}): never {
  return ({
    token: opts.token,
    providedIn: opts.providedIn as any || null,
    factory: opts.factory,
    value: undefined,
  } as ɵɵInjectableDef<T>) as never;
}


export class InjectionToken<T> {

  readonly ngMetadataName = 'InjectionToken';

  readonly ɵprov: never|undefined;

  constructor(
    protected _desc: string,
    options?: { providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T }
  ) {
    this.ɵprov = undefined;
    if (typeof options === 'number') {
      (this as any).__NG_ELEMENT_ID__ = options;
    } else if (options !== undefined) {
      this.ɵprov = ɵɵdefineInjectable({
        token: this,
        providedIn: options.providedIn || 'root',
        factory: options.factory,
      });
    }
  }

  toString(): string {
    return `InjectionToken ${this._desc}`;
  }
}