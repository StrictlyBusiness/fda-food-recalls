import angular from 'angular';
import Promise from 'bluebird';

export default class OpenFdaService {

  static get $inject() { return ['API_INFO', '$http', '$log']; }

  static get maxResultsLimit() { return 100; }

  static get requestsPerInterval() { return 3; }
  static get intervalPeriodInMs() { return 500; }

  constructor(API_INFO, $http, $log) {
    this.api = API_INFO;
    this.$http = $http;
    this.$log = $log;
  }

  query(criteria) {

    // We can only query for 100 at a time, so get the first 100. The metadata
    // lets us know how many results there are total. Begin batch querying for
    // the other results.
    return this.queryForPage(criteria, 1)
      .then((results) => {
        let totalResults = results.meta.results.total;
        let pages = Math.floor((totalResults - 1) / OpenFdaService.maxResultsLimit) + 1;

        let queryPromises = [];
        /*eslint-disable no-loop-func */
        for(let i = 2; i <= pages; i++) {
          queryPromises.push(
            Promise.delay(
              Math.floor(i / OpenFdaService.requestsPerInterval) * OpenFdaService.intervalPeriodInMs) // Delay each 3 by 1 second
            .then(() => this.queryForPage(criteria, i)
              .then((pageResults) => {
                this.$log.debug(`Delayed page ${i} by ${Math.floor(i / OpenFdaService.requestsPerInterval) * OpenFdaService.intervalPeriodInMs} ms`);
                Array.prototype.push.apply(results.results, pageResults.results);
                return results;
              })
            )
          );
        }
        /*eslint-enable no-loop-func */

        return Promise.all(queryPromises)
          .then(() => results); // return the results structure
      });
  }

  // The page value is 1 based
  queryForPage(criteria, page) {

    // Build the basic config for the request
    let config = this.buildConfig(criteria);
    // Set the skip so we start at the correct page
    config.params.skip = (page - 1) * OpenFdaService.maxResultsLimit;

    // Perform the query and return the results
    this.$log.debug(`OpenFdaService querying page ${page}: ${JSON.stringify(criteria)}`);
    let startTime = window.performance.now();
    return this.$http
      .get(this.api.url, config)
      .then((response) => {
        this.$log.debug(`OpenFdaService completed page ${page} ${window.performance.now() - startTime}ms: ${JSON.stringify(criteria)}`);
        return response.data;
      });

  }

  buildConfig(criteria) {
    // Add the api and the default the limit to the max
    let params = angular.extend({
        'api_key': this.api.key,
        'limit': OpenFdaService.maxResultsLimit
      },
      criteria);

    // Build the config structure
    return {
      params: params
    };
  }

}
