import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { Price } from '../price';


@Component({
  selector: 'app-chart-two',
  templateUrl: './axis-test-01.component.html',
  styleUrls: ['./axis-test-01.component.css']
})
export class AxisTest01Component implements OnInit {

  mmddyyFormat = d3.timeParse('%Y-%m-%d');

  xAxisScale: any;
  yAxisScale: any;

  gX: any;
  gY: any;

  circles: any;

  xAxis: any;
  yAxis: any;

  svgWidth = 800;
  svgHeight = 300;

  margin = { top: 30, right: 40, bottom: 50, left: 60 };

  width = this.svgWidth - this.margin.left - this.margin.right;
  height = this.svgHeight - this.margin.top - this.margin.bottom;


  transactions = [];

  buys = [];

  sales = [];

  // instrumentPrice = {};

  startIndex = 0;

  lastX = 0;

  factors = ["factor_1", "factor_2", "factor_3"];

  innerSpace: any;


  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.http.post<any>('http://127.0.0.1:8082/auth', {
      'username': 'Investor',
      'password': 'password'
    }).subscribe(resp => {
      localStorage.setItem('token', resp.token);

      this.loadTransaction().subscribe(resp => {
        // console.log('Loaded transaction');
        this.buys = this.transactions.filter(d => d.action === 'BOUGHT');
        this.sales = this.transactions.filter(d => d.action === 'SOLD');
        console.table(this.buys);
        console.table(this.sales);


        this.loadInstrumentPrice().subscribe(res => {
          this.drawAxis();
          this.drawArea(this.xAxisScale, this.yAxisScale);
          this.drawDots(this.buys, this.xAxisScale, this.yAxisScale, 'red');
          this.drawDots(this.sales, this.xAxisScale, this.yAxisScale, 'green');
        });
      });

    });
  }

  drawDots(data, x, y, color) {
    this.innerSpace.selectAll("." + color)
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function (d) { return x(d.date); })
      .attr("cy", function (d) { return y(d.amount); })
      .style("fill", color);
    // .on("mouseover", function(d) {
    //     tooltip.transition()
    //          .duration(200)
    //          .style("opacity", .9);
    //     tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
    //     + ", " + yValue(d) + ")")
    //          .style("left", (d3.event.pageX + 5) + "px")
    //          .style("top", (d3.event.pageY - 28) + "px");
    // })
    // .on("mouseout", function(d) {
    //     tooltip.transition()
    //          .duration(500)
    //          .style("opacity", 0);
    // });
  }

  /**
   * 
   */
  drawArea(x, y) {
    var area = d3.area<any>()
      .x(function (d) { return x(d.date); })
      .y1(function (d) { return y(d.amount); });

    area.y0(y(0));

    this.innerSpace.append("path")
      .datum(this.transactions)
      .attr("fill", "steelblue")
      .attr("d", area);
  }

  /**
   * 
   */
  drawAxis() {
    var svgViewport = d3.select("#line-chart")
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .style("background", "#f1f3f3c7");

    // create scale objects

    this.xAxisScale = d3.scaleTime().rangeRound([0, this.width]);

    this.yAxisScale = d3.scaleLinear().rangeRound([this.height, 0]);

    this.xAxisScale.domain(d3.extent(this.transactions, function (d) { return d.date; }));
    this.yAxisScale.domain([0, d3.max(this.transactions, function (d) { return d.amount; })]);

    // create axis objects
    this.xAxis = d3.axisBottom(this.xAxisScale).tickFormat(d3.timeFormat("%b-%d"));
    this.yAxis = d3.axisLeft(this.yAxisScale);


    const self = this;
    // Zoom Function
    var zoom = d3.zoom()
      .on("zoom", function () {
        let change = 0;

        if (d3.event.transform.x > self.lastX) {
          change = -1;
        } else {
          change = 1;
        }

        self.lastX = d3.event.transform.x;

        const maxStart = self.transactions.length - 91;
        // const maxStart = self.instrumentPrice['oil'].length - 10;
        self.startIndex += Math.floor(change);
        self.startIndex = self.startIndex > maxStart ? maxStart : self.startIndex;
        self.startIndex = self.startIndex < 0 ? 0 : self.startIndex;

        const new_xScale = d3.scaleTime().range([0, self.width]);
        new_xScale.domain([self.transactions[self.startIndex].date, self.transactions[self.startIndex + 90].date]);
        // new_xScale.domain([self.instrumentPrice['oil'][self.startIndex].instance, self.instrumentPrice['oil'][self.startIndex + 9].instance]);

        self.gX.call(self.xAxis.scale(new_xScale));

        // update circle
        // self.circles.attr("transform", d3.event.transform)
      });

    // Inner Drawing Space
    this.innerSpace = svgViewport.append("g")
      .attr("class", "inner_space")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .call(zoom);


    // Draw Axis
    this.gX = this.innerSpace.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);


    this.gY = this.innerSpace.append("g")
      .attr("class", "axis axis--y")
      .call(this.yAxis);

    // append zoom area
    var view = this.innerSpace.append("rect")
      .attr("class", "zoom")
      .attr("width", this.width)
      .attr("height", this.height)
      .call(zoom)
  }

  /**
   * 
   */
  loadTransaction() {
    return new Observable(observer => {
      this.http.post<any[]>('http://127.0.0.1:8082/getList', { sql: 'vw_transactions' }).subscribe(data => {
        data.forEach((obj, index) => {
          obj['date'] = this.mmddyyFormat(obj['date']);
        });
        this.transactions = data;
        observer.next();
        observer.complete();
      });
    });
  }

  /**
   * 
   */
  loadInstrumentPrice() {
    return new Observable(observer => {
      this.http.post<any[]>('http://127.0.0.1:8082/getList', { sql: 'instrument_instance_info' }).subscribe(data => {
        data.forEach((obj, index) => {
          obj['instance'] = this.mmddyyFormat(obj['instance']);
        });
        // this.instrumentPrice = this.groupBy(data, price => price.code);
        // this.instrumentPrice = this.groupBy(data, price => price.code);
        observer.next();
        observer.complete();
      });
    });
  }

  /**
   * 
   * @param list 
   * @param keyGetter 
   */
  groupBy(list, keyGetter) {
    const map = {}
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map[key];
      if (!collection) {
        map[key] = [item];
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
