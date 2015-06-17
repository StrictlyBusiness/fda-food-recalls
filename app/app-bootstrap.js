import angular from 'angular';

import app from './app';

angular.element(document).ready(() => {
  angular.bootstrap(document, [app.name], {
    strictDi: true
  });
});
