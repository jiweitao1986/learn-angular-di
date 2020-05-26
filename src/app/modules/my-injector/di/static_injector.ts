import {
  Type, IDENT, EMPTY, CIRCULAR, MULTI_PROVIDER_FN, NO_NEW_LINE, NEW_LINE,
  InjectFlags, OptionFlags, Record, DependencyRecord
} from './types';
import { stringify, getClosureSafeProperty } from './utils';
import { Injector } from './injector';
import { NULL_INJECTOR, NullInjector} from './null_injector';
import {
  ValueProvider, StaticClassProvider, ConstructorProvider,  ExistingProvider, FactoryProvider,
  StaticProvider, SupportedProvider,
} from './providers';
import { InjectionToken } from './injection_token';
import { getInjectableDef } from './injectable_def';
import { resolveForwardRef } from './forward_ref';


export const INJECTOR = new InjectionToken<Injector>('INJECTOR', -1 as any);

export const USE_VALUE =  getClosureSafeProperty<ValueProvider>({provide: String, useValue: getClosureSafeProperty});

let _currentInjector: Injector|undefined|null = undefined;

export function setCurrentInjector(injector: Injector|null|undefined): Injector|undefined|null {
  const former = _currentInjector;
  _currentInjector = injector;
  return former;
}


export class StaticInjector implements Injector {

  /**
   * 父Injector
   */
  readonly parent: Injector;

  /**
   * source
   */
  readonly source: string|null;

  /**
   * scope
   */
  readonly scope: string|null;

  /**
   * _records
   */
  private _records: Map<any, Record|null>;

  constructor(
    providers: StaticProvider[],
    parent: Injector = NULL_INJECTOR,
    source: string|null = null
  ) {
    this.parent = parent;
    this.source = source;
    const records = this._records = new Map<any, Record>();

    records.set(Injector, {token: Injector, fn: IDENT, deps: EMPTY, value: this, useNew: false} as Record);
    records.set(INJECTOR, {token: INJECTOR, fn: IDENT, deps: EMPTY, value: this, useNew: false} as Record);
    this.scope = recursivelyProcessProviders(records, providers);
  }

  get<T>(token: Type<T>|InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  get(token: any, notFoundValue?: any): any;
  get(token: any, notFoundValue?: any, flags: InjectFlags = InjectFlags.Default): any {
    const records = this._records;
    let record = records.get(token);
    if (record === undefined) {
      const injectableDef = getInjectableDef(token);
      if (injectableDef) {
        const providedIn = injectableDef && injectableDef.providedIn;
        if (providedIn === 'any' || providedIn != null && providedIn === this.scope) {
          records.set(
            token,
            record = resolveProvider({provide: token, useFactory: injectableDef.factory, deps: EMPTY})
          );
        }
      }
      if (record === undefined) {
        records.set(token, null);
      }
    }
    let lastInjector = setCurrentInjector(this);
    try {
      return tryResolveToken(token, record, records, this.parent, notFoundValue, flags);
    } catch (e) {
      return new Error('Token Not Found');
    } finally {
      setCurrentInjector(lastInjector);
    }
  }

  toString() {
    const tokens = [] as string[];
    const  records = this._records;
    records.forEach((v, token) => tokens.push(stringify(token)));
    return `StaticInjector[${tokens.join(', ')}]`;
  }
}


function multiProviderMixError(token: any) {
  return staticError('Cannot mix multi providers and regular providers', token);
}

export const INJECTOR_SCOPE = new InjectionToken<'root'|'platform'|null>('Set Injector scope.');


/**
 * 递归处理Provider
 */
function recursivelyProcessProviders(records: Map<any, Record>, provider: StaticProvider): string | null {
  let scope: string|null = null;
  if (provider) {
    provider = resolveForwardRef(provider);
    if (Array.isArray(provider)) {

      for (let i = 0; i < provider.length; i++) {
        scope = recursivelyProcessProviders(records, provider[i]) || scope;
      }
    } else if (typeof provider === 'function') {

      throw staticError('Function/Class not supported', provider);
    } else if (provider && typeof provider === 'object' && provider.provide) {

      let token = resolveForwardRef(provider.provide);
      const resolvedProvider = resolveProvider(provider);

      // multi
      if (provider.multi === true) {
        let multiProvider: Record|undefined = records.get(token);
        if (multiProvider) {
          if (multiProvider.fn !== MULTI_PROVIDER_FN) {
            throw multiProviderMixError(token);
          }
        } else {
          records.set(token, multiProvider = {
            token: provider.provide,
            deps: [],
            useNew: false,
            fn: MULTI_PROVIDER_FN,
            value: EMPTY
          } as Record);
        }
        token = provider;
        multiProvider.deps.push({token, options: OptionFlags.Default});
      }

      const record = records.get(token);
      if (record && record.fn === MULTI_PROVIDER_FN) {
        throw multiProviderMixError(token);
      }
      if (token === INJECTOR_SCOPE) {
        scope = resolvedProvider.value;
      }
      records.set(token, resolvedProvider);
    } else {
      throw staticError('Unexpected provider', provider);
    }
  }
  return scope;
}

function resolveProvider(provider: SupportedProvider): Record {
  const deps = computeDeps(provider);
  let fn: Function = IDENT;
  let value: any = EMPTY;
  let useNew: boolean = false;
  let provide = resolveForwardRef(provider.provide);

  if (USE_VALUE in provider) {

    value = (provider as ValueProvider).useValue;
  } else if ((provider as FactoryProvider).useFactory) {

    fn = (provider as FactoryProvider).useFactory;
  } else if ((provider as ExistingProvider).useExisting) {

    // Just use IDENT
  } else if ((provider as StaticClassProvider).useClass) {

    // 静态类型
    useNew = true;
    fn = resolveForwardRef((provider as StaticClassProvider).useClass);
  } else if (typeof provide === 'function') {

    // 构造函数
    useNew = true;
    fn = provide;
  } else {
    throw staticError(
        'StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable',
        provider);
  }
  return {deps, fn, useNew, value};
}

/**
 * 计算依赖
 */
function computeDeps(provider: StaticProvider): DependencyRecord[] {
  let deps: DependencyRecord[] = EMPTY;
  const providerDeps: any[] = (provider as ExistingProvider & StaticClassProvider & ConstructorProvider).deps;

  if (providerDeps && providerDeps.length) {
    deps = [];
    for (let i = 0; i < providerDeps.length; i++) {
      const options = OptionFlags.Default;
      const token = resolveForwardRef(providerDeps[i]);
      deps.push({token, options});
    }
  } else if ((provider as ExistingProvider).useExisting) {
    const token = resolveForwardRef((provider as ExistingProvider).useExisting);
    deps = [{token, options: OptionFlags.Default}];
  } else if (!providerDeps && !(USE_VALUE in provider)) {
    // useValue & useExisting are the only ones which are exempt from deps all others need it.
    throw staticError('\'deps\' required', provider);
  }
  return deps;
}



function staticError(text: string, obj: any): Error {
  return new Error(formatError(text, obj, 'StaticInjectorError'));
}

export function formatError(
  text: string, obj: any, injectorErrorName: string, source: string|null = null): string {
text = text && text.charAt(0) === '\n' && text.charAt(1) == NO_NEW_LINE ? text.substr(2) : text;
let context = stringify(obj);
if (Array.isArray(obj)) {
  context = obj.map(stringify).join(' -> ');
} else if (typeof obj === 'object') {
  let parts = <string[]>[];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];
      parts.push(
          key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
    }
  }
  context = `{${parts.join(', ')}}`;
}
return `${injectorErrorName}${source ? '(' + source + ')' : ''}[${context}]: ${
    text.replace(NEW_LINE, '\n  ')}`;
}






