export default function IsRecallForStateFilterProvider() {

  return function(recalls, state) {

    if (!recalls || !recalls.length) {
      return recalls;
    }

    let matches = [];
    recalls.forEach((recall) => {
      if (recall.states.indexOf(state) !== -1) {
        matches.push(recall);
      }
    });

    return matches;
  };

}
