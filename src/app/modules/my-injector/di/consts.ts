export const EMPTY = [] as any[];

export const IDENT = function<T>(value: T): T {
  return value;
};

export const CIRCULAR = IDENT;

export const MULTI_PROVIDER_FN = function(): any[] {
  return Array.prototype.slice.call(arguments);
};

export const NEW_LINE = /\n/gm;

export const NO_NEW_LINE = 'ɵ';

const _THROW_IF_NOT_FOUND = {};

export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;

export const NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
