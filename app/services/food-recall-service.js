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
      .then((results) => this.processRecallsByState(results));
  }

  processRecallsByState(data) {

    // create a map by state
    let results = this.createResultsMap();

    // loop over all the recalls passed in
    data.results.forEach((recall) => {

      let isMatched = false;

      // for each state, see if it matches
      this.createStateList().forEach((state) => {
        if (this.appliesToState(state, recall)) {
          isMatched = true;
          results[state.abbr].count++;
          results[state.abbr].recalls.push(recall);
        }
      });

      // if we didn't match a state, add it to unmatched item
      if (!isMatched) {
        results[this.UNMATCHED].count++;
        results[this.UNMATCHED].recalls.push(recall);
      }

    });

    return results;
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
    this.createStateList().forEach((state) => {
      map[state.abbr] = {
        state: state,
        count: 0,
        recalls: []
      };
    });

    return map;
  }

  createStateList() {
    return [
      { name: 'Alabama', abbr: 'AL' },
      { name: 'Alaska', abbr: 'AK' },
      { name: 'Arizona', abbr: 'AZ' },
      { name: 'Arkansas', abbr: 'AR' },
      { name: 'Colorado', abbr: 'CO' },
      { name: 'California', abbr: 'CA' },
      { name: 'Connecticut', abbr: 'CT' },
      { name: 'Delaware', abbr: 'DE' },
      { name: 'District of Columbia', abbr: 'DC' },
      { name: 'Florida', abbr: 'FL' },
      { name: 'Georgia', abbr: 'GA' },
      { name: 'Hawaii', abbr: 'HI' },
      { name: 'Idaho', abbr: 'ID' },
      { name: 'Illinois', abbr: 'IL' },
      { name: 'Indiana', abbr: 'IN' },
      { name: 'Iowa', abbr: 'IA' },
      { name: 'Kansas', abbr: 'KS' },
      { name: 'Kentucky', abbr: 'KY' },
      { name: 'Louisiana', abbr: 'LA' },
      { name: 'Maine', abbr: 'ME' },
      { name: 'Maryland', abbr: 'MD' },
      { name: 'Massachusetts', abbr: 'MA' },
      { name: 'Michigan', abbr: 'MI' },
      { name: 'Minnesota', abbr: 'MN' },
      { name: 'Mississippi', abbr: 'MS' },
      { name: 'Missouri', abbr: 'MO' },
      { name: 'Montana', abbr: 'MT' },
      { name: 'Nebraska', abbr: 'NE' },
      { name: 'Nevada', abbr: 'NV' },
      { name: 'New Hampshire', abbr: 'NH' },
      { name: 'New Jersey', abbr: 'NJ' },
      { name: 'New Mexico', abbr: 'NM' },
      { name: 'New York', abbr: 'NY' },
      { name: 'North Carolina', abbr: 'NC' },
      { name: 'North Dakota', abbr: 'ND' },
      { name: 'Ohio', abbr: 'OH' },
      { name: 'Oklahoma', abbr: 'OK' },
      { name: 'Oregon', abbr: 'OR' },
      { name: 'Pennsylvania', abbr: 'PA' },
      { name: 'Rhode Island', abbr: 'RI' },
      { name: 'South Carolina', abbr: 'SC' },
      { name: 'South Dakota', abbr: 'SD' },
      { name: 'Tennessee', abbr: 'TN' },
      { name: 'Texas', abbr: 'TX' },
      { name: 'Utah', abbr: 'UT' },
      { name: 'Vermont', abbr: 'VT' },
      { name: 'Virginia', abbr: 'VA' },
      { name: 'Washington', abbr: 'WA' },
      { name: 'West Virginia', abbr: 'WV' },
      { name: 'Wisconsin', abbr: 'WI' },
      { name: 'Wyoming', abbr: 'WY' }
    ];

  }
}
