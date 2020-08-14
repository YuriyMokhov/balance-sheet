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
        governmentSectorBSNestedWidth: 355,
        governmentSectorBSNestedHeight: 320
      };

      //Federal Government sector
      let governmentSectorBSNested = canvas.nested();
      governmentSectorBSNested.attr({
        id: 'governmentSectorBSNested',
        width: convasSettings.governmentSectorBSNestedWidth,
        height: convasSettings.governmentSectorBSNestedHeight
      });
      governmentSectorBSNested.rect(convasSettings.governmentSectorBSNestedWidth, convasSettings.governmentSectorBSNestedHeight).attr({
        id: 'governmentSectorBSNestedRect',
        x: 0,
        y: 0,
        fill: 'white',
        stroke: '#000',
      });
      baseElements.forEach((baseElement, index) => {
        this.fillBalanceElement(baseElement, privateSectorBSNested, 2, index);
      });

      //Private Sector
      let privateSectorBSNested = canvas.nested();
      privateSectorBSNested.attr({
        id: 'privateSectorBSNested',
        width: convasSettings.privateSectorBSNestedWidth,
        height: convasSettings.privateSectorBSNestedHeight
      });
      privateSectorBSNested.rect(convasSettings.privateSectorBSNestedWidth, convasSettings.privateSectorBSNestedHeight).attr({
        id: 'privateSectorBSNestedRect',
        x: convasSettings.governmentSectorBSNestedWidth,
        y: 0,
        fill: 'white',
        stroke: '#000',
      });
      baseElements.forEach((baseElement, index) => {
        this.fillBalanceElement(baseElement, privateSectorBSNested, 3, index);
      });



    });


  }

  fillBalanceElement(balanceElement: BalanceElement, parentSvg: Svg, countColumns: number, indexOfElements: number) {

    //--------params----------

    let svgWidth = parentSvg.width() / countColumns; //Nested svg width for BalanceElement.
    //Nested svg height for BalanceElement. Need calculate
    let svgHeight = balanceElement.assets.map(asset => asset.value).reduce((sum, currentAssetValue) => {
      return sum + currentAssetValue;
    })
    let sumAssetsValue = svgHeight; //equal

    const indentTextHeight = 20;//indent for bottom text 
    svgHeight = 2 * indentTextHeight + svgHeight; //total height
    const columnWidth = 70;
    const widthBetweenColumns = 20;
    const widthColumnMargin = 10;
    //----------------------

    let nestedSvg = parentSvg.nested().attr({
      id: `${balanceElement.name}NestedSvg`,
      style: 'font-size: 9px; font-weight: bold; text-anchor: middle; font-family: arial,sans-serif;',
      width: svgWidth,
      height: svgHeight,
      x: svgWidth * indexOfElements,
      y: parentSvg.height() - svgHeight
    });
    nestedSvg.rect(nestedSvg.width(), nestedSvg.height()).attr({
      id: `${balanceElement.name}NestedSvgRect`,
      stroke: 'black',
      fill: 'white'
    });

    //bottom line
    nestedSvg.line(0, svgHeight - indentTextHeight, svgWidth, svgHeight - indentTextHeight).attr({
      stroke: 'black',
      'stroke-widht': 2
    });
    //bottom text
    nestedSvg.text(`${balanceElement.name}`).attr({
      x: svgWidth / 2,
      y: svgHeight - indentTextHeight,
      style: 'fill:black'
    });

    //total result
    nestedSvg.text(`$${sumAssetsValue}`).attr({
      x: svgWidth / 2,
      y: 0
    });

    //Assets text
    nestedSvg.text('Assets').attr({
      x: widthColumnMargin + columnWidth / 2,
      y: 0,
      fill: '#606060',
      'font-style': 'italic'
    });
    // Liabilities text
    nestedSvg.text('Liabilities').attr({
      x: widthColumnMargin + columnWidth + widthBetweenColumns + columnWidth / 2,
      y: 0,
      fill: '#606060',
      'font-style': 'italic'
    });

    //fill assets
    let columnColors = ['red', 'blue', 'green'];
    balanceElement.assets.forEach((asset, index, balanceElements) => {
      let sumPrevElementValues = balanceElements.filter((value, i) => i < index).length ?
        balanceElements.filter((value, i) => i < index).map(x => x.value).reduce((sum, currentValue) => sum + currentValue) : 0;


      console.log(`index ${index}: ${sumPrevElementValues}`);
      //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
      nestedSvg.rect(columnWidth, asset.value).attr({
        stroke: 'black',
        'stroke-width': 1,
        fill: columnColors[index],
        x: widthColumnMargin,
        y: sumPrevElementValues + indentTextHeight
      });
      //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
      nestedSvg.text(`${asset.name} ${asset.value}`).attr({
        x: widthColumnMargin + columnWidth / 2,
        y: sumPrevElementValues + indentTextHeight,
        fill: 'white',
        visibility: true
      });

    });

    //fill liabilities
    balanceElement.liabilities.forEach((liability, index, balanceElements) => {
      let sumPrevElementValues = balanceElements.filter((value, i) => i < index).length ?
        balanceElements.filter((value, i) => i < index).map(x => x.value).reduce((sum, currentValue) => sum + currentValue) : 0;


      console.log(`index ${index}: ${sumPrevElementValues}`);
      //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
      nestedSvg.rect(columnWidth, liability.value).attr({
        stroke: 'black',
        'stroke-width': 1,
        fill: columnColors[index],
        x: widthColumnMargin + columnWidth + widthBetweenColumns,
        y: sumPrevElementValues + indentTextHeight
      });
      //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
      nestedSvg.text(`${liability.name} ${liability.value}`).attr({
        x: widthColumnMargin + columnWidth + widthBetweenColumns + columnWidth / 2,
        y: sumPrevElementValues + indentTextHeight,
        fill: 'white',
        visibility: true
      });

    });


  }

}
