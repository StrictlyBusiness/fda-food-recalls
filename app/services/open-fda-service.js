import angular from 'angular';

export default class OpenFdaService {

  static get $inject() { return ['API_INFO', '$http']; }

  constructor(API_INFO, $http) {
    this.api = API_INFO;
    this.$http = $http;
  }

  query(criteria) {

    // Build the query string params from the api_key and the criteria
    let params = angular.extend({
        'api_key': this.api.key
      },
      criteria);

    // Build the http config to pass the parameters
    let config = {
      params: params
    };

    return this.$http
      .get(this.api.url, config)
      .then((results) => results.data);
  }

}
