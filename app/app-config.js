import angular from 'angular';

const apiInfo = {
  key: '4mETWN08eYj8aOvd4zixN3819mP3GUz7Ma64SxkX',
  url: 'https://api.fda.gov/food/enforcement.json'
};

export default angular.module('fdaFoodRecalls.config', [])
  .constant('API_INFO', apiInfo);
