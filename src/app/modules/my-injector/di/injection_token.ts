import { Type } from './types';
import { ɵɵdefineInjectable } from './injectable_def';


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
