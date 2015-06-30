import moment from 'moment';

import states from 'app/data/states.json!';
import recallClassificationsDataset from 'app/data/recall-classifications.json!';
import recallStatusesDataset from 'app/data/recall-statuses.json!';

export default class MapController {

  static get $inject() { return ['recalls', '$state', '$stateParams', '$scope', 'API_INFO']; }

  constructor(recalls, $state, $stateParams, $scope, API_INFO) {

    this.recalls = recalls;
    this.productCount = recalls.reduce((prev, recall) => prev += recall.products.length, 0);
    this.groupBy = 'origination';
    this.countBy = 'recalls';

    $scope.$watch(() => this.groupBy, (groupBy) => {
      this.recallsByState = this.getRecallsByState(this.recalls, groupBy);
    });
    this.recallsByState = this.getRecallsByState(this.recalls, this.groupBy);

    this.$state = $state;
    this.API_INFO = API_INFO;

    this.criteria = {
      month: parseInt($stateParams.month, 10),
      year: parseInt($stateParams.year, 10),
      classification: $stateParams.classification,
      status: $stateParams.status
    };

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

  selectMonth(month) {
    return this.$state.go('home.map', {
      month: month
    });
  }

  selectYear(year) {
    return this.$state.go('home.map', {
      year: year
    });
  }

  selectClassification(classification) {
    return this.$state.go('home.map', {
      classification: classification
    });
  }

  selectStatus(status) {
    return this.$state.go('home.map', {
      status: status
    });
  }

  isMonthSelected(month) {
    return month.month === this.criteria.month;
  }

  isYearSelected(year) {
    return year === this.criteria.year;
  }

  isValidMonth(month) {
    let period = moment({ year: this.criteria.year, month: month.month - 1, day: 1 });
    return period.isBetween(this.API_INFO.dataset.periodStart, this.API_INFO.dataset.periodEnd);
  }

  isValidYear(year) {
    let period = moment({ year: year, month: this.criteria.month - 1, day: 1 });
    return period.isAfter(this.API_INFO.dataset.periodStart)
      && period.isBefore(this.API_INFO.dataset.periodEnd);
  }

}
