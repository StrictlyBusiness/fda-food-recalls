import Promise from 'bluebird';

import statesDataset from '../data/states.json!';

export default class FoodRecallService {

  static get $inject() { return ['openFdaService']; }

  constructor(openFdaService) {
    this.openFdaService = openFdaService;

    // The key and state name/abbr for unmatched recalls
    this.UNMATCHED = 'Unmatched';
  }

  // startDate and endDate should be moment objects
  getRecallsByState(startDate, endDate) {

    // prepare the search criteria dates
    let start = startDate.format('YYYYMMDD');
    let end = endDate.format('YYYYMMDD');

    // get the data from the service and process it and return the results
    return this.openFdaService
      .query({
        search: 'report_date:[' + start + ' TO ' + end + ']',
        limit: 100
      })
      .then(
        (results) => this.processStatesForRecalls(results.results),
        (error) => {
          if (error.status === 404) {
            return this.processStatesForRecalls([]);
          }
          return Promise.reject(error);
        });
  }

  // for each recall, add a states array and set the states based on processing
  // the distribution pattern
  processStatesForRecalls(data) {

    // loop over all the recalls passed in
    data.forEach((recall) => {
      // add an array to store the states
      recall.states = [];
      // for each state, see if it matches
      statesDataset.forEach((state) => {
        if (this.appliesToState(state, recall)) {
          // if it does, add it to the recall list
          recall.states.push(state.abbr);
        }
      });
    });

    return data;
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

      // Check for the state abbreviation
      let abbrExpression = new RegExp(`\\b${state.abbr}\\b`, 'gi');
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

  createResultsMap() {

    let map = { };

    // add a map entry for unmatched entries
    map[this.UNMATCHED] = {
      state: {
        name: this.UNMATCHED,
        abbr: this.UNMATCHED
      },
      count: 0,
      recalls: []
    };

    // Add a map entry for each state
    statesDataset.forEach((state) => {
      map[state.abbr] = {
        state: state,
        count: 0,
        recalls: []
      };
    });

    return map;
  }

}
