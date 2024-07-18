import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [
    ChartModule, BaseChartDirective, NgIf
  ],
  template: `
    <div *ngIf="chartData" class="chart-container" style="height: 300px;">
      <canvas baseChart
        [data]="chartData"
        [options]="barChartOptions"
        [type]="barChartType">
      </canvas>
    </div>
  `
})
export class WorkoutChartComponent implements OnChanges {
  @Input() workoutData: { type: string, minutes: number }[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData?: ChartData<'bar'>;
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0, max: 90, ticks: {
          stepSize: 10,
        }
      }
    },
    plugins: {
      legend: { display: true }
    }
  };
  barChartType: ChartType = 'bar';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workoutData']) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    const labels = this.workoutData.map(w => w.type);
    const data = this.workoutData.map(w => w.minutes);
    this.chartData = {
      labels: labels,
      datasets: [{
        data: data,
        label: 'Minutes per Workout Type'
      }]
    };
    
    setTimeout(() => {
      this.chart?.update();
    });
  }
}
