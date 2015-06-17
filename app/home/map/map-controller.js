export default class MapController {

  static get $inject() { return ['recallResults']; }

  constructor(recallResults) {
    this.recalls = recallResults.results;
  }

}
