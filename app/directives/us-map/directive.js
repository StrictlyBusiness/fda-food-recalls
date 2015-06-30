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
      countBy: '=',
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
        .on('click', d => scope.$apply(() => scope.selected = null));

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
        f.metadata = scope.recallsByState[abbr];
      }
    });

    let statesGroup = map.append('g')
        .attr('class', 'states');

    let states = statesGroup.selectAll('path')
        .data(stateFeatures)
      .enter().append('path')
        .attr('class', 'state')
        .attr('d', path)
        .style('fill', colorState) // eslint-disable-line no-use-before-define
         .on('click', d => {
          // Unselect state if already selected, else update selection
          scope.selected = (d === scope.selected) ? null : d;
          scope.$apply();
        })
        .on('mouseover', function(d) {
          d3.select(tooltipElement)
              .html(`
                <div class="name">${d.metadata.name}</div>
                <div>Recalls: ${d.metadata.recalls.length}</div>
                <div>Recalled Products: ${d.metadata.productCount }</div>
              `)
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

    let stateLabels = statesGroup.selectAll('text')
        .data(stateFeatures)
      .enter().append('svg:text')
        .text(d => d.metadata.abbreviation)
        .attr('class', 'state-labels')
        .attr('x', d => path.centroid(d)[0])
        .attr('y', d => path.centroid(d)[1]);

    scope.clearSelection = () => scope.selected = null;

    scope.$watch('selected', selected => {
      let translate, scale;

      if (selected) {
        let [leftTop, rightBottom] = path.bounds(selected);
        let [left, top] = leftTop;
        let [right, bottom] = rightBottom;
        let dx = right - left;
        let dy = bottom - top;
        let x = (left + right) / 2;
        let y = (top + bottom) / 2;

        scale = 0.8 / Math.max(dx / width, dy / height);
        translate = [width / 2 - scale * x, height / 2 - scale * y];
        statesGroup.classed('selected', true);
      } else {
        scale = 1;
        translate = 0;
        statesGroup.classed('selected', false);
      }

      states.classed('selected', selected && (s => s.metadata === selected.metadata));
      stateLabels.classed('selected', selected && (l => l.metadata === selected.metadata));

      map.transition()
        .duration(750)
        .style('stroke-width', 1.5 / scale + 'px')
        .attr('transform', `translate(${translate}) scale(${scale})`);
    });

    function colorState(d) {
      let value;
      if (scope.countBy === 'products') {
        value = d.metadata.productCount / 100;
      } else {
        value = d.metadata.recalls.length / 10;
      }
      return d3.interpolate('#FFEB3B', '#F44336')(value);
    }
    scope.$watch('countBy', countBy => {
      states.style('fill', colorState);
    });

  }

  static directiveFactory() {
    USMap.instance = new USMap();
    return USMap.instance;
  }
}
