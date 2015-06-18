import d3 from 'd3';

import template from './state-map.html!text';
import stateShapes from './state-shapes.json!';
import './state-map.css!';

export default class StateMap {

  constructor() {
    this.restrict = 'E';
    this.replace = false;
    this.template = template;
    this.scope = {
      data: '='
    };

    this.link = (scope, element, attrs) => {

      // Append path data and convert object to array for d3.data()
      var data = Object.keys(scope.data).map(s => {
        scope.data[s].name = s;
        scope.data[s].path = stateShapes[s];
        return scope.data[s];
      });

      var svgElement = element[0].querySelector('svg');
      var tooltipElement = element[0].querySelector('.tooltip');

      d3.select(svgElement).selectAll('.state')
        .data(data).enter()
          .append('path')
          .attr('class', 'state')
          .attr('d', d => d.path)
          .style('fill', d => d3.interpolate('#FFEB3B', '#F44336')(d.count / 50))
          .on('mouseover', function(d) {
              d3.select(this);
                // .style({'stroke-width': '2px', 'stroke': '#555'});

              d3.select(tooltipElement)
                .html(`${d.name} (${d.count})`)
                .transition().duration(200).style('opacity', 1);
          })
          .on('mousemove', function(d) {
            d3.select(tooltipElement)
              .style('left', `${d3.event.pageX + 30}px`)
              .style('top', `${d3.event.pageY - 30}px`);
          })
          .on('mouseout', function(d) {
              d3.select(this);
                // .style('stroke-width', '1px')
                // .style('stroke', '#555');

              d3.select(tooltipElement)
                .transition().duration(200).style('opacity', 0);
          })
        ;

    };
  }

  static directiveFactory() {
    StateMap.instance = new StateMap();
    return StateMap.instance;
  }

  static get directiveName() { return 'stateMap'; }
}
