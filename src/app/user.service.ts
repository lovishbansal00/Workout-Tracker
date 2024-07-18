import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Workout {
  type: string;
  minutes: number;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

export interface UserWorkout {
  name: string;
  workouts: Workout[];
  totalWorkouts: number;
  totalMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private userWorkoutsSubject = new BehaviorSubject<UserWorkout[]>([]);

  userWorkouts$: Observable<UserWorkout[]> = this.userWorkoutsSubject.asObservable();

  constructor() {
    this.loadUsers();
    this.updateUserWorkouts();
  }

  addUserWorkout(name: string, type: string, minutes: number): boolean {
    let user = this.users.find(user => user.name === name);
    if (!user) {
      user = { id: this.users.length + 1, name, workouts: [] };
      this.users.push(user);
    }
    if (user.workouts.some(workout => workout.type === type)) {
      return false;
    }
    user.workouts.push({ type, minutes });
    this.saveUsers();
    this.updateUserWorkouts();
    return true;
  }

  private updateUserWorkouts() {
    const userWorkouts = this.users.map(user => ({
      name: user.name,
      workouts: user.workouts,
      totalWorkouts: user.workouts.length,
      totalMinutes: user.workouts.reduce((sum, workout) => sum + workout.minutes, 0)
    }));
    this.userWorkoutsSubject.next(userWorkouts);
  }

  getWorkoutTypes() {
    const workoutTypes = new Set<string>();
    this.users.forEach(user => {
      user.workouts.forEach(workout => {
        workoutTypes.add(workout.type);
      });
    });
    return Array.from(workoutTypes);
  }

  private saveUsers() {
    try {
      localStorage.setItem('users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  private loadUsers() {
    try {
      const usersData = localStorage.getItem('users');
      if (usersData) {
        this.users = JSON.parse(usersData);
        this.updateUserWorkouts();
      }
    } catch (error) {
      console.error('Error loading from localStorage', error);
    }
  }
}
