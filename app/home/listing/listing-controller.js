import moment from 'moment';

import statesDataset from 'app/data/states.json!';

export default class ListingController {

  static get $inject() { return ['recalls', '$state', '$stateParams', 'API_INFO']; }

  constructor(recalls, $state, $stateParams, API_INFO) {

    this.recalls = recalls;

    this.$state = $state;
    this.API_INFO = API_INFO;

    this.criteria = {
      month: parseInt($stateParams.month, 10),
      year: parseInt($stateParams.year, 10),
      state: $stateParams.state
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

    // The list of states
    this.states = statesDataset;

  }

  selectMonth(month) {
    return this.$state.go('home.listing', {
      month: month.month,
      year: this.criteria.year,
      state: this.criteria.state
    });
  }

  selectYear(year) {
    return this.$state.go('home.listing', {
      month: this.criteria.month,
      year: year,
      state: this.criteria.state
    });
  }

  selectState(state) {
    return this.$state.go('home.listing', {
      month: this.criteria.month,
      year: this.criteria.year,
      state: state.abbr
    });
  }

  isMonthSelected(month) {
    return month.month === this.criteria.month;
  }

  isYearSelected(year) {
    return year === this.criteria.year;
  }

  isStateSelected(state) {
    return state.abbr === this.criteria.state;
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
