
import 'angular';
import 'angular-mocks';

import services from './module';

describe('FoodRecallService', () => {

  // Initialize some data
  let foodRecallService = null;
  const WV = { name: 'West Virginia', abbr: 'WV' };
  const VA = { name: 'Virginia', abbr: 'VA' };

  beforeEach('Create services module', angular.mock.module(services.name));

  beforeEach('Inject foodRecallService for test', inject(($injector) => {
    foodRecallService = $injector.get('foodRecallService');
  }));

  describe('appliesToState', () => {

    it('should match state abbreviation at the beginning of the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'WV, CT, NY'
      })).to.be.true;
    });

    it('should match state abbreviation at the end of the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed in WV'
      })).to.be.true;
    });

    it('should match state abbreviation in the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed in WV, CT, and NY'
      })).to.be.true;
    });

    it('should match state name at the beginning of the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'West Virginia, Maine, Arizona'
      })).to.be.true;
    });

    it('should match state name at the end of the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed in West Virginia'
      })).to.be.true;
    });

    it('should match state name in the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed in West Virginia, Ohio, and New York'
      })).to.be.true;
    });

    it('should not match if it is part of another word in the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed in NY, CT, and ME. Consult WVRE for details.'
      })).to.be.false;
    });

    it('should not match if it is not in the distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed in NY, CT, and ME'
      })).to.be.false;
    });

    // Special cases for national distribution
    it('should match the Nationwide distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed Nationwide'
      })).to.be.true;
    });

    it('should match the nationwide distribution pattern', () => {
      expect(foodRecallService.appliesToState(WV, {
        distribution_pattern: 'distributed nationwide'
      })).to.be.true;
    });

    // Special cases Virginia
    it('should not match West Virginia when looking for Virginia', () => {
      expect(foodRecallService.appliesToState(VA, {
        distribution_pattern: 'distributed in West Virginia'
      })).to.be.false;
    });

  });

});
