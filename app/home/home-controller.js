export default class HomeController {

  static get $inject() { return ['$scope'] };

  constructor($scope) {
    this.$scope = $scope;
  }

}
