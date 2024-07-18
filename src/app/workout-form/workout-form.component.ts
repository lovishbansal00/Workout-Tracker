import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormsModule, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.scss']
})
export class WorkoutFormComponent {
  showWarning: boolean = false;
  isButtonDisabled: boolean = false;
  warningMessage = '';
  showSuccess: boolean = false;
  successMessage: string = '';

  workoutForm = new FormGroup({
    username: new FormControl('', Validators.required),
    workoutType: new FormControl('', Validators.required),
    minutes: new FormControl('', [Validators.required, Validators.min(10)])
  });

  constructor(private userService: UserService) { }

  addUser(event: Event) {
    event.preventDefault();

    if (this.workoutForm.valid) {
      const { username, workoutType, minutes } = this.workoutForm.value;
      const added = this.userService.addUserWorkout(username!, workoutType!, parseInt(minutes!));

      if (added) {
        // Workout was successfully added
        this.workoutForm.reset();
        this.showWarning = false;
        this.isButtonDisabled = false;
        this.warningMessage = '';
        this.workoutForm.markAsPristine();
        this.workoutForm.markAsUntouched();
        this.showSuccess = true;
        this.successMessage = 'Workout added successfully!';
        setTimeout(() => {
          this.showSuccess = false;
        }, 1000);
      } else {
        this.showWarning = true;
        this.isButtonDisabled = true;
        this.warningMessage = 'This workout type already exists for this user. Please choose a different workout type.';
        setTimeout(() => {
          this.showWarning = false;
          this.isButtonDisabled = false;
        }, 2000);
      }
    } else {
      // Form is invalid
      if (this.workoutForm.get('username')!.hasError('required') || this.workoutForm.get('minutes')!.hasError('required') || this.workoutForm.get('workoutType')!.hasError('required')) {
        // Only show the general warning if the form is untouched
        this.showWarning = true;
        this.isButtonDisabled = true;
        this.warningMessage = 'Please enter all the required fields';
        setTimeout(() => {
          this.showWarning = false;
          this.isButtonDisabled = false;
        }, 3000);
      }
      // If the form has been touched, mark all fields as touched to show individual errors
      this.workoutForm.markAllAsTouched();

    }
  }
}