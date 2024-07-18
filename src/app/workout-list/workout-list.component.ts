import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { WorkoutChartComponent } from '../workout-chart/workout-chart.component';
import { Workout } from '../user.service';

interface UserWorkout {
  name: string;
  workouts: string;
  totalWorkouts: number;
  totalMinutes: number;
}

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    WorkoutChartComponent
  ],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss']
})

export class WorkoutListComponent implements OnInit, AfterViewInit, OnDestroy {
  userWorkouts: UserWorkout[] = [];
  dataSource = new MatTableDataSource<UserWorkout>([]);
  displayedColumns: string[] = ['name', 'workouts', 'totalWorkouts', 'totalMinutes'];
  searchName: string = '';
  filterWorkoutType: string = '';
  workoutTypes: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private userSubscription: Subscription;

  constructor(private userService: UserService) {
    this.userSubscription = new Subscription();
  }

  ngOnInit() {
    this.loadUserWorkouts();
    this.workoutTypes = this.userService.getWorkoutTypes();

    this.userSubscription = this.userService.usersUpdated$.subscribe(() => {
      this.loadUserWorkouts();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUserWorkouts() {
    const rawData = this.userService.getUserWorkouts();
    //this.userWorkouts = rawData;
    this.userWorkouts = rawData.map((user) => ({
      name: user.name,
      workouts: this.getWorkoutTypesString(user.workouts),
      totalWorkouts: user.workouts.length,
      totalMinutes: this.calculateTotalMinutes(user.workouts)
    }));
    this.dataSource.data = this.userWorkouts;
  }

  private getWorkoutTypesString(workouts: Workout[]): string {
    if (!workouts || workouts.length === 0) {
      return 'No workouts';
    }
    return workouts.map(w => w.type).join(', ');
  }

  private calculateTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((sum, workout) => sum + workout.minutes, 0);
  }

  applyFilters() {
    this.dataSource.data = this.userWorkouts.filter(userWorkout =>
      userWorkout.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterWorkoutType === '' || userWorkout.workouts.includes(this.filterWorkoutType))
    );
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }
}