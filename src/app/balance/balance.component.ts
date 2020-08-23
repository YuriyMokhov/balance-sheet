import { Component, OnInit, Input } from '@angular/core';
import { BalanceElement, BalanceElementAsset, BalanceElementLiabilities } from './balance-element'
import { SVG, Svg, Runner, Text, Path, Element } from '@svgdotjs/svg.js'
import { BalanceElementService } from './balance-elements.service';
import { BalanceOperationService } from './balance-operation.service';
import { BalanceOperationBase } from './balance-operation'

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']

})
export class BalanceComponent implements OnInit {

  balanceElementService: BalanceElementService;
  balanceOperations: BalanceOperationBase[];
  selectedOperation: BalanceOperationBase;
  currentValue: number = 30;
  replayButtonEnabled: boolean = false;


  constructor(balanceElements: BalanceElementService, balanceOperationService: BalanceOperationService) {
    this.balanceElementService = balanceElements;
    this.balanceOperations = balanceOperationService.getBalanceOperations();
    this.selectedOperation = this.balanceOperations[0];
  }



  ngOnInit(): void {

    this.initCanvas(); //create static elements
    this.updateConvas();

  }

  executeOperation(selectedOperation: BalanceOperationBase) {
    selectedOperation.run(this.currentValue);
    this.updateConvas({ duration: 1500, ease: 'ease-in-out' });
    this.replayButtonEnabled = true;
  }

  replayOperation(selectedOperation: BalanceOperationBase) {
    let self = this;
    new Promise((resolve, reject) => {
      selectedOperation.reverse(self.currentValue);
      this.updateConvas({ duration: 200, ease: 'ease-in-out' });
      setTimeout(() => {
        resolve();
      }, 200);
    }).then(() => {
      selectedOperation.run(self.currentValue);
      this.updateConvas({ duration: 1500, ease: 'ease-in-out' });
    });

  }

  reverseOperation(selectedOperation: BalanceOperationBase) {
    selectedOperation.reverse(this.currentValue);
    this.updateConvas({ duration: 1500, ease: 'ease-in-out' });
    this.replayButtonEnabled = false;
  }

  resetAllOperations(selectedOperation: BalanceOperationBase) {
    selectedOperation.reset();
    this.updateConvas();
    this.replayButtonEnabled = false;
  }
  selectedOperationChange() {
    this.replayButtonEnabled = false;
  }

  initCanvas(): Svg {
    const canvasSettings = {
      canvasWidth: 1200,
      canvasHeight: 670,
      privateSectorBSNestedWidth: 630,
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

    let canvas = SVG()
      .addTo('.canvas')
      .size(canvasSettings.canvasWidth, canvasSettings.canvasHeight);

    //Total
    let totalSectorNested = canvas.nested();
    totalSectorNested.attr({
      id: 'totalSectorParent',
      width: canvasSettings.totalSectorWidth,
      height: canvasSettings.totalSectorHeight,
      x: canvasSettings.totalLeftMargin,
      y: 0
    });

    //Aggregate
    let aggregateSectorNested = canvas.nested();

    aggregateSectorNested.attr({
      id: 'aggregateSectorParent',
      width: canvasSettings.aggregateSectorWidth,
      height: canvasSettings.aggregateSectorHeight,
      x: canvasSettings.aggregateLeftMargin,
      y: canvasSettings.totalSectorHeight + canvasSettings.verticalIdentBetweenSectors,
    });

    this.fillBrackets(aggregateSectorNested, aggregateSectorNested.width() / 2);


    //Federal Government sector
    let governmentSectorBSNested = canvas.nested();
    governmentSectorBSNested.attr({
      id: 'governmentSectorBSParent',
      width: canvasSettings.governmentSectorBSNestedWidth,
      height: canvasSettings.governmentSectorBSNestedHeight,
      x: canvasSettings.horizontalIndentBetweenSectors,
      y: canvasSettings.totalSectorHeight + canvasSettings.verticalIdentBetweenSectors + canvasSettings.aggregateSectorHeight + canvasSettings.verticalIdentBetweenSectors
    });


    this.fillBrackets(governmentSectorBSNested, governmentSectorBSNested.width() * 5 / 8);

    //Private Sector
    let privateSectorBSNested = canvas.nested();
    privateSectorBSNested.attr({
      id: 'privateSectorBSParent',
      width: canvasSettings.privateSectorBSNestedWidth,
      height: canvasSettings.privateSectorBSNestedHeight,
      x: canvasSettings.horizontalIndentBetweenSectors + canvasSettings.governmentSectorBSNestedWidth + canvasSettings.horizontalIndentBetweenSectors,
      y: canvasSettings.totalSectorHeight + canvasSettings.verticalIdentBetweenSectors + canvasSettings.aggregateSectorHeight + canvasSettings.verticalIdentBetweenSectors
    });
    this.fillBrackets(privateSectorBSNested, privateSectorBSNested.width() * 1 / 8);


    return canvas;
  }

  updateConvas(animationInfo?: { duration: number, ease: string }) {
    //Total section
    [this.balanceElementService.TotalEconomy]
      .forEach((balanceElement, index) => {
        this.fillBalanceElement(balanceElement, SVG('#totalSectorParent') as Svg, 1, index, 1 / 8, animationInfo);
      });

    //Aggreggate
    [this.balanceElementService.FederalGovernmentSectorAggregate, this.balanceElementService.PrivateSectorAggregate]
      .forEach((balanceElement, index) => {
        this.fillBalanceElement(balanceElement, SVG('#aggregateSectorParent') as Svg, 2, index, 1 / 4, animationInfo);
      });
    //Federal government
    [this.balanceElementService.Treasury, this.balanceElementService.CentralBank].forEach((balanceElement, index) => {
      this.fillBalanceElement(balanceElement, SVG('#governmentSectorBSParent') as Svg, 2, index, 1, animationInfo);
    });

    //Private sector
    [this.balanceElementService.Banks, this.balanceElementService.Households, this.balanceElementService.Companies]
      .forEach((balanceElement, index) => {
        this.fillBalanceElement(balanceElement, SVG('#privateSectorBSParent') as Svg, 3, index, 1, animationInfo);
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



  //element from two color columns
  fillBalanceElement(balanceElement: BalanceElement, parentSvg: Svg, countColumns: number,
    indexOfElements: number, scale: number = 1,
    animationInfo: { duration?: number, ease?: string } = { duration: 0, ease: 'ease-in-out' }) {

    //--------params----------

    let svgWidth = parentSvg.width() / countColumns; //Nested svg width for BalanceElement.

    let sumAssetsValue = balanceElement.assets.map(asset => asset.value).reduce((sum, currentAssetValue) => {
      return sum + currentAssetValue;
    }); //equal
    //Nested svg height for BalanceElement. Need calculate
    const indentTextHeight = 20;//indent for bottom text 
    let svgHeight = 2 * indentTextHeight + sumAssetsValue * scale; //total height
    const columnWidth = 90;
    const widthBetweenColumns = 10;
    const widthColumnMargin = 10;
    //----------------------

    // let nestedSvg: Svg;
    let nestedSvg = SVG(`#${balanceElement.id}NestedSvg`) as Svg;
    if (!nestedSvg) { //create
      nestedSvg = parentSvg.nested().attr({
        id: `${balanceElement.id}NestedSvg`,
        style: 'font-size: 12px; font-weight: regular; text-anchor: middle; font-family: "Open Sans",sans-serif;',
        width: svgWidth,
        height: svgHeight,
        x: svgWidth * indexOfElements,
        y: parentSvg.height() - svgHeight
      });
    }
    else { //update
      nestedSvg.animate(animationInfo).size(svgWidth, svgHeight)
        .move(svgWidth * indexOfElements, parentSvg.height() - svgHeight);
    }

    //bottom line
    let bottom_line = SVG(`#${nestedSvg.id()}_bottom_line`);
    if (!bottom_line) {
      nestedSvg.line(0, svgHeight - indentTextHeight, svgWidth, svgHeight - indentTextHeight).attr({
        id: `${nestedSvg.id()}_bottom_line`,
        stroke: 'black',
        'stroke-widht': 2
      });
    }
    else bottom_line.animate(animationInfo).y(svgHeight - indentTextHeight);

    //bottom text
    let bottom_text = SVG(`#${nestedSvg.id()}_bottom_text`);
    if (!bottom_text) {
      nestedSvg.text(`${balanceElement.name}`).attr({
        id: `${nestedSvg.id()}_bottom_text`,
        x: svgWidth / 2,
        y: svgHeight - indentTextHeight,
        style: 'fill:black'
      });
    }
    else bottom_text.animate(animationInfo).attr({ y: svgHeight - indentTextHeight });


    //total result
    let total_result = SVG(`#${nestedSvg.id()}_total_result`) as Text;
    if (!total_result) {
      nestedSvg.text(`$${sumAssetsValue}`).attr({
        id: `${nestedSvg.id()}_total_result`,
        x: svgWidth / 2,
        y: 0,
        'font-size': 12,
        'font-style': 'italic'
      });
    } else total_result.text(`$${sumAssetsValue}`);


    //Assets text
    let asset_text = SVG(`#${nestedSvg.id()}_asset_text`) as Text;
    if (!asset_text) {
      nestedSvg.text('Assets').attr({
        id: `${nestedSvg.id()}_asset_text`,
        x: widthColumnMargin + columnWidth / 2,
        y: 0,
        fill: '#606060',
        'font-size': 12,
        'font-style': 'italic'
      });
    }
    //else total_result.text(`$${sumAssetsValue}`)


    // Liabilities text
    let liabilities_text = SVG(`#${nestedSvg.id()}_liabilities_text`) as Text;
    if (!liabilities_text) {
      nestedSvg.text('Liabilities').attr({
        id: `${nestedSvg.id()}_liabilities_text`,
        x: widthColumnMargin + columnWidth + widthBetweenColumns + columnWidth / 2,
        y: 0,
        fill: '#606060',
        'font-size': 12,
        'font-style': 'italic'
      });
    }


    //fill assets
    balanceElement.assets.forEach((asset, index, balanceElements) => {
      let sumPrevElementValues = balanceElements.filter((value, i) => i < index).length ?
        balanceElements.filter((value, i) => i < index).map(x => x.value).reduce((sum, currentValue) => sum + currentValue) * scale : 0;


      console.log(`index ${index}: ${sumPrevElementValues}`);
      //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
      let rectId = `${nestedSvg.id()}_${asset.name.replace(/\./g, '')}`;
      let rect = SVG(`#${rectId}`);
      if (!rect) {//create
        nestedSvg.rect(columnWidth, asset.value * scale).attr({
          id: rectId,
          stroke: 'black',
          'stroke-width': 0.5,
          fill: asset.color,
          'fill-opacity': 0.8,
          x: widthColumnMargin,
          y: sumPrevElementValues + indentTextHeight
        });
      }
      else rect.animate(animationInfo).dy((sumPrevElementValues + indentTextHeight) - rect.y()).height(asset.value * scale);


      //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
      let asset_value_id = `${nestedSvg.id()}_${asset.name.replace(/\./g, '')}_value`;
      let asset_value = SVG(`#${asset_value_id}`) as Text;
      if (!asset_value) {
        nestedSvg.text(`${asset.name} $${asset.value}`).attr({
          id: asset_value_id,
          x: widthColumnMargin + columnWidth / 2,
          y: sumPrevElementValues + indentTextHeight - 5,
          fill: 'white',
          visibility: true
        });
      }
      else asset_value.text(`${asset.name} $${asset.value}`)
        .animate(animationInfo).dy((sumPrevElementValues + indentTextHeight) - rect.y());
    });

    //fill liabilities
    balanceElement.liabilities.forEach((liability, index, balanceElements) => {
      let sumPrevElementValues = balanceElements.filter((value, i) => i < index).length ?
        balanceElements.filter((value, i) => i < index).map(x => x.value).reduce((sum, currentValue) => sum + currentValue) * scale : 0;


      console.log(`index ${index}: ${sumPrevElementValues}`);
      //<rect width="70" height="40" stroke="black" stroke-width="1" fill="mediumblue" x="465" y="450"></rect>
      let rectId = `${nestedSvg.id()}_${liability.name.replace(/\./g, '')}`;
      let rect = SVG(`#${rectId}`);

      if (!rect) {//create
        nestedSvg.rect(columnWidth, liability.value * scale).attr({
          id: rectId,
          stroke: 'black',
          'stroke-width': 0.5,
          'fill-opacity': 0.8,
          fill: liability.color,
          x: widthColumnMargin + columnWidth + widthBetweenColumns,
          y: sumPrevElementValues + indentTextHeight
        });
      }
      else rect.animate(animationInfo).dy((sumPrevElementValues + indentTextHeight) - rect.y()).height(liability.value * scale);

      //<text style="fill: white;" x="500" y="460" visibility="true">Equity $40</text>
      let liability_value_id = `${nestedSvg.id()}_${liability.name.replace(/\./g, '')}_value`;
      let liability_value = SVG(`#${liability_value_id}`) as Text;
      if (!liability_value) {
        nestedSvg.text(`${liability.name} $${liability.value}`).attr({
          id: liability_value_id,
          x: widthColumnMargin + columnWidth + widthBetweenColumns + columnWidth / 2,
          y: sumPrevElementValues + indentTextHeight - 5,
          fill: 'white',
          visibility: true
        });
      }
      else liability_value.text(`${liability.name} $${liability.value}`)
        .animate(animationInfo).dy((sumPrevElementValues + indentTextHeight) - rect.y());


    });


  }

}
