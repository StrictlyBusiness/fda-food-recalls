import angular from 'angular';
import 'angular-mocks';

import services from './module';

describe('LocalStorageService', function() {

  beforeEach('Create services module', angular.mock.module(services.name));

  let localStorageService = null;
  beforeEach('Inject localStorageService for test', inject(function($injector) {
    localStorageService = $injector.get('localStorageService');
  }));

  afterEach('Reset all data', function() {
    localStorageService.clear();
  });

  describe('Set and Get', function() {

    it('should successfully save and load an object', function() {

      let expected = {
        name: 'Jason'
      };
      localStorageService.set('user', expected);

      let actual = localStorageService.get('user');
      expect(actual).to.not.be.null;
      expect(actual.name).to.equal(expected.name);

    });

    it('should successfully save and load a string', function() {

      let expected = 'Jason';
      localStorageService.set('user', expected);

      let actual = localStorageService.get('user');
      expect(actual).to.not.be.null;
      expect(actual).to.equal(expected);

    });

    it('should successfully save and load null', function() {

      let expected = null;
      localStorageService.set('user', expected);

      let actual = localStorageService.get('user');
      expect(actual).to.be.null;

    });

    it('should successfully return default value if undefined', function() {

      let expected = 'test user';
      
      let actual = localStorageService.get('user', expected);
      expect(actual).to.equal(expected);

    });

  });

  describe('Remove', function() {

    it('should successfully remove saved object', function() {

      let expected = 'Jason';
      localStorageService.set('user', expected);

      localStorageService.remove('user');

      let actual = localStorageService.get('user');
      expect(actual).to.be.null;

    });

  });

  describe('Clear', function() {
    it('should successfully remove all saved objects', function() {

      let expected = 'Jason';
      localStorageService.set('user1', expected);
      localStorageService.set('user2', expected);

      localStorageService.clear();

      let actual = localStorageService.get('user1');
      expect(actual).to.be.null;
      actual = localStorageService.get('user2');
      expect(actual).to.be.null;

    });
  });

});
