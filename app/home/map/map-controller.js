import moment from 'moment';

import states from 'app/data/states.json!';

export default class MapController {

  static get $inject() { return ['recalls', '$state', '$stateParams', 'API_INFO']; }

  constructor(recalls, $state, $stateParams, API_INFO) {

    // Create map keyed by state abbreviation (ex. 'WV')
    this.recallsByState = states.reduce((prev, item) => {
        if (!(item.abbr in prev)) {
          prev[item.abbr] = {
              abbreviation: item.abbr,
              name: item.name,
              recalls: []
          };
        }
        return prev;
    }, {});

    // Add recalls to each state (or "unknown" state)
    recalls.forEach(r => {
      var stateName = r.state || 'unknown';
      if (stateName in this.recallsByState) {
        this.recallsByState[stateName].recalls.push(r);
      } else {
        this.recallsByState[stateName] = {
          name: 'name',
          abbreviation: 'unknown',
          recalls: [r]
        };
      }
    });

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
