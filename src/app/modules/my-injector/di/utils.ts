export function stringify(token: any): string {
  if (typeof token === 'string') {
    return token;
  }

  if (Array.isArray(token)) {
    return '[' + token.map(stringify).join(', ') + ']';
  }

  if (token == null) {
    return '' + token;
  }

  if (token.overriddenName) {
    return `${token.overriddenName}`;
  }

  if (token.name) {
    return `${token.name}`;
  }

  const res = token.toString();

  if (res == null) {
    return '' + res;
  }

  const newLineIndex = res.indexOf('\n');
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}


export function getClosureSafeProperty<T>(objWithPropertyToExtract: T): string {
  for (let key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === getClosureSafeProperty as any) {
      return key;
    }
  }
  throw Error('Could not find renamed property on target object.');
}