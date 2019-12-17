import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor() { }

  public electricityChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public electricityChartLabels = ['Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август'];
  public electricityChartType = 'bar';
  public electricityChartLegend = true;

  public electricityChartData = [
    {data: [65, 59, 80, 60, 40, 37], label: 'Потреблено, кВт⋅ч'}
  ];

  public chargesAndPaymentChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public chargesAndPaymentChartLabels = ['Март', 'Апрель', 'Май', 'Июнь', 'Июль'];
  public chargesAndPaymentChartType = 'line';
  public chargesAndPaymentChartLegend = true;

  public chargesAndPaymentChartData = [
    {data: [80, 50, 86, 55, 40], label: 'Начислено, тыс. руб'},
    {data: [60, 45, 56, 40, 35], label: 'Оплачено, тыс. руб'}
  ];

  ngOnInit() {
  }

}
