import { Injector } from './injector';
import { StaticInjector } from './static_injector';
import { StaticProvider } from './providers';

export function INJECTOR_IMPL__PRE_R3__(providers: StaticProvider[], parent: Injector|undefined, name: string) {
  return new StaticInjector(providers, parent, name);
}

export const INJECTOR_IMPL = INJECTOR_IMPL__PRE_R3__;

export function createInjector(
  options: StaticProvider[] | {providers: StaticProvider[], parent?: Injector, name?: string},
  parent?: Injector
): Injector {
  if (Array.isArray(options)) {
    return INJECTOR_IMPL(options, parent, '');
  } else {
    return INJECTOR_IMPL(options.providers, options.parent, options.name || '');
  }
}
