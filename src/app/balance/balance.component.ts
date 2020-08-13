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
    this.graph = SVG().addTo('app-balance #graph-wrapper').size('100%', '100%');

    this.balanceService.getData().subscribe(data => {
      this.fillGraph(data, this.graph);
      console.log(data);
    });


  }

  fillGraph(balanceElements: BalanceElement[], draw: Svg) {
    balanceElements.forEach((balanceElement, i) => {
      let text = draw.text(`${balanceElement.name}`);
      text.move(i * 100, 0);


    });

    var line = draw.line(0, 0, 100, 150).stroke({ width: 5 })


  }

}
