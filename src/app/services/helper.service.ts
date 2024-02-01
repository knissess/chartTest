import { Injectable } from '@angular/core';
import { ChartOptions, EChartsOption } from '../types/chartOptions';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  public transformDate(date: string): string {
    return new Date(date).toDateString().split(',')[0];
  }

  public generateSpline(
    gasValue: number[],
    summary: number[],
    dates: string[]
  ): Partial<ChartOptions> {
    return {
      series: [
        {
          name: 'газ',
          data: gasValue,
        },
        {
          name: 'Сумма',
          data: summary,
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
        categories: dates,
        labels: {
          format: 'dd/MM/yyyy',
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yyyy',
        },
      },
      title: {
        text: 'Выбросы газа',
        align: 'left',
      },
    };
  }

  public generateScratter(
    coalValue: number[],
    summary: number[],
    dates: string[]
  ): EChartsOption {
    return {
      title: {
        text: 'Выбросы угля',
      },
      legend: {
        bottom: 5,
      },
      xAxis: {
        type: 'category',
        data: dates,
        name: 'время',
      },
      yAxis: {
        name: 'тонны',
      },
      series: [
        {
          name: 'Уголь',
          symbolSize: 20,
          data: coalValue,
          type: 'scatter',
        },
        {
          name: 'Сумма',
          symbolSize: 20,
          data: summary,
          type: 'scatter',
        },
      ],
    };
  }
}
