import { Component, OnInit } from '@angular/core';
import { BalanceElement, BalanceElementAsset, BalanceElementLiabilities } from './balance-element'
import { SVG, Svg, G, Rect, Point } from '@svgdotjs/svg.js'
import { BalanceElementService } from './balance-elements.service';
import { BalanceOperations, IBalanceOperation } from './balance-operations';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  balanceElementService: BalanceElementService;
  balanceOperations: IBalanceOperation[];
  selectedOperation: IBalanceOperation;
  currentValue: number = 30;

  executeOperation(selectedOperation: IBalanceOperation) {
    selectedOperation.run(this.currentValue);
    this.drawConvas();
  }

  constructor(balanceElements: BalanceElementService, balanceOperations: BalanceOperations) {
    this.balanceElementService = balanceElements;
    this.balanceOperations = balanceOperations.getBalanceOperations();
    this.selectedOperation = this.balanceOperations[0];
  }



  ngOnInit(): void {

    this.drawConvas();
  }

  drawConvas() {

    const convasSettings = {
      convasWidth: 1200,
      convasHeight: 670,
      privateSectorBSNestedWidth: 620,
      privateSectorBSNestedHeight: 320,
      governmentSectorBSNestedWidth: 420,
      governmentSectorBSNestedHeight: 320,
      horizontalIndentBetweenSectors: 20,
      aggregateSectorWidth: 420,
      aggregateSectorHeight: 190,
      aggregateLeftMargin: 190,
      totalSectorWidth: 210,
      totalSectorHeight: 120,
      verticalIdentBetweenSectors: 20,
      totalLeftMargin: 285
    };

    let svgExist: boolean = document.querySelectorAll('.convas>svg').length > 0;
    if (svgExist) {
      document.querySelectorAll('.convas>svg')[0].remove();
    }
    let canvas = SVG()
      .addTo('.convas')
      .size(convasSettings.convasWidth, convasSettings.convasHeight);

    //Total
    let totalSectorNested = canvas.nested();
    totalSectorNested.attr({
      id: 'totalSectorNested',
      width: convasSettings.totalSectorWidth,
      height: convasSettings.totalSectorHeight,
      x: convasSettings.totalLeftMargin,
      y: 0
    });
    totalSectorNested.rect(convasSettings.totalSectorWidth, convasSettings.totalSectorHeight).attr({
      id: 'totalSectorNestedRect',
      x: 0,
      y: 0,
      fill: 'transparent',
      //  stroke: '#000',
    });
    [this.balanceElementService.TotalEconomy]
      .forEach((balanceElement, index) => {
        this.fillBalanceElement(balanceElement, totalSectorNested, 1, index, 1 / 8);
      });

    //Aggregate
    let aggregateSectorNested = canvas.nested();

    aggregateSectorNested.attr({
      id: 'aggregateSectorNested',
      width: convasSettings.aggregateSectorWidth,
      height: convasSettings.aggregateSectorHeight,
      x: convasSettings.aggregateLeftMargin,
      y: convasSettings.totalSectorHeight + convasSettings.verticalIdentBetweenSectors,
    });
    aggregateSectorNested.rect(convasSettings.aggregateSectorWidth, convasSettings.aggregateSectorHeight).attr({
      id: 'aggregateSectorNestedRect',
      x: 0,
      y: 0,
      fill: 'transparent',
      //  stroke: '#000'

    });

    this.fillBrackets(aggregateSectorNested, aggregateSectorNested.width() / 2);

    [this.balanceElementService.FederalGovernmentSectorAggregate, this.balanceElementService.PrivateSectorAggregate]
      .forEach((balanceElement, index) => {
        this.fillBalanceElement(balanceElement, aggregateSectorNested, 2, index, 1 / 4);
      });


    //Federal Government sector
    let governmentSectorBSNested = canvas.nested();
    governmentSectorBSNested.attr({
      id: 'governmentSectorBSNested',
      width: convasSettings.governmentSectorBSNestedWidth,
      height: convasSettings.governmentSectorBSNestedHeight,
      x: convasSettings.horizontalIndentBetweenSectors,
      y: convasSettings.totalSectorHeight + convasSettings.verticalIdentBetweenSectors + convasSettings.aggregateSectorHeight + convasSettings.verticalIdentBetweenSectors
    });

    governmentSectorBSNested.rect(convasSettings.governmentSectorBSNestedWidth, convasSettings.governmentSectorBSNestedHeight).attr({
      id: 'governmentSectorBSNestedRect',
      x: 0,
      y: 0,
      fill: 'transparent',
      //  stroke: '#000',
    });

    this.fillBrackets(governmentSectorBSNested, governmentSectorBSNested.width() * 5 / 8);

    [this.balanceElementService.Treasury, this.balanceElementService.CentralBank].forEach((balanceElement, index) => {
      this.fillBalanceElement(balanceElement, governmentSectorBSNested, 2, index);
    });

    //Private Sector
    let privateSectorBSNested = canvas.nested();
    privateSectorBSNested.attr({
      id: 'privateSectorBSNested',
      width: convasSettings.privateSectorBSNestedWidth,
      height: convasSettings.privateSectorBSNestedHeight,
      x: convasSettings.horizontalIndentBetweenSectors + convasSettings.governmentSectorBSNestedWidth + convasSettings.horizontalIndentBetweenSectors,
      y: convasSettings.totalSectorHeight + convasSettings.verticalIdentBetweenSectors + convasSettings.aggregateSectorHeight + convasSettings.verticalIdentBetweenSectors
    });
    privateSectorBSNested.rect(convasSettings.privateSectorBSNestedWidth, convasSettings.privateSectorBSNestedHeight).attr({
      id: 'privateSectorBSNestedRect',
      x: 0,
      y: 0,
      fill: 'transparent',
      //  stroke: '#000',
    });
    this.fillBrackets(privateSectorBSNested, privateSectorBSNested.width() * 1 / 8);

    [this.balanceElementService.Banks, this.balanceElementService.Households, this.balanceElementService.Companies]
      .forEach((balanceElement, index) => {
        this.fillBalanceElement(balanceElement, privateSectorBSNested, 3, index);
      });

  }
  fillBrackets(svg: Svg, x: number) {
    let bracketsHeight = 20;
    svg.line(0, bracketsHeight, svg.width(), bracketsHeight).attr({
      stroke: '#7a9d96',
      'stroke-width': 3
    });
    svg.line(0, bracketsHeight, 0, bracketsHeight + bracketsHeight).attr({
      stroke: '#7a9d96',
      'stroke-width': 3
    });
    svg.line(svg.width(), bracketsHeight, svg.width(), bracketsHeight + bracketsHeight).attr({
      stroke: '#7a9d96',
      'stroke-width': 3
    });
    svg.line(x, bracketsHeight, x, 0).attr({
      stroke: '#7a9d96',
      'stroke-width': 3
    });
  }
  fillBalanceElement(balanceElement: BalanceElement, parentSvg: Svg, countColumns: number, indexOfElements: number, scale: number = 1) {

    //--------params----------

    let svgWidth = parentSvg.width() / countColumns; //Nested svg width for BalanceElement.

    let sumAssetsValue = balanceElement.assets.map(asset => asset.value).reduce((sum, currentAssetValue) => {
      return sum + currentAssetValue;
    }); //equal
    //Nested svg height for BalanceElement. Need calculate
    let svgHeight = sumAssetsValue * scale;


    const indentTextHeight = 20;//indent for bottom text 
    svgHeight = 2 * indentTextHeight + svgHeight; //total height
    const columnWidth = 90;
    const widthBetweenColumns = 10;
    const widthColumnMargin = 10;
    //----------------------

    let nestedSvg = parentSvg.nested().attr({
      id: `${balanceElement.name}NestedSvg`,
      style: 'font-size: 12px; font-weight: regular; text-anchor: middle; font-family: "Open Sans",sans-serif;',
      width: svgWidth,
      height: svgHeight,
      x: svgWidth * indexOfElements,
      y: parentSvg.height() - svgHeight
    });

    nestedSvg.rect(svgWidth, svgHeight).attr({
      id: `${balanceElement.name}NestedSvgRect`,
      //  stroke: 'black',
      fill: 'transparent',
      //  stroke: 'black',

      x: 0,
      y: 0
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
      y: 0,
      'font-size': 12,
      'font-style': 'italic'
    });

    //Assets text
    nestedSvg.text('Assets').attr({
      x: widthColumnMargin + columnWidth / 2,
      y: 0,
      fill: '#606060',
      'font-size': 12,
      'font-style': 'italic'
    });
    // Liabilities text
    nestedSvg.text('Liabilities').attr({
      x: widthColumnMargin + columnWidth + widthBetweenColumns + columnWidth / 2,
      y: 0,
      fill: '#606060',
      'font-size': 12,
      'font-style': 'italic'
    });

    //fill assets
    balanceElement.assets.forEach((asset, index, balanceElements) => {
      let sumPrevElementValues = balanceElements.filter((value, i) => i < index).length ?
        balanceElements.filter((value, i) => i < index).map(x => x.value).reduce((sum, currentValue) => sum + currentValue) * scale : 0;


      console.log(`index ${index}: ${sumPrevElementValues}`);
      //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
      nestedSvg.rect(columnWidth, asset.value * scale).attr({
        stroke: 'black',
        'stroke-width': 1,
        fill: asset.color,
        x: widthColumnMargin,
        y: sumPrevElementValues + indentTextHeight
      });
      //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
      nestedSvg.text(`${asset.name} $${asset.value}`).attr({
        x: widthColumnMargin + columnWidth / 2,
        y: sumPrevElementValues + indentTextHeight - 5,
        fill: 'white',
        visibility: true
      });

    });

    //fill liabilities
    balanceElement.liabilities.forEach((liability, index, balanceElements) => {
      let sumPrevElementValues = balanceElements.filter((value, i) => i < index).length ?
        balanceElements.filter((value, i) => i < index).map(x => x.value).reduce((sum, currentValue) => sum + currentValue) * scale : 0;


      console.log(`index ${index}: ${sumPrevElementValues}`);
      //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
      nestedSvg.rect(columnWidth, liability.value * scale).attr({
        stroke: 'black',
        'stroke-width': 1,
        fill: liability.color,
        x: widthColumnMargin + columnWidth + widthBetweenColumns,
        y: sumPrevElementValues + indentTextHeight
      });
      //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
      nestedSvg.text(`${liability.name} $${liability.value}`).attr({
        x: widthColumnMargin + columnWidth + widthBetweenColumns + columnWidth / 2,
        y: sumPrevElementValues + indentTextHeight - 5,
        fill: 'white',
        visibility: true
      });

    });


  }

}
