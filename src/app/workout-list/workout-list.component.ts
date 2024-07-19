import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserService, Workout } from '../user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { WorkoutChartComponent } from '../workout-chart/workout-chart.component';
import { Subscription } from 'rxjs';

interface UserWorkout {
  name: string;
  workouts: Workout[];
  totalWorkouts: number;
  totalMinutes: number;
  showChart?: boolean;
}

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    NgFor,
    NgIf,
    WorkoutChartComponent, 
    NgClass
  ],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss']
})
export class WorkoutListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'workouts', 'totalWorkouts', 'totalMinutes', 'expand'];
  dataSource = new MatTableDataSource<UserWorkout>([]);
  workoutTypes: string[] = [];
  searchName: string = '';
  filterWorkoutType: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private userWorkoutsSubscription: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadData();
    this.workoutTypes = this.userService.getWorkoutTypes();
    this.setupFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.userWorkoutsSubscription) {
      this.userWorkoutsSubscription.unsubscribe();
    }
  }

  loadData() {
    this.userWorkoutsSubscription = this.userService.userWorkouts$.subscribe(
      userWorkouts => {
        this.dataSource.data = userWorkouts;
        this.applyFilters();
      }
    );
  }

  setupFilter() {
    this.dataSource.filterPredicate = (data: UserWorkout, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const nameMatch = data.name.toLowerCase().indexOf(searchTerms.name) !== -1;
      const workoutTypeMatch = searchTerms.workoutType === '' || 
        data.workouts.some(w => w.type === searchTerms.workoutType);
      return nameMatch && workoutTypeMatch;
    };
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    const filterValue = JSON.stringify({
      name: this.searchName.toLowerCase(),
      workoutType: this.filterWorkoutType
    });
    this.dataSource.filter = filterValue;
  }

  toggleChart(userWorkout: UserWorkout) {
    userWorkout.showChart = !userWorkout.showChart;
  }

  getWorkoutTypesString(workouts: { type: string, minutes: number }[]): string {
    return workouts.map(w => w.type).join(', ');
  }


  createFilter(): (data: UserWorkout, filter: string) => boolean {
    let filterFunction = function(data: UserWorkout, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.name.toLowerCase().indexOf(searchTerms.name) !== -1
        && (searchTerms.workoutType === '' || data.workouts.some(w => w.type === searchTerms.workoutType));
    }
    return filterFunction;
  }

  
}