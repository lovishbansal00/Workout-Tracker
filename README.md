# WorkoutTracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Assumptions

1) User Name, Workout Type, Minutes are neccessary fields.
2) Number of minutes for a workout can only be in range of 10-90.
3) Workout Type is a drop down with ony 3 values :- Running, Cycling, Swimming.
4) You can't add another same workout type for a user.
5) The uniqueness is being checked on the basis of user name.
6) You can click the downward arrow at the end of any entry to see the bar graph of the workouts.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Code coverage
![image](https://github.com/user-attachments/assets/ef897da6-7208-4772-ae75-f6aae38ee0be)
![image](https://github.com/user-attachments/assets/6403ad62-6a18-4937-b76d-e10a0c3c0010)
![image](https://github.com/user-attachments/assets/8c820b33-978e-47f9-be5b-99c956d68d42)


## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
