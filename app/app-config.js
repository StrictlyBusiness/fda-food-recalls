import angular from 'angular';

const apiKey = '4mETWN08eYj8aOvd4zixN3819mP3GUz7Ma64SxkX';
const apiBaseUrl = 'https://api.fda.gov/food/enforcement.json';

const apiInfo = {
  key: apiKey,
  baseUrl: apiBaseUrl,
  url: apiBaseUrl + '?api_key=' + apiKey
};

export default angular.module('fdaFoodRecalls.config', [])
  .constant('API_INFO', apiInfo);
