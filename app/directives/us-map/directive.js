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

    let svg = d3.select(svgElement)
      .on('click', d => scope.$apply(() => scope.$emit('selectedState', null)));

    let map = svg.append('g');

    let statesGroup = map.append('g')
        .attr('class', 'states');

    map.append('path')
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b ))
      .attr('class', 'state-borders')
      .attr('d', path);

    map.append('path')
      .datum(topojson.feature(us, us.objects.land))
      .attr('class', 'country-border')
      .attr('d', path);

    let statesNamesById = d3.tsv.parse(usStateNames);
    let states = null;
    let stateLabels = null;
    let stateFeatures = topojson.feature(us, us.objects.states).features;

    let update = (stateGroups) => {
      // console.log('update');

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

      states = statesGroup.selectAll('path')
          .data(stateFeatures);

      states.enter().append('path')
          .attr('class', 'state');

      states.attr('d', path)
          .style('fill', d => {
            let value;
            if (scope.countBy === 'products') {
              value = Math.min(d.metadata.productCount / 100, 1);
            } else {
              value = Math.min(d.metadata.recalls.length / 10, 1);
            }

            return (value === 0) ? '#FFFFFF' : d3.interpolate('#FFF59D', '#F44336')(value);
          })
          .on('click', d => {
            scope.$apply(() => {
              // Unselect state if already selected, else update selection
              let selectedState = (d.metadata.abbreviation === scope.selected) ? null : d.metadata.abbreviation;
              scope.$emit('selectedState', selectedState);
            });

            d3.event.stopPropagation();
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

      let smallStates = ['VT', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'DC'];
      let smallStateLabelStartCoodinates = projection([-67.707617, 42.722131]);
      stateLabels = statesGroup.selectAll('text')
          .data(stateFeatures)
        .enter().append('svg:text')
          .text(d => d.metadata.abbreviation)
          .attr('class', 'state-labels')
          .each(function(d) {
            let label = d3.select(this);

            let xCenter = path.centroid(d)[0];
            let yCenter = path.centroid(d)[1];

            let xOffset = 0;
            let yOffset = 5;
            switch(d.metadata.abbreviation) {
              case 'FL':
              case 'KY':
                xOffset = 8;
                break;
              case 'HI':
                xOffset = -15;
                break;
              case 'LA':
                xOffset = -9;
                break;
              case 'MI':
                xOffset = 8;
                yOffset = 18;
                break;
              case 'NY':
                xOffset = 1;
                break;
              default:
                xOffset = 0;
            }

            let x = xCenter + xOffset;
            let y = yCenter + yOffset;

            // Place labels for smaller states stacked to the right and draw line to state center
            if (smallStates.some(s => s === d.metadata.abbreviation)) {
              x = smallStateLabelStartCoodinates[0];

              let yStart = smallStateLabelStartCoodinates[1];
              let smallStateIndex = smallStates.indexOf(d.metadata.abbreviation);
              y = yStart + (smallStateIndex * (4 + 12));

              statesGroup.append('line')
                .attr('x1', x - 10)
                .attr('y1', y - 5)
                .attr('x2', xCenter)
                .attr('y2', yCenter)
                .style('stroke', '#999')
                .style('stroke-width', 1);
            }

            label.attr('x', x);
            label.attr('y', y);
          });
    };
    update(statesGroup);

    scope.$watch('recallsByState', () => {
      update(statesGroup);
    });

    scope.$watch('countBy', countBy => {
      update(statesGroup);
    });

    let updateSelection = (selected) => {
      // console.log('selected', selected);
      let translate, scale;

      if (selected) {
        let stateFeature = stateFeatures.filter(f => f.metadata.abbreviation === selected)[0];

        let [leftTop, rightBottom] = path.bounds(stateFeature);
        let [left, top] = leftTop;
        let [right, bottom] = rightBottom;
        let dx = right - left;
        let dy = bottom - top;
        let x = (left + right) / 2;
        let y = (top + bottom) / 2;

        scale = 0.8 / Math.max(dx / width, dy / height);
        scale = Math.min(scale, 3); // Restrict zooming to a maximum of 3x (for smaller states)
        translate = [width / 2 - scale * x, height / 2 - scale * y];
        statesGroup.classed('selected', true);
      } else {
        scale = 1;
        translate = 0;
        statesGroup.classed('selected', false);
      }

      states.classed('selected', selected && (s => s.metadata.abbreviation === selected));
      stateLabels.classed('selected', selected && (l => l.metadata.abbreviation === selected));

      map.transition()
        .duration(750)
        .style('stroke-width', 1.5 / scale + 'px')
        .attr('transform', `translate(${translate}) scale(${scale})`);
    };
    scope.$watch('selected', selected => {
      updateSelection(selected);
    });
    updateSelection(scope.selected);

    scope.clearSelection = () => scope.$emit('selectedState', null);
  }

  static directiveFactory() {
    USMap.instance = new USMap();
    return USMap.instance;
  }
}
