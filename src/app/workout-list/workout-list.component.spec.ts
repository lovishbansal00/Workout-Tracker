import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { UserService } from '../user.service';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  const mockUserWorkouts = [
    {
      name: 'Lovish',
      workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }],
      totalWorkouts: 2,
      totalMinutes: 75
    },
    {
      name: 'Ayush',
      workouts: [{ type: 'Swimming', minutes: 60 }],
      totalWorkouts: 1,
      totalMinutes: 60
    }
  ];

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getWorkoutTypes']);
    userServiceMock.userWorkouts$ = new BehaviorSubject([]);
    userServiceMock.getWorkoutTypes.and.returnValue(['Running', 'Cycling', 'Swimming']);

    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent, NoopAnimationsModule, MatPaginatorModule],
      providers: [{ provide: UserService, useValue: userServiceMock }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should load data on init', fakeAsync(() => {
  //   userServiceMock.userWorkouts$ = new BehaviorSubject(mockUserWorkouts);
  //   fixture = TestBed.createComponent(WorkoutListComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges(); // Trigger ngOnInit
  //   tick(); // Simulate passage of time for async operations
  //   fixture.detectChanges(); // Trigger change detection again
  //   expect(component.dataSource.data).toEqual(mockUserWorkouts);
  // }));


  it('should set workout types on init', () => {
    fixture.detectChanges();
    expect(component.workoutTypes).toEqual(['Running', 'Cycling', 'Swimming']);
  });

  it('should setup filter on init', () => {
    fixture.detectChanges();
    expect(component.dataSource.filterPredicate).toBeDefined();
  });

  it('should apply filters when search changes', () => {
    fixture.detectChanges();
    spyOn(component, 'applyFilters');
    component.onSearchChange();
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should apply filters when filter changes', () => {
    fixture.detectChanges();
    spyOn(component, 'applyFilters');
    component.onFilterChange();
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should toggle chart visibility', () => {
    const userWorkout = { name: 'Test', workouts: [], totalWorkouts: 0, totalMinutes: 0, showChart: false };
    component.toggleChart(userWorkout);
    expect(userWorkout.showChart).toBe(true);
    component.toggleChart(userWorkout);
    expect(userWorkout.showChart).toBe(false);
  });

  it('should return correct workout types string', () => {
    const workouts = [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }];
    expect(component.getWorkoutTypesString(workouts)).toBe('Running, Cycling');
  });

  // it('should filter data correctly', fakeAsync(() => {
  //   fixture.detectChanges();
  //   component.searchName = 'Lovish';
  //   component.filterWorkoutType = 'Running';
  //   component.applyFilters();
  //   tick();
  //   fixture.detectChanges();
  //   expect(component.dataSource.filteredData.length).toBe(1);
  //   expect(component.dataSource.filteredData[0].name).toBe('Lovish');
  // }));

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    const subscription = component['userWorkoutsSubscription'];
    spyOn(subscription!, 'unsubscribe');
    component.ngOnDestroy();
    expect(subscription!.unsubscribe).toHaveBeenCalled();
  });

  it('should set paginator after view init', () => {
    fixture.detectChanges();
    expect(component.dataSource.paginator).toBeDefined();
  });

  it('should create correct filter function', () => {
    const filterFunction = component.createFilter();
    const data = mockUserWorkouts[0];
    const filter = JSON.stringify({ name: 'lovish', workoutType: 'Running' });
    expect(filterFunction(data, filter)).toBe(true);
  });

  it('should initialize searchName and filterWorkoutType as empty strings', () => {
    expect(component.searchName).toBe('');
    expect(component.filterWorkoutType).toBe('');
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['name', 'workouts', 'totalWorkouts', 'totalMinutes', 'expand']);
  });

  it('should apply filters when applyFilters is called', () => {
    component.searchName = 'test';
    component.filterWorkoutType = 'Running';
    component.applyFilters();
    const expectedFilter = JSON.stringify({
      name: 'test',
      workoutType: 'Running'
    });
    expect(component.dataSource.filter).toBe(expectedFilter);
  });
});
