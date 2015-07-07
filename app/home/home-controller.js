import angular from 'angular';

export default class HomeController {

  static get $inject() { return ['$scope', 'localStorageService']; }

  constructor($scope, localStorageService) {
    this.$scope = $scope;
    this.localStorageService = localStorageService;
  }

  get isIntroDisplayed() {
    if (angular.isUndefined(this.introDisplayed)) {
      this.introDisplayed = this.localStorageService.get('introDisplayed', true);
    }
    return this.introDisplayed;
  }

  set isIntroDisplayed(visible) {
    this.introDisplayed = visible;
    this.localStorageService.set('introDisplayed', this.introDisplayed);
  }

}
