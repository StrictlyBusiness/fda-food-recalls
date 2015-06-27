import template from './template.html!text';

import recallClassificationsDataset from 'app/data/recall-classifications.json!';
import recallStatusesDataset from 'app/data/recall-statuses.json!';


export default class RecallsList {

  static get directiveName() { return 'recallsList'; }

  constructor() {
    this.restrict = 'E';
    this.replace = false;
    this.template = template;
    this.scope = {
      recalls: '='
    };
  }

  link(scope, element, attrs) {
    /**
     * Class I = Dangerous or defective products that predictably could cause
     *   serious health problems or death. Examples include: food found to contain
     *   botulinum toxin, food with undeclared allergens, a label mix-up on a
     *   lifesaving drug, or a defective artificial heart valve.
     * Class II = Products that might cause a temporary health problem, or pose
     *   only a slight threat of a serious nature. Example: a drug that is
     *   under-strength but that is not used to treat life-threatening situations.
     * Class III = Products that are unlikely to cause any adverse health reaction,
     *   but that violate FDA labeling or manufacturing laws. Examples include: a
     *   minor container defect and lack of English labeling in a retail food.
     */
    scope.getClassificationStyle = function(classification) {
      let match = recallClassificationsDataset[classification];
      return (match) ? match.style : 'default';
    };

    scope.getClassificationDescription = function(classification) {
      let match = recallClassificationsDataset[classification];
      return (match) ? match.description : 'No description available';
    };

    /**
    * On-Going = A recall which is currently in progress.
    * Completed = The recall action reaches the point at which the firm has actually
    *   retrieved and impounded all outstanding product that could reasonably be expected
    *   to be recovered, or has completed all product corrections.
    * Terminated = FDA has determined that all reasonable efforts have been made to
    *   remove or correct the violative product in accordance with the recall strategy,
    *   and proper disposition has been made according to the degree of hazard.
    * Pending = Actions that have been determined to be recalls, but that remain
    *   in the process of being classified.
    */
    scope.getStatusStyle = function(status) {
      let match = recallStatusesDataset[status];
      return (match) ? match.style : 'default';
    };

    scope.getStatusDescription = function(status) {
      let match = recallStatusesDataset[status];
      return (match) ? match.description : 'No description available';
    };
  }

  static directiveFactory() {
    RecallsList.instance = new RecallsList();
    return RecallsList.instance;
  }
}
