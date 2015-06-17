export default class MapController {

  static get $inject() { return ['recallsByState']; }

  constructor(recallsByState) {
    this.recallsByState = recallsByState;
  }

}
