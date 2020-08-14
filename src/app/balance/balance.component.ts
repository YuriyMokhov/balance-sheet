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

      const convasSettings = {
        privateSectorBSNestedWidth: 540,
        privateSectorBSNestedHeight: 320,
        balanceElementNestedWidth: 170,
        // balanceElementNestedHeight: 145
      };

      let privateSectorBSNested = canvas.nested();
      privateSectorBSNested.attr({
        id: 'privateSectorBSNested',
        width: convasSettings.privateSectorBSNestedWidth,
        height: convasSettings.privateSectorBSNestedHeight
      });
      privateSectorBSNested.rect(convasSettings.privateSectorBSNestedWidth, convasSettings.privateSectorBSNestedHeight).attr({
        id: 'privateSectorBSNestedRect',
        x: 0,
        y: 0,
        fill: 'white',
        stroke: '#000',
      });

      //<text x="920" y="285" id="priScaleLabel" style="font-size: 12px; font-style: italic; font-family: arial,sans-serif; fill: black;">Scale: 1/1</text>
      // privateSectorBSNested
      //   .text('Целые сектора')
      //   .attr({
      //     id: 'priScaleLabel',
      //     x: 0,
      //     y: 0,
      //     style: 'font-size: 12px; font-style: italic; font-family: arial,sans-serif; fill: black;'
      //   });




      this.fillBalanceElement(baseElements[0], privateSectorBSNested, 3);


    });


  }

  fillBalanceElement(balanceElement: BalanceElement, parentSvg: Svg, countColumns: number) {

    let svgHeight = 0; //Nested svg height for BalanceElement. Need calculate
    let svgWidth = parentSvg.width() / countColumns; //Nested svg width for BalanceElement.

    balanceElement.assets.forEach((asset) => { //Calculate svg height from the asset's values
      svgHeight += asset.value;
    });
    const topTextHeight = 20; //indent for top text 
    const bottomTextHeight = 20;//indent for bottom text 
    svgHeight = topTextHeight + svgHeight + bottomTextHeight; //total height

    let nestedSvg = parentSvg.nested().attr({
      id: `${balanceElement.name}NestedSvg`,
      style: 'font-size: 9px; font-weight: bold; text-anchor: middle; font-family: arial,sans-serif;',
      width: svgWidth,
      height: svgHeight,
      x: 0,
      y: parentSvg.height() - svgHeight
    });
    nestedSvg.rect(nestedSvg.width(), nestedSvg.height()).attr({
      id: `${balanceElement.name}NestedSvgRect`,
      stroke: 'black',
      fill: 'white'
    });

    //bottom line
    nestedSvg.line(0, svgHeight - bottomTextHeight, svgWidth, svgHeight - bottomTextHeight).attr({
      stroke: 'black',
      'stroke-widht': 2
    });
    //bottom text
    nestedSvg.text('Банки').attr({
      x: svgWidth / 2,
      y: svgHeight - bottomTextHeight,
      style: 'fill:black'
    });



    //group total result
    nestedSvg.text('$120').attr({
      x: 460,
      y: 445
    });
    //Assets text
    nestedSvg.text('Assets').attr({
      x: 420,
      y: 445,
      fill: '#606060',
      'font-style': 'italic'
    });
    // Liabilities text
    nestedSvg.text('Liabilities').attr({
      x: 500,
      y: 445,
      fill: '#606060',
      'font-style': 'italic'
    });
    //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
    nestedSvg.rect(70, 40).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'mediumblue',
      x: 465,
      y: 450
    });
    //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
    nestedSvg.text('Equity $40').attr({
      x: 500,
      y: 460,
      fill: 'white',
      visibility: true
    });
    //<rect width="70" height="40" stroke="black" stroke-width="1" fill="darkgreen" x="385" y="450"></rect>
    nestedSvg.rect(70, 40).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'darkgreen',
      x: 385,
      y: 450
    });
    //<text style="fill: white;" x="420" y="460">Currency $40</text>
    nestedSvg.text('Currency $40').attr({
      x: 420,
      y: 460,
      fill: 'white'
    });
    //<rect width="70" height="80" stroke="black" stroke-width="1" fill="darkgreen" x="385" y="490"></rect>
    nestedSvg.rect(70, 80).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'darkgreen',
      x: 385,
      y: 490
    });
    //<text style="fill: white;" x="420" y="500">Reserves $80</text>
    nestedSvg.text('Reserves $80').attr({
      x: 420,
      y: 500,
      fill: 'white'
    });
    //<rect width="70" height="80" stroke="black" stroke-width="1" fill="darkred" x="465" y="490"></rect>
    nestedSvg.rect(70, 80).attr({
      stroke: 'black',
      'stroke-width': 1,
      fill: 'darkred',
      x: 465,
      y: 490
    });
    //<text style="fill:white" x="500" y="500">Deposits $80</text>
    nestedSvg.text('Deposits $80').attr({
      x: 500,
      y: 500,
      fill: 'white'
    });

  }

}
