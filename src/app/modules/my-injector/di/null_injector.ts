import { stringify } from './utils';
import { THROW_IF_NOT_FOUND } from './consts';
import { Injector } from './injector';


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


export const NULL_INJECTOR: Injector = new NullInjector();
