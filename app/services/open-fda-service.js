export default class OpenFdaService {

  static get $inject() { return ['API_INFO', '$http' ]; }

  constructor(API_INFO, $http) {
    this.api = API_INFO;
    this.$http = $http;
  }

  query(params) {

    let config = {
      params: params
    };

    return this.$http
      .get(this.api.url, config)
      .then((results) => results.data);
  }

}
