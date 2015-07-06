import angular from 'angular';
import 'angular-mocks';

import services from './module';

describe('CacheService', () => {

  // Initialize some data
  let cacheService = null;
  let object1 = { key: '123', name: 'test 123' };
  let object2 = { key: '234', name: 'test 234' };
  let object3 = { key: '345', name: 'test 345' };

  beforeEach('Create services module', angular.mock.module(services.name));

  beforeEach('Inject cacheService for test', inject(($injector) => {
    cacheService = $injector.get('cacheService');
  }));

  describe('store', () => {

    it('it should save a value', () => {
      cacheService.store('test', object1.key, object1);
      expect(cacheService.fetch('test', object1.key)).to.be.equal(object1);
    });

  });

  describe('fetch', () => {

    it('it should store and fetch a value', () => {
      cacheService.store('test', object1.key, object1);
      expect(cacheService.fetch('test', object1.key)).to.be.equal(object1);
    });

    it('it should return undefined for a missing value', () => {
      cacheService.store('test', object1.key, object1);
      expect(cacheService.fetch('test', object2.key)).to.be.undefined;
    });

    it('it should return undefined for a missing value where type cache doesn\'t exist', () => {
      expect(cacheService.fetch('test', object1.key)).to.be.undefined;
    });

  });

  describe('remove', () => {

    it('it should return existing object when a cached value is removed', () => {
      // Store it
      cacheService.store('test', object1.key, object1);
      // Remove it
      expect(cacheService.remove('test', object1.key)).to.be.equal(object1);
      // Check it it is still there
      expect(cacheService.fetch('test', object1.key)).to.be.undefined;
    });

    it('it should return undefined if not found and type cache does not exists', () => {
      // Attempt to remove a non existing object
      expect(cacheService.remove('test', object1.key)).to.be.undefined;
    });

    it('it should return undefined if not found and type cache exists', () => {
      // Cache a differnt object in the same type cache
      cacheService.store('test', object1.key, object1);
      // Attempt to remove a non existing object
      expect(cacheService.remove('test', object2.key)).to.be.undefined;
    });

  });

  describe('clear', () => {

    it('it should clear correct stored values for a type', () => {
      // Store some
      cacheService.store('test-1', object1.key, object1);
      cacheService.store('test-1', object2.key, object2);
      cacheService.store('test-2', object3.key, object3);
      // Clear test-1 type
      cacheService.clear('test-1');
      // Verify the cache is as we expect
      expect(cacheService.fetch('test-1', object1.key)).to.be.undefined;
      expect(cacheService.fetch('test-1', object2.key)).to.be.undefined;
      expect(cacheService.fetch('test-2', object3.key)).to.be.equal(object3);
    });

  });

});
