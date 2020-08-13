import { Component, OnInit } from '@angular/core';
import { BalanceElement } from './balance-element'
import { BalanceService } from './balance-service.service';
import { SVG, Svg } from '@svgdotjs/svg.js'

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  private balanceService: BalanceService;
  private graph: Svg;

  constructor(balanceService: BalanceService) {
    this.balanceService = balanceService;
  }

  ngOnInit(): void {
    // this.graph = SVG().addTo('app-balance #graph-wrapper').size('100%', '100%');

    // this.balanceService.getData().subscribe(data => {
    //   this.fillGraph(data, this.graph);
    //   console.log(data);
    // });

    const width = window.innerWidth - 10
    const height = window.innerHeight - 10

    const canvas = SVG()
      .addTo('body')
      .size(width, height)

    // Create a group and add 5 lines
    const group = canvas.group();

    let list = [30, 60, 90, 120];
    let lines = list.map((l) => {
      let line = group.line(0, 0, 0, 100).x(l).stroke("red");
      return line;
    });
    // list.forEach((l) => {
    //   group.line(0, 0, 0, 100).x(l)
    // });


    // Move the group to the center and color all lines
    group.center(width / 2, height / 2)
    //  lines.stroke({ color: '#ccc', width: 10 })
  }

  fillGraph(balanceElements: BalanceElement[], draw: Svg) {
    // balanceElements.forEach((balanceElement, i) => {
    //   let text = draw.text(`${balanceElement.name}`);
    //   text.move(i * 100, 0);


    // });

    // var line = draw.line(0, 0, 100, 150).stroke({ width: 5 })
    // const width = window.innerWidth - 10
    // const height = window.innerHeight - 10

    // const canvas = SVG()
    //   .addTo('body')
    //   .size(width, height)

    // // Create a group and add 5 lines
    // const group = canvas.group()
    // const lines = new SVG.List([0, 30, 60, 90, 120].map(
    //   tx => group.line(0, 0, 0, 100).x(tx)
    // ));

  }

}
