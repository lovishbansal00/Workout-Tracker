import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WorkoutFormComponent } from './workout-form.component';
import { UserService } from '../user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;


  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['addUserWorkout']);

    await TestBed.configureTestingModule({
      imports: [
        WorkoutFormComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    })
      .compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.workoutForm.get('username')?.value).toBe('');
    expect(component.workoutForm.get('workoutType')?.value).toBe('');
    expect(component.workoutForm.get('minutes')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.workoutForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled correctly', () => {
    component.workoutForm.setValue({
      username: 'Lovish',
      workoutType: 'Running',
      minutes: '30'
    });
    expect(component.workoutForm.valid).toBeTruthy();
  });

  it('should show error when username is empty', () => {
    const usernameControl = component.workoutForm.get('username');
    usernameControl?.setValue('');
    usernameControl?.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement.textContent).toContain('Username is required');
  });

  it('should show error when workout type is not selected', () => {
    const workoutTypeControl = component.workoutForm.get('workoutType');
    workoutTypeControl?.setValue('');
    workoutTypeControl?.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement.textContent).toContain('Workout type is required');
  });

  it('should mark username as invalid when empty', () => {
    const usernameControl = component.workoutForm.get('username');
    usernameControl?.setValue('');
    expect(usernameControl?.valid).toBeFalsy();
    expect(usernameControl?.hasError('required')).toBeTruthy();
  });
  
  it('should mark workoutType as invalid when empty', () => {
    const workoutTypeControl = component.workoutForm.get('workoutType');
    workoutTypeControl?.setValue('');
    expect(workoutTypeControl?.valid).toBeFalsy();
    expect(workoutTypeControl?.hasError('required')).toBeTruthy();
  });
  
  it('should mark minutes as invalid when less than 10', () => {
    const minutesControl = component.workoutForm.get('minutes');
    minutesControl?.setValue('5');
    expect(minutesControl?.valid).toBeFalsy();
    expect(minutesControl?.hasError('min')).toBeTruthy();
  });

  it('should show error when minutes is less than 10', () => {
    const minutesControl = component.workoutForm.get('minutes');
    minutesControl?.setValue('5');
    minutesControl?.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement.textContent).toContain('Minutes should be at least 10');
  });

  it('should show error when minutes is more than 90', () => {
    const minutesControl = component.workoutForm.get('minutes');
    minutesControl?.setValue('100');
    minutesControl?.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement.textContent).toContain('Minutes should not be more than 90');
  });

  it('should call addUserWorkout when form is valid', async () => {
    userServiceSpy.addUserWorkout.and.returnValue(Promise.resolve(true));
    component.workoutForm.setValue({
      username: 'Lovish',
      workoutType: 'Running',
      minutes: '30'
    });
    await component.addUser({ preventDefault: () => { } } as Event);
    expect(userServiceSpy.addUserWorkout).toHaveBeenCalledWith('Lovish', 'Running', 30);
    expect(component.showSuccess).toBeTrue();
    expect(component.successMessage).toBe('Workout added successfully!');
  });

  it('should show success message when workout is added successfully', fakeAsync(async () => {
    userServiceSpy.addUserWorkout.and.returnValue(Promise.resolve(true));
    component.workoutForm.setValue({ username: 'Lovish', workoutType: 'Running', minutes: '30' });
    await component.addUser(new Event('submit'));
    tick();
    expect(component.showSuccess).toBeTruthy();
    expect(component.successMessage).toBe('Workout added successfully!');
    tick(1000);
    expect(component.showSuccess).toBeFalsy();
  }));

  it('should show warning when workout type already exists for user', fakeAsync(async () => {
    userServiceSpy.addUserWorkout.and.returnValue(Promise.resolve(false));
    component.workoutForm.setValue({ username: 'Lovish', workoutType: 'Running', minutes: '30' });
    await component.addUser(new Event('submit'));
    tick();
    expect(component.showWarning).toBeTruthy();
    expect(component.warningMessage).toBe('This workout type already exists for this user. Please choose a different workout type.');
    tick(2000);
    expect(component.showWarning).toBeFalsy();
  }));

  it('should show warning when form is invalid', fakeAsync(async () => {
    await component.addUser(new Event('submit'));
    tick();
    expect(component.showWarning).toBeTruthy();
    expect(component.warningMessage).toBe('Please enter all the required fields');
    tick(3000);
    expect(component.showWarning).toBeFalsy();
  }));

  it('should mark all fields as touched when form is invalid', async () => {
    await component.addUser(new Event('submit'));
    expect(component.workoutForm.get('username')?.touched).toBeTruthy();
    expect(component.workoutForm.get('workoutType')?.touched).toBeTruthy();
    expect(component.workoutForm.get('minutes')?.touched).toBeTruthy();
  });

  it('should reset form after successful submission', fakeAsync(() => {
    userServiceSpy.addUserWorkout.and.returnValue(Promise.resolve(true));
    component.workoutForm.setValue({ username: 'Lovish', workoutType: 'Running', minutes: '30' });
    component.addUser(new Event('submit'));
    tick();
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.workoutForm.get('username')?.value).toBe('');
    expect(component.workoutForm.get('workoutType')?.value).toBe('');
    expect(component.workoutForm.get('minutes')?.value).toBe('');
    expect(component.workoutForm.pristine).toBeTruthy();
    expect(component.workoutForm.untouched).toBeTruthy();
  }));

  it('should hide warning message after 3 seconds', fakeAsync(() => {
    component.addUser(new Event('submit'));
    tick();
    expect(component.showWarning).toBeTruthy();
    tick(3000);
    expect(component.showWarning).toBeFalsy();
  }));
  
  it('should hide success message after 1 second', fakeAsync(() => {
    userServiceSpy.addUserWorkout.and.returnValue(Promise.resolve(true));
    component.workoutForm.setValue({ username: 'Lovish', workoutType: 'Running', minutes: '30' });
    component.addUser(new Event('submit'));
    tick();
    expect(component.showSuccess).toBeTruthy();
    tick(1000);
    expect(component.showSuccess).toBeFalsy();
  }));

});


