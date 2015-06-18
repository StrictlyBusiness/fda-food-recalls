import d3 from 'd3';

import template from './template.html!text';
import stateShapes from './shapes.json!';

export default class USMap {

  constructor() {
    this.restrict = 'E';
    this.replace = false;
    this.template = template;
    this.scope = {
      data: '='
    };
  }

  link(scope, element, attrs) {
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
        .style('fill', d => d3.interpolate('#FFEB3B', '#F44336')(d.count / 100))
        .on('mouseover', function(d) {
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
            d3.select(tooltipElement)
              .transition().duration(200).style('opacity', 0);
        })
      ;
  };

  static directiveFactory() {
    USMap.instance = new USMap();
    return USMap.instance;
  }

  static get directiveName() { return 'usMap'; }
}