export const NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';


function tryResolveToken(
  token: any,
  record: Record|undefined|null,
  records: Map<any, Record|null>,
  parent: Injector,
  notFoundValue: any,
  flags: InjectFlags
): any {
  try {
    return resolveToken(token, record, records, parent, notFoundValue, flags);
  } catch (e) {
    if (!(e instanceof Error)) {
      e = new Error(e);
    }
    const path: any[] = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
    path.unshift(token);

    // 清空循环引用的值
    if (record && record.value === CIRCULAR) {
      record.value = EMPTY;
    }
    throw e;
  }
}


const _THROW_IF_NOT_FOUND = {};
export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;

function resolveToken(
  token: any,
  record: Record|undefined|null,
  records: Map<any, Record|null>,
  parent: Injector,
  notFoundValue: any,
  flags: InjectFlags
): any {

  let value;
  if (record && !(flags & InjectFlags.SkipSelf)) {
    
    // 
    
    value = record.value;
    if (value === CIRCULAR) {
      throw Error(NO_NEW_LINE + 'Circular dependency');
    } else if (value === EMPTY) {
      record.value = CIRCULAR;
      let obj = undefined;
      let useNew = record.useNew;
      let fn = record.fn;
      let depRecords = record.deps;
      let deps = EMPTY;
      if (depRecords.length) {
        deps = [];
        for (let i = 0; i < depRecords.length; i++) {
          const depRecord: DependencyRecord = depRecords[i];
          const options = depRecord.options;
          const childRecord = options & OptionFlags.CheckSelf ? records.get(depRecord.token) : undefined;
          deps.push(
            tryResolveToken(
              depRecord.token,
              childRecord,
              records,
              !childRecord && !(options & OptionFlags.CheckParent) ? NULL_INJECTOR : parent,
              options & OptionFlags.Optional ? null : THROW_IF_NOT_FOUND,
              InjectFlags.Default
            )
          );
        }
      }
      record.value = value = useNew ? new (fn as any)(...deps) : fn.apply(obj, deps);
    }
  } else if (!(flags & InjectFlags.Self)) {

    value = parent.get(token, notFoundValue, InjectFlags.Default);
  } else if (!(flags & InjectFlags.Optional)) {

    value = NULL_INJECTOR.get(token, notFoundValue);
  } else {

    value = NULL_INJECTOR.get(token, typeof notFoundValue !== 'undefined' ? notFoundValue : null);
  }
  return value;
}
