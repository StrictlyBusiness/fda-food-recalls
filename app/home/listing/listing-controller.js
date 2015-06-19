import moment from 'moment';

import statesDataset from '../../data/states.json!';

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

  // Class I = Dangerous or defective products that predictably could cause
  //  serious health problems or death. Examples include: food found to contain
  //  botulinum toxin, food with undeclared allergens, a label mix-up on a
  //  lifesaving drug, or a defective artificial heart valve.
  // Class II = Products that might cause a temporary health problem, or pose
  //  only a slight threat of a serious nature. Example: a drug that is
  //  under-strength but that is not used to treat life-threatening situations.
  // Class III = Products that are unlikely to cause any adverse health reaction,
  //  but that violate FDA labeling or manufacturing laws. Examples include: a
  //  minor container defect and lack of English labeling in a retail food.
  getClassificationStyle(classification) {
    if (classification === 'Class I') {
      return 'danger';
    }
    if (classification === 'Class II') {
      return 'warning';
    }
    if (classification === 'Class III') {
      return 'info';
    }
    return 'default';
  }
  getClassificationDescription(classification) {
    if (classification === 'Class I') {
      return `Dangerous or defective products that predictably could cause
        serious health problems or death. Examples include: food found to
        contain botulinum toxin, food with undeclared allergens, a label
        mix-up on a lifesaving drug, or a defective artificial heart valve.`;
    }
    if (classification === 'Class II') {
      return `Products that might cause a temporary health problem, or pose
        only a slight threat of a serious nature. Example: a drug that is
        under-strength but that is not used to treat life-threatening situations.`;
    }
    if (classification === 'Class III') {
      return `Products that are unlikely to cause any adverse health reaction,
        but that violate FDA labeling or manufacturing laws. Examples include:
        a minor container defect and lack of English labeling in a retail food.`;
    }
    return 'No description available';
  }

  // On-Going = A recall which is currently in progress.
  // Completed = The recall action reaches the point at which the firm has actually
  //  retrieved and impounded all outstanding product that could reasonably be expected
  //  to be recovered, or has completed all product corrections.
  // Terminated = FDA has determined that all reasonable efforts have been made to
  //  remove or correct the violative product in accordance with the recall strategy,
  //  and proper disposition has been made according to the degree of hazard.
  // Pending = Actions that have been determined to be recalls, but that remain
  //  in the process of being classified.
  getStatusStyle(status) {
    if (status === 'Ongoing') {
      return 'danger';
    }
    if (status === 'Completed') {
      return 'success';
    }
    if (status === 'Terminated') {
      return 'primary';
    }
    if (status === 'Pending') {
      return 'warning';
    }
    return 'default';
  }
  getStatusDescription(status) {
    if (status === 'Ongoing') {
      return 'A recall which is currently in progress.';
    }
    if (status === 'Completed') {
      return `The recall action reaches the point at which the firm has \
        actually retrieved and impounded all outstanding product that could \
        reasonably be expected to be recovered, or has completed all product \
        corrections.`;
    }
    if (status === 'Terminated') {
      return `FDA has determined that all reasonable efforts have been made to \
        remove or correct the violative product in accordance with the recall \
        strategy, and proper disposition has been made according to the degree \
        of hazard.`;
    }
    if (status === 'Pending') {
      return `Actions that have been determined to be recalls, but that remain \
        in the process of being classified.`;
    }
    return 'No description available';
  }

}
