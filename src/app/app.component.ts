import { Price } from './price';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  oilPrice: Price[] = new Array();

  margin: any;

  width: number;

  height: number;

  mmddyyFormat = d3.timeParse('%m/%d/%Y');

  maximum: number;

  minimum: number;

  j: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.margin = { top: 50, right: 50, bottom: 50, left: 50 };
    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom;


    this.showChart();
  }

  showChart() {

    this.http.get<[{}]>('./assets/txn-data.json').subscribe(data => {

      data.forEach((obj, index) => this.oilPrice.push(
        new Price(this.mmddyyFormat(obj['date']), obj['predicted'], obj['close'], obj['profit'], obj['action'])));


      this.maximum = Math.ceil(Math.max.apply(Math, data.map(function (o) { return o['close']; })));
      this.minimum = Math.floor(Math.min.apply(Math, data.map(function (o) { return o['close']; }))) - 2;

      const svg = d3.select('#line-chart').append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform',
          'translate(' + this.margin.left + ',' + this.margin.top + ')');

      ///////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////// BAR ///////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////

      const profit: Price[] = new Array();
      profit.push(new Price(this.oilPrice[0].date, 0, 0, 105, ''));
      profit.push(new Price(this.oilPrice[10].date, 0, 0, 110, ''));
      profit.push(new Price(this.oilPrice[20].date, 0, 0, 120, ''));
      profit.push(new Price(this.oilPrice[30].date, 0, 0, 130, ''));
      profit.push(new Price(this.oilPrice[40].date, 0, 0, 140, ''));
      profit.push(new Price(this.oilPrice[50].date, 0, 0, 150, ''));
      profit.push(new Price(this.oilPrice[60].date, 0, 0, 160, ''));
      profit.push(new Price(this.oilPrice[70].date, 0, 0, 170, ''));
      profit.push(new Price(this.oilPrice[80].date, 0, 0, 180, ''));
      profit.push(new Price(this.oilPrice[90].date, 0, 0, 190, ''));
      profit.push(new Price(this.oilPrice[100].date, 0, 0, 200, ''));

      console.table(profit);


      // const xScaleProfit = d3.scaleTime()
      //   .domain(d3.extent(profit, function (d) { return d.date; }))
      //   .range([this.width, 0]);

      const yScaleProfit = d3.scaleLinear()
        .domain([95, 205])
        .range([this.height, 0]);




      // Add the Y1 Axis
      svg.append('g')
        .attr('class', 'axisRed')
        .attr('transform', 'translate( ' + this.width + ', 0 )')
        .call(d3.axisRight(yScaleProfit));


      const self = this;

      const xScaleProfit = d3.scaleTime().range([this.width, 0]).domain(d3.extent(profit, d => d.date));

      // const rect = svg.selectAll('rect').data(profit);

      // rect.enter().append('rect')
      //   .merge(rect)
      //   .attr('class', 'bar')
      //   .style('stroke', 'none')
      //   .style('fill', '#ccc')
      //   .attr('x', function (d) { return xScaleProfit(d.date) - 10; })
      //   .attr('width', function (d) { return 20; })
      //   .attr('y', function (d) { return self.height - yScaleProfit(d.profit); })
      //   .attr('height', function (d) { return yScaleProfit(d.profit); });

      /////////////////////////////////////////////////////////////////////////////////////////////

      const barWidth = 20;

      const rect = svg.selectAll('rect').data(profit);

      rect.enter().append('rect').merge(rect)
        .attr('x', function (d) { return xScaleProfit(d.date) - 10; })
        .attr('y', d => this.height - yScaleProfit(d.profit))
        .attr('width', barWidth - 2)
        .attr('height', d => yScaleProfit(d.profit));

      // // Add text to rectangles
      // rect.append('text')
      //   .attr('y', d => this.height - yScale(d.close) - 5)
      //   .attr('text-anchor', 'middle')
      //   .attr('x', barWidth / 2)
      //   .text(d => d.profit);



      return ;


      ///////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////// LINE ///////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////

      const xScale = d3.scaleTime()
        .domain(d3.extent(this.oilPrice, function (d) { return d.date; }))
        .range([0, this.width]);

      const yScale = d3.scaleLinear()
        .domain(d3.extent(this.oilPrice, function (d) { return d.close; }))
        .range([this.height, 0]);

      const line = d3.line<Price>()
        .x(function (d: Price, i) { return xScale(d.date); })
        .y(function (d: Price) { return yScale(d.close); });
      // .curve(d3.curveMonotoneX);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3.axisBottom(xScale));


      svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale));

      svg.append('path')
        .datum(this.oilPrice)
        .attr('class', 'line')
        .attr('d', line);

      svg.selectAll('.dot')
        .data(this.oilPrice)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', function (d, i) { return xScale(d.date); })
        .attr('cy', function (d) { return yScale(d.close); })
        .attr('r', 2);







    });
  }

}
