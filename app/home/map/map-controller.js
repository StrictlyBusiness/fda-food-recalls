import moment from 'moment';

export default class MapController {

  static get $inject() { return ['recallsByState', '$state', '$stateParams', 'API_INFO']; }

  constructor(recallsByState, $state, $stateParams, API_INFO) {

    this.recallsByState = recallsByState;
    this.$state = $state;
    this.API_INFO = API_INFO;

    this.selectedPeriod = {
      month: parseInt($stateParams.month, 10),
      year: parseInt($stateParams.year, 10)
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

  }

  selectMonth(month) {
    return this.$state.go('home.map', {
      month: month.month,
      year: this.selectedPeriod.year
    });
  }

  selectYear(year) {
    return this.$state.go('home.map', {
      month: this.selectedPeriod.month,
      year: year
    });
  }

  isMonthSelected(month) {
    return month.month === this.selectedPeriod.month;
  }

  isYearSelected(year) {
    return year === this.selectedPeriod.year;
  }

  isValidMonth(month) {
    let period = moment({ year: this.selectedPeriod.year, month: month.month - 1, day: 1 });
    return period.isBetween(this.API_INFO.dataset.periodStart, this.API_INFO.dataset.periodEnd);
  }

  isValidYear(year) {
    let period = moment({ year: year, month: this.selectedPeriod.month - 1, day: 1 });
    return period.isAfter(this.API_INFO.dataset.periodStart)
      && period.isBefore(this.API_INFO.dataset.periodEnd);
  }

}
