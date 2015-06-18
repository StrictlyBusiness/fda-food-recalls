import angular from 'angular';
import homeRoutes from './routes';
import mapRoutes from './map/routes';
import listingRoutes from './listing/routes';

export default angular.module('fdaFoodRecalls.home', [])
  .config(homeRoutes)
  .config(mapRoutes)
  .config(listingRoutes)
;
