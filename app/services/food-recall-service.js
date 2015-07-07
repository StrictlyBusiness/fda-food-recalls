import Promise from 'bluebird';

import statesDataset from '../data/states.json!';

export default class FoodRecallService {

  static get $inject() { return ['openFdaService', 'cacheService']; }

  constructor(openFdaService, cacheService) {
    this.openFdaService = openFdaService;
    this.cacheService = cacheService;

    this.EVENT_PROPERTIES = [
      'event_id', 'recall_number', '@epoch', 'reason_for_recall', 'status', 'classification',
      'recalling_firm', 'city', 'state', 'country', 'report_date', 'recall_initiation_date',
      'voluntary_mandated', 'initial_firm_notification', 'distribution_pattern'
    ];

    this.PRODUCT_PROPERTIES = [
      '@id', 'product_quantity', 'product_type', 'product_description', 'code_info'
    ];
  }

  // startDate and endDate should be moment objects
  getRecallsForPeriod(startDate, endDate) {

    // prepare the search criteria dates
    let start = startDate.format('YYYYMMDD');
    let end = endDate.format('YYYYMMDD');

    // See if the data is cached
    let queryCacheType = 'getRecallsForPeriod';
    let queryCacheKey = `${start}-${end}`;
    let cachedResults = this.cacheService.fetch(queryCacheType, queryCacheKey);
    if (cachedResults) {
      return Promise.resolve(cachedResults);
    }

    // Since it wasn't cached, query for it and process the results
    return this.openFdaService
      .query({
        search: 'report_date:[' + start + ' TO ' + end + ']'
      })
      .then(
        (results) => {
          // Process the results
          let processedResults = this.aggregateIntoEvents(results.results);
          // Cache the results
          this.cacheService.store(queryCacheType, queryCacheKey, processedResults);
          return processedResults;
        },
        (error) => {
          if (error.status === 404) {
            return [];
          }
          return Promise.reject(error);
        });
  }

  // aggregate all recalls that share the same event id into a single objects
  aggregateIntoEvents(data) {

    // Build a map of the events
    let eventMap = data.reduce(
      (events, recall) => {
        // See if we have already created this event
        let event = events[recall.event_id];
        if (!event) {
          event = {};
          // Copy over the event specific properties
          this.EVENT_PROPERTIES.forEach((property) => {
            event[property] = recall[property];
          });
          event.distribution_states = this.getDistributionStates(event); // eslint-disable-line camelcase
          event.products = [];
          events[recall.event_id] = event;
        }

        // Copy over the product specific proeprties
        let product = {};
        this.PRODUCT_PROPERTIES.forEach((property) => {
          product[property] = recall[property];
        });

        // Add the product to the recall event
        event.products.push(product);

        return events;
      }, {});

    // Convert the object property map to an array of the values
    let results = Object.keys(eventMap).map(key => eventMap[key]);

    return results;
  }

  // Based on the events distribution_pattern, this method attempts to build
  // an array of state names.
  getDistributionStates(event) {

    let result = [];

    // for each state, see if it matches
    statesDataset.forEach((state) => {
      if (this.appliesToState(state, event)) {
        // if it does, add it to the recall list
        result.push(state.abbr);
      }
    });

    return result;
  }

  // Basic function to check if a recall applies to a state. This will be
  // updated to apply more sophisticated matching.
  appliesToState(state, recall) {

    if (recall.distribution_pattern) {

      // Check the state name
      let nameExpression = new RegExp(`\\b${state.name.replace(' ', '\\s')}\\b`, 'gi');
      // Do a special check for Virginia since west virginia also includes virginia
      if (state.abbr === 'VA') {
        nameExpression = new RegExp(`^(West)\\b${state.name.replace(' ', '\\s')}\\b`, 'gi');
      }
      if (recall.distribution_pattern.match(nameExpression) !== null) {
        return true;
      }

      // Check for the state abbreviation (must be upper case)
      let abbrExpression = new RegExp(`\\b${state.abbr}\\b`, 'g');
      if (recall.distribution_pattern.match(abbrExpression) !== null) {
        return true;
      }

      // Check for the string nationwide (for all states)
      let nationwideExpression = new RegExp(`\\bnationwide\\b`, 'gi');
      if (recall.distribution_pattern.match(nationwideExpression) !== null) {
        return true;
      }
    }

    // Assume it doesn't match
    return false;
  }

}
