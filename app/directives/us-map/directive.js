import d3 from 'd3';
import topojson from 'mbostock/topojson';

import us from './us.json!';
import usStateNames from './us-state-names.tsv!text';
import template from './template.html!text';

export default class USMap {

  static get directiveName() { return 'usMap'; }

  constructor() {
    this.restrict = 'E';
    this.replace = false;
    this.template = template;
    this.scope = {
      recallsByState: '=',
      selected: '='
    };
  }

  link(scope, element, attrs) {

    let projection = d3.geo.albersUsa()
        .scale(1000);

    let path = d3.geo.path()
        .projection(projection);

    let svgElement = element[0].querySelector('svg');
    let tooltipElement = element[0].querySelector('.tooltip');

    let width = svgElement.viewBox.baseVal.width;
    let height = svgElement.viewBox.baseVal.height;

    let svg = d3.select(svgElement);

    svg.append('rect')
        .attr('class', 'background')
        .attr('width', '100%')
        .attr('height', '100%')
        .on('click', onClick); // eslint-disable-line no-use-before-define

    let map = svg.append('g');

    let statesNamesById = d3.tsv.parse(usStateNames);
    let stateFeatures = topojson.feature(us, us.objects.states).features;

    // Omit any states that do not fit on the projection (ex. Puerto Rico and Virgin Islands)
    stateFeatures = stateFeatures.filter(f => (path.centroid(f)[0]));

    // Append "metadata" (abbreviation, name, and recalls) to each state
    stateFeatures.forEach(f => {
      let stateName = statesNamesById.filter(s => parseInt(s.id) === f.id);
      if (stateName.length) {
        var abbr = stateName[0].code;
        f.metadata = {
          abbreviation: abbr,
          name: stateName[0].name,
          recalls: (abbr in scope.recallsByState) ? scope.recallsByState[abbr].recalls : []
        };
      }
    });

    let states = map.append('g')
        .attr('class', 'states')
      .selectAll('path')
        .data(stateFeatures)
      .enter().append('path')
        .attr('class', 'state')
        .attr('d', path)
        .style('fill', d => {
          let value = d.metadata.recalls.length / 100;
          return d3.interpolate('#FFEB3B', '#F44336')(value);
        })
        .on('click', onClick) // eslint-disable-line no-use-before-define
        .on('mouseover', function(d) {
          d3.select(tooltipElement)
              .html(`${d.metadata.name} (${d.metadata.recalls.length})`)
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
        });

    map.append('path')
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b ))
      .attr('class', 'state-borders')
      .attr('d', path);

    map.append('path')
      .datum(topojson.feature(us, us.objects.land))
      .attr('class', 'country-border')
      .attr('d', path);

    map.selectAll('text')
        .data(stateFeatures)
      .enter().append('svg:text')
        .text(d => d.metadata.abbreviation)
        .attr('class', 'state-labels')
        .attr('x', d => path.centroid(d)[0])
        .attr('y', d => path.centroid(d)[1]);

    function onClick(d) {
      let x, y, k;

      if (d && d !== scope.selected) {
        var centroid = path.centroid(d);
        [x, y] = centroid;
        k = 2.5;
        scope.selected = d.metadata;
      } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        scope.selected = null;
      }
      scope.$apply();

      states.classed('selected', scope.selected && (d2 => d2.metadata === scope.selected));

      map.transition()
          .duration(750)
          .attr('transform', `translate(${width / 2}, ${height / 2}) scale(${k}) translate(${-x}, ${-y})`);
    }
  }

  static directiveFactory() {
    USMap.instance = new USMap();
    return USMap.instance;
  }
}
