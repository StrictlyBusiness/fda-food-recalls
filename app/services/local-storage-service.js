import angular from 'angular';

export default class LocalStorageService {

  static get $inject() { return [ '$window' ]; }

  constructor($window) {
    this.localStorage = $window.localStorage;
  }

  get(key, defaultValue) {
    let json = this.localStorage.getItem(key);
    if (json == null && angular.isDefined(defaultValue)) {
      return defaultValue;
    } else {
      return angular.fromJson(json);
    }
  }

  set(key, item) {
    var json = angular.toJson(item);
    this.localStorage.setItem(key, json);
  }

  remove(key) {
    this.localStorage.removeItem(key);
  }

  clear() {
    this.localStorage.clear();
  }

}
