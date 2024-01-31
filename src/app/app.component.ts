import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';
import * as echarts from 'echarts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;

  public chartOptions!: Partial<ChartOptions> | any;
  public option: EChartsOption;
  public emissionsGroup: FormGroup;

  private coal: number[] = [];
  private gas: number[] = [];
  private summary: number[] = [];
  private dates: string[] = [];

  public ngOnInit(): void {
    this.initFormGroup();
    this.generateSpline();
    this.generateScratter();
  }

  public add(): void {
    const gas =
      this.emissionsGroup.controls['cubicMeters'].value * 1.129 * 1.59;
    const coal = this.emissionsGroup.controls['tons'].value * 0.768 * 2.76;
    this.coal.push(coal);
    this.gas.push(gas);
    this.summary.push(gas + coal);

    const datePipe = new DatePipe('en-US');
    const date = datePipe.transform(
      new Date(this.emissionsGroup.controls['date'].value),
      'MM/dd/yyyy'
    );

    this.dates.push(date as string);
    this.emissionsGroup.reset();
    this.generateSpline();
    this.generateScratter();
  }

  private generateSpline(): void {
    this.chartOptions = {
      series: [
        {
          name: 'газ',
          data: this.gas,
        },
        {
          name: 'Сумма',
          data: this.summary,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: this.dates,
      },
      tooltip: {
        x: {
          format: 'MM/dd/yyyy',
        },
      },
      title: {
        text: 'Выбросы газа',
        align: 'left',
      },
    };
  }

  private generateScratter(): void {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    var option: EChartsOption;

    option = {
      title: {
        text: 'Выбросы угля',
      },
      legend: {
        bottom: 5,
      },
      xAxis: {
        type: 'category',
        data: this.dates,
        name: 'время',
      },
      yAxis: {
        name: 'тонны',
      },
      series: [
        {
          name: 'Уголь',
          symbolSize: 20,
          data: this.coal,
          type: 'scatter',
        },
        {
          name: 'Сумма',
          symbolSize: 20,
          data: this.summary,
          type: 'scatter',
        },
      ],
    };

    option && myChart.setOption(option);
  }

  private initFormGroup(): void {
    this.emissionsGroup = new FormGroup({
      tons: new FormControl(null, [Validators.required, Validators.max(1000)]),
      cubicMeters: new FormControl(null, [
        Validators.required,
        Validators.max(1000),
      ]),
      date: new FormControl('', [Validators.required]),
    });
  }
}
