import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { SimpleChange } from '@angular/core';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty workoutData', () => {
    expect(component.workoutData).toEqual([]);
  });

  it('should update chart data when workoutData changes', () => {
    const testData = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ];
    component.workoutData = testData;
    component.ngOnChanges({
      workoutData: new SimpleChange(null, testData, true)
    });

    expect(component.chartData).toBeDefined();
    expect(component.chartData.labels).toEqual(['Running', 'Cycling']);
    expect(component.chartData.datasets[0].data).toEqual([30, 45]);
  });

  it('should set correct chart options', () => {
    component.ngOnChanges({
      workoutData: new SimpleChange(null, [], true)
    });

    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions.responsive).toBe(true);
    expect(component.chartOptions.maintainAspectRatio).toBe(false);
    expect(component.chartOptions.scales.y.beginAtZero).toBe(true);
    expect(component.chartOptions.scales.y.max).toBe(90);
    expect(component.chartOptions.plugins.legend.display).toBe(false);
  });

  it('should not update chart data if workoutData has not changed', () => {
    const spy = spyOn<any>(component, 'updateChartData');
    component.ngOnChanges({
      someOtherProperty: new SimpleChange(null, 'value', true)
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle empty workoutData correctly', () => {
    component.workoutData = [];
    component.ngOnChanges({
      workoutData: new SimpleChange(null, [], true)
    });

    expect(component.chartData.labels).toEqual([]);
    expect(component.chartData.datasets[0].data).toEqual([]);
  });

  it('should use correct background color for chart', () => {
    component.ngOnChanges({
      workoutData: new SimpleChange(null, [], true)
    });

    expect(component.chartData.datasets[0].backgroundColor).toBe('#42A5F5');
  });

  it('should set correct y-axis title', () => {
    component.ngOnChanges({
      workoutData: new SimpleChange(null, [], true)
    });

    expect(component.chartOptions.scales.y.title.display).toBe(true);
    expect(component.chartOptions.scales.y.title.text).toBe('Minutes');
  });

  it('should set correct x-axis title', () => {
    component.ngOnChanges({
      workoutData: new SimpleChange(null, [], true)
    });

    expect(component.chartOptions.scales.x.title.display).toBe(true);
    expect(component.chartOptions.scales.x.title.text).toBe('Workout Type');
  });
});