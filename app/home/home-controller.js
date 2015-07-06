import angular from 'angular';

export default class HomeController {

  static get $inject() { return ['$scope', 'localStorage']; }

  constructor($scope, localStorage) {
    this.$scope = $scope;
    this.localStorage = localStorage;
  }

  get isIntroDisplayed() {
    if (angular.isUndefined(this.introDisplayed)) {
      this.introDisplayed = this.localStorage.get('introDisplayed', true);
    }
    return this.introDisplayed;
  }

  set isIntroDisplayed(visible) {
    this.introDisplayed = visible;
    this.localStorage.set('introDisplayed', this.introDisplayed);
  }

}
