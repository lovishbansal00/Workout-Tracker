import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [ChartModule, NgIf],
  template:
    `
    <div *ngIf="chartData" class="p-4">
      <p-chart type="bar" [data]="chartData" [options]="chartOptions"></p-chart>
    </div>
  `
})

export class WorkoutChartComponent implements OnChanges {
  @Input() workoutData: { type: string, minutes: number }[] = [];

  chartData: any;
  chartOptions: any;

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
        label: 'Minutes per Workout Type',
        data: data,
        backgroundColor: '#42A5F5'
      }]
    };

    this.chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 90,
          ticks: {
            stepSize: 10
          },
          title: {
            display: true,
            text: 'Minutes'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Workout Type'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  }
}