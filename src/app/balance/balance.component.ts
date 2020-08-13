import { Component, OnInit } from '@angular/core';
import { BalanceElement } from './balance-element'
import { BalanceService } from './balance-service.service';
import { SVG, Svg, G, Rect } from '@svgdotjs/svg.js'

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

    this.balanceService.getData().subscribe(baseElements => {
      const width = window.innerWidth - 10
      const height = window.innerHeight - 10

      let canvas = SVG()
        .addTo('body')
        .size(width, height);

      canvas.nested().size(width / 2, height / 2).fill('blue');

      const privateSectorBSGroup = canvas.group()
        .attr({
          id: 'privateSectorBSGroup'
        });

      let wrapper = privateSectorBSGroup.rect(540, 320).attr({
        id: 'priBgRect',
        x: 375,
        y: 270,
        fill: 'white',
        stroke: '#000',
      });

      //<text x="920" y="285" id="priScaleLabel" style="font-size: 12px; font-style: italic; font-family: arial,sans-serif; fill: black;">Scale: 1/1</text>
      privateSectorBSGroup
        .text('Целые сектора')
        .attr({
          id: 'priScaleLabel',
          x: 920,
          y: 285,
          style: 'font-size: 12px; font-style: italic; font-family: arial,sans-serif; fill: black;'
        });


      let bankBSGroup = privateSectorBSGroup.group().attr({
        id: 'bankBS',
        style: 'font-size: 9px; font-weight: bold; text-anchor: middle; font-family: arial,sans-serif;'
      });

      this.fillGroup(baseElements, bankBSGroup, wrapper);


    });


  }

  fillGroup(balanceElements: BalanceElement[], group: G, wrapper: Rect) {
    let element = balanceElements[0];
    //group lower line
    group.line(wrapper.x(), wrapper.y(), 545, 571).attr({//group.line(375, 571, 545, 571).attr({
      style: 'stroke:rgb(99,99,99);stroke-width:2'
    });
    //group label
    group.text('Банки').attr({
      x: 460,
      y: 580,
      style: 'fill:black'
    });
    //group total result
    group.text('$120').attr({
      x: 460,
      y: 445
    });
    //Assets text
    group.text('Assets').attr({
      x: 420,
      y: 445,
      fill: '#606060',
      'font-style': 'italic'
    });
    // Liabilities text
    group.text('Liabilities').attr({
      x: 500,
      y: 445,
      fill: '#606060',
      'font-style': 'italic'
    });
    //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
    group.rect(70, 40).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'mediumblue',
      x: 465,
      y: 450
    });
    //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
    group.text('Equity $40').attr({
      x: 500,
      y: 460,
      fill: 'white',
      visibility: true
    });
    //<rect width="70" height="40" stroke="black" stroke-width="1" fill="darkgreen" x="385" y="450"></rect>
    group.rect(70, 40).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'darkgreen',
      x: 385,
      y: 450
    });
    //<text style="fill: white;" x="420" y="460">Currency $40</text>
    group.text('Currency $40').attr({
      x: 420,
      y: 460,
      fill: 'white'
    });
    //<rect width="70" height="80" stroke="black" stroke-width="1" fill="darkgreen" x="385" y="490"></rect>
    group.rect(70, 80).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'darkgreen',
      x: 385,
      y: 490
    });
    //<text style="fill: white;" x="420" y="500">Reserves $80</text>
    group.text('Reserves $80').attr({
      x: 420,
      y: 500,
      fill: 'white'
    });
    //<rect width="70" height="80" stroke="black" stroke-width="1" fill="darkred" x="465" y="490"></rect>
    group.rect(70, 80).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'darkred',
      x: 465,
      y: 490
    });
    //<text style="fill:white" x="500" y="500">Deposits $80</text>
    group.text('Deposits $80').attr({
      x: 500,
      y: 500,
      fill: 'white'
    });

  }

}
