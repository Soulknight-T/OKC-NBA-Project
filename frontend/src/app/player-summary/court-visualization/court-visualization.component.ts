import { Component, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import * as d3 from 'd3';

interface Shot {
  shot_loc_x: number;
  shot_loc_y: number;
  made: boolean;
  action_type: string;
}

interface Pass {
  ball_start_loc_x: number;
  ball_start_loc_y: number;
  ball_end_loc_x: number;
  ball_end_loc_y: number;
  completed_pass: boolean;
}

interface Turnover {
  tov_loc_x: number;
  tov_loc_y: number;
  action_type: string;
}

@Component({
  selector: 'app-court-visualization',
  template: `<svg width="600" height="470"></svg>`,
  styleUrls: ['./court-visualization.component.scss']
})
export class CourtVisualizationComponent implements OnChanges {
  @Input() shots: Shot[] = [];
  @Input() passes: Pass[] = [];
  @Input() turnovers: Turnover[] = [];

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this.drawCourt();
  }

  private drawCourt() {
    const svg = d3.select(this.el.nativeElement).select('svg');
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const scale = 10;
    const courtPadding = 20;

    const centerX = width / 2;
    const hoopY = height - 4 * scale;

    svg.append('rect')
      .attr('x', courtPadding)
      .attr('y', courtPadding)
      .attr('width', width - 2 * courtPadding)
      .attr('height', height - 2 * courtPadding)
      .attr('fill', '#f9f9f9')
      .attr('stroke', 'black');

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', hoopY)
      .attr('r', 0.75 * scale)
      .attr('stroke', 'orange')
      .attr('fill', 'none')
      .attr('stroke-width', 2);

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', hoopY - 19 * scale)
      .attr('r', 6 * scale)
      .attr('fill', 'none')
      .attr('stroke', 'black');

    svg.append('path')
      .attr('d', d3.arc()({
        innerRadius: 23.75 * scale,
        outerRadius: 23.75 * scale,
        startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2
      })!)
      .attr('transform', `translate(${centerX}, ${hoopY})`)
      .attr('fill', 'none')
      .attr('stroke', 'black');

    svg.append('line')
      .attr('x1', courtPadding)
      .attr('y1', height - courtPadding)
      .attr('x2', width - courtPadding)
      .attr('y2', height - courtPadding)
      .attr('stroke', 'black');

    svg.append('line')
      .attr('x1', courtPadding)
      .attr('y1', courtPadding)
      .attr('x2', courtPadding)
      .attr('y2', height - courtPadding)
      .attr('stroke', 'black');

    svg.append('line')
      .attr('x1', width - courtPadding)
      .attr('y1', courtPadding)
      .attr('x2', width - courtPadding)
      .attr('y2', height - courtPadding)
      .attr('stroke', 'black');

    svg.selectAll('circle.shot')
      .data(this.shots)
      .enter()
      .append('circle')
      .attr('class', 'shot')
      .attr('cx', d => centerX + d.shot_loc_x * scale)
      .attr('cy', d => hoopY - d.shot_loc_y * scale)
      .attr('r', 5)
      .attr('fill', d => d.made ? 'green' : 'red')
      .attr('opacity', 0.7)
      .append('title')
      .text(d => `${d.action_type} - ${d.made ? 'Made' : 'Missed'}`);

    svg.selectAll('line.pass')
      .data(this.passes)
      .enter()
      .append('line')
      .attr('class', 'pass')
      .attr('x1', d => centerX + d.ball_start_loc_x * scale)
      .attr('y1', d => hoopY - d.ball_start_loc_y * scale)
      .attr('x2', d => centerX + d.ball_end_loc_x * scale)
      .attr('y2', d => hoopY - d.ball_end_loc_y * scale)
      .attr('stroke', d => d.completed_pass ? 'blue' : 'orange')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')
      .append('title')
      .text(d => `Pass - ${d.completed_pass ? 'Completed' : 'Failed'}`);

    svg.selectAll('circle.turnover')
      .data(this.turnovers)
      .enter()
      .append('circle')
      .attr('class', 'turnover')
      .attr('cx', d => centerX + d.tov_loc_x * scale)
      .attr('cy', d => hoopY - d.tov_loc_y * scale)
      .attr('r', 6)
      .attr('fill', 'purple')
      .attr('opacity', 0.7)
      .append('title')
      .text(d => `Turnover - ${d.action_type}`);

    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'black');
  }
}
