export default class FoodRecallService {

  static get $inject() { return ['openFdaService']; }

  constructor(openFdaService) {
    this.openFdaService = openFdaService;
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

    // Create a map by state
    let results = this.createResultsMap();

    let states = this.createStateList();

    // Loop over all the recalls passed in
    data.results.forEach((recall) => {
      // For each state
      states.forEach((state) => {
        if (this.appliesToState(state, recall)) {
          results[state.abbr].count++;
        }
      });
    });

    return results;
  }

  // Basic function to check if a recall applies to a state. This will be
  // updated to apply more sophisticated matching.
  appliesToState(state, recall) {
    if (recall.distribution_pattern) {
      if (recall.distribution_pattern.indexOf(state.abbr) !== -1) {
        return true;
      } else if (recall.distribution_pattern.indexOf(state.name) !== -1) {
        return true;
      } else if (recall.distribution_pattern.indexOf('Nationwide') !== -1) {
        return true;
      }
    }
    return false;
  }

  createResultsMap() {

    let map = {};

    this.createStateList().forEach((state) => {
      map[state.abbr] = { state: state, count: 0 };
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
