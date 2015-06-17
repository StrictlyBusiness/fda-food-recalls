export default class MapController {

  static get $inject() { return ['$scope'] };
  
  constructor($scope) {
    this.$scope = $scope;
  }

}
