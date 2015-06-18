import angular from 'angular';
import moment from 'moment';

export default angular.module('fdaFoodRecalls.config', [])
  .constant('API_INFO', {
    key: '4mETWN08eYj8aOvd4zixN3819mP3GUz7Ma64SxkX',
    url: 'https://api.fda.gov/food/enforcement.json',
    dataset: {
      periodStart: moment({ year: 2012, month: 4, day: 1 }).startOf('day'),
      periodEnd: moment().subtract(1, 'month').endOf('month')
    }
  })
;
