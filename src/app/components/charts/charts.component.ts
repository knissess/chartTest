import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartComponent } from 'ng-apexcharts';
import * as echarts from 'echarts';
import { HelperService } from 'src/app/services/helper.service';
import { ChartOptions, EChartsOption } from 'src/app/types/chartOptions';
import { COAL } from 'src/app/consts/coal.const';
import { GAS } from 'src/app/consts/gas.const';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: Partial<ChartOptions> | any;
  public emissionsGroup: FormGroup;

  private coal: number[] = [];
  private gas: number[] = [];
  private summary: number[] = [];
  private dates: string[] = [];

  constructor(private helper: HelperService) {}

  public ngOnInit(): void {
    this.initFormGroup();
    this.generateScratter();
    this.initCharts();
  }

  public add(): void {
    const gas = this.emissionsGroup.controls['cubicMeters'].value * GAS;
    const coal = this.emissionsGroup.controls['tons'].value * COAL;

    this.coal.push(coal);
    this.gas.push(gas);
    this.summary.push(gas + coal);

    const date = this.helper.transformDate(
      this.emissionsGroup.controls['date'].value
    );
    this.dates.push(date);
    console.log('date', date);

    this.emissionsGroup.reset();
    this.initCharts();
  }

  private initFormGroup(): void {
    this.emissionsGroup = new FormGroup({
      tons: new FormControl(null, [
        Validators.required,
        Validators.max(1000),
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      cubicMeters: new FormControl(null, [
        Validators.required,
        Validators.max(1000),
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      date: new FormControl('', [Validators.required]),
    });
  }

  private initCharts(): void {
    this.chartOptions = this.helper.generateSpline(
      this.gas,
      this.summary,
      this.dates
    );
    this.generateScratter();
  }

  private generateScratter(): void {
    const chartDom = document.getElementById('main');
    if (!!chartDom) {
      const myChart = echarts.init(chartDom);
      const option: EChartsOption = this.helper.generateScratter(
        this.coal,
        this.summary,
        this.dates
      );

      myChart.setOption(option);
    }
  }
}
