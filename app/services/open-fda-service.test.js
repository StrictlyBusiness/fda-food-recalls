
import 'angular';
import 'angular-mocks';

import services from './module';

describe('OpenFdaService', function() {

  beforeEach('Create services module', angular.mock.module(services.name));

  let openFdaService = null;
  beforeEach('Inject openFdaService for test', inject(function($injector) {
    openFdaService = $injector.get('openFdaService');
  }));

  describe('load', function() {

    it('should successfully load data', function() {

    });

  });

});
