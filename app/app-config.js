import angular from 'angular';

let apiKey = '4mETWN08eYj8aOvd4zixN3819mP3GUz7Ma64SxkX';
let apiBaseUrl = 'https://api.fda.gov/food/enforcement.json';

let apiInfo = {
  key: apiKey,
  baseUrl: apiBaseUrl,
  url: apiBaseUrl + '?api_key=' + apiKey
};

export default angular.module('fdaFoodRecalls.config', [])
  .constant('API_INFO', apiInfo);
