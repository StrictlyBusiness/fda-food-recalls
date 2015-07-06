import moment from 'moment';

import states from 'app/data/states.json!';
import recallClassificationsDataset from 'app/data/recall-classifications.json!';
import recallStatusesDataset from 'app/data/recall-statuses.json!';
import filterDescriptions from 'app/home/map/filter-descriptions.json!';

export default class MapController {

  static get $inject() { return ['recalls', '$state', '$stateParams', '$scope', 'API_INFO']; }

  constructor(recalls, $state, $stateParams, $scope, API_INFO) {

    this.$state = $state;
    this.API_INFO = API_INFO;
    this.filterDescriptions = filterDescriptions;
    this.recalls = recalls;
    this.productCount = recalls.reduce((prev, recall) => prev += recall.products.length, 0);

    this.filtersVisible = false;

    this.criteria = {
      month: parseInt($stateParams.month, 10),
      year: parseInt($stateParams.year, 10),
      classification: $stateParams.classification,
      company: $stateParams.company,
      product: $stateParams.product,
      reason: $stateParams.reason,
      status: $stateParams.status,
      groupBy: $stateParams.groupBy,
      countBy: $stateParams.countBy,
      selectedState: $stateParams.state
    };

    $scope.$watch(() => this.criteria, () => {
      this.filteredRecalls = this.getFilteredRecalls(this.recalls, this.criteria);
      this.productCount = this.filteredRecalls.reduce((prev, recall) => prev += recall.products.length, 0);

      this.recallsByState = this.getRecallsByState(this.filteredRecalls, this.criteria.groupBy);
      this.selectedState = this.recallsByState[this.criteria.selectedState];
    }, true);
    this.recallsByState = this.getRecallsByState(this.recalls, this.criteria.groupBy);

    let ctrl = this; // Need as $scope.$on does not bind to correct context even with an arrow function
    this.selectedState = $stateParams.state ? this.recallsByState[$stateParams.state] : null;
    $scope.$on('selectedState', (e, selectedStateAbbr) => {
      ctrl.criteria.selectedState = selectedStateAbbr;
      ctrl.selectedState = ctrl.recallsByState[selectedStateAbbr];
      $state.go('.', {state: selectedStateAbbr});
    });

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

  set isFilterVisible(visible) {
    this.filtersVisible = visible;
  }

  get isFilterVisible() {
    return this.filtersVisible;
  }

  // For each filter on the view, return the filter description based
  // on the filter's name. This text is displayed in a tooltip.
  getFilterDescription(filterName) {
    return filterDescriptions[filterName];
  }

  getFilteredRecalls(recalls, criteria) {
    let results = recalls.reduce((prev, item) => {
      if (this.isFilterMatch(item, criteria)) {
        prev.push(item);
      }
      return prev;
    }, []);

    return results;
  }

  isFilterMatch(recall, criteria) {
    if (criteria.classification) {
      if (!recall.classification || recall.classification !== criteria.classification) {
        return false;
      }
    }

    if (criteria.status) {
      if (!recall.status || recall.status !== criteria.status) {
        return false;
      }
    }

    if (criteria.company) {
      let lowerCaseCompany = criteria.company.toLowerCase();
      if (!recall.recalling_firm || recall.recalling_firm.toLowerCase().indexOf(lowerCaseCompany) === -1) {
        return false;
      }
    }

    if (criteria.reason) {
      let lowerCaseReason = criteria.reason.toLowerCase();
      if (!recall.reason_for_recall || recall.reason_for_recall.toLowerCase().indexOf(lowerCaseReason) === -1) {
        return false;
      }
    }

    if (criteria.product) {
      let lowerCaseProduct = criteria.product.toLowerCase();
      if (!recall.products) {
        // There are no products in the list so it can't match
        return false;
      }
      // See if any of the product texts match
      let match = recall.products.some(p => p.product_description.toLowerCase().indexOf(lowerCaseProduct) !== -1);
      if (!match) {
        return false;
      }

    }
    return true;
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
