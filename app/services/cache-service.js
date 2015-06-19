export default class CacheService {

  static get $inject() { return []; }

  constructor() {
    this.clearAll();
  }

  store(type, key, value) {
    let typeCache = this.cache[type];
    if (!typeCache) {
      typeCache = {};
      this.cache[type] = typeCache;
    }
    typeCache[key] = value;
  }

  fetch(type, key) {
    let typeCache = this.cache[type];
    if (typeCache) {
      return typeCache[key];
    }
    return typeCache;
  }

  remove(type, key) {
    let value;
    let typeCache = this.cache[type];
    if (typeCache) {
      value = typeCache[key];
      delete typeCache[key];
    }
    return value;
  }

  clear(type) {
    this.cache[type] = {};
  }

  clearAll() {
    this.cache = {};
  }

}
