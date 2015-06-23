import d3 from 'd3';

import template from './template.html!text';

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

    let svgElement = element[0].querySelector('svg');
    let tooltipElement = element[0].querySelector('.tooltip');

    d3.select(svgElement).selectAll('.state')
      .data(scope.data).enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', d => d.path)
        .style('fill', d => d3.interpolate('#FFEB3B', '#F44336')(d.recalls.length / 100))
        .on('mouseover', function(d) {
            d3.select(tooltipElement)
              .html(`${d.name} (${d.recalls.length})`)
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
