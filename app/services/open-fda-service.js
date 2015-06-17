export default class OpenFdaService {

  static get $inject() { return ['API_INFO', '$http' ]; }

  constructor(API_INFO, $http) {
    this.api = API_INFO;
    this.$http = $http;
  }

}
