import moment from 'moment';

import states from 'app/data/states.json!';
import recallClassificationsDataset from 'app/data/recall-classifications.json!';
import recallStatusesDataset from 'app/data/recall-statuses.json!';

export default class MapController {

  static get $inject() { return ['recalls', '$state', '$stateParams', '$scope', 'API_INFO']; }

  constructor(recalls, $state, $stateParams, $scope, API_INFO) {

    this.recalls = recalls;
    this.productCount = recalls.reduce((prev, recall) => prev += recall.products.length, 0);

    this.criteria = {
      month: parseInt($stateParams.month, 10),
      year: parseInt($stateParams.year, 10),
      classification: $stateParams.classification,
      status: $stateParams.status,
      groupBy: $stateParams.groupBy,
      countBy: $stateParams.countBy,
      selectedState: $stateParams.state
    };

    $scope.$watch(() => this.criteria.groupBy, (groupBy) => {
      this.recallsByState = this.getRecallsByState(this.recalls, groupBy);
      this.selectedState = this.recallsByState[this.criteria.selectedState];
    });
    this.recallsByState = this.getRecallsByState(this.recalls, this.criteria.groupBy);

    let ctrl = this; // Need as $scope.$on does not bind to correct context even with an arrow function
    this.selectedState = $stateParams.state ? this.recallsByState[$stateParams.state] : null;
    $scope.$on('selectedState', (e, selectedStateAbbr) => {
      ctrl.criteria.selectedState = selectedStateAbbr;
      ctrl.selectedState = ctrl.recallsByState[selectedStateAbbr];
      $state.go('.', {state: selectedStateAbbr});
    });

    this.$state = $state;
    this.API_INFO = API_INFO;

    // Build a structure for the momths
    this.months = [];
    for(let month = 0; month < 12; month++) {
      let date = moment().month(month);
      this.months.push({
        month: month + 1,
        name: date.format('MMM')
      });
    }

    // Build a structure for the valid years
    this.years = [ ];
    for(let year = 2012; year <= moment().year(); year++) {
      this.years.push(year);
    }

    // Build a structure for the classifications
    this.classifications = Object.keys(recallClassificationsDataset);

    // Build a structure for the statuses
    this.statuses = Object.keys(recallStatusesDataset);
  }

  getRecallsByState(recalls, groupBy) {
    // Create map keyed by state abbreviation (ex. 'WV')
    let recallsByState = states.reduce((prev, item) => {
        if (!(item.abbr in prev)) {
          prev[item.abbr] = {
              abbreviation: item.abbr,
              name: item.name,
              recalls: [],
              productCount: 0
          };
        }
        return prev;
    }, {});

     let addRecallToState = (stateAbbr, recall) => {
      if (stateAbbr in recallsByState) {
        recallsByState[stateAbbr].recalls.push(recall);
        recallsByState[stateAbbr].productCount += recall.products.length;
      } else {
        recallsByState[stateAbbr] = {
          name: 'name',
          abbreviation: 'unknown',
          recalls: [recall],
          productCount: recall.products.length
        };
      }
    };

    // Add recalls to each state (or "unknown" state)
    recalls.forEach(r => {
      if (groupBy === 'origination') {
        addRecallToState(r.state || 'unknown', r);
      } else {
        // console.log('recalls', recalls);
        // console.log('r.states', r.states);
        r.distribution_states.forEach(s => addRecallToState(s, r));
      }
    });

    return recallsByState;
  }

  setFilter(name, value, reload = false) {
    this.criteria[name] = value;
    return this.$state.go('.', { [name]: value }, { reload: reload });
  }

  isFilterActive(name, value) {
    return this.criteria[name] === value;
  }

}
