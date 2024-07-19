import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserService, User, UserWorkout } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addUserWorkout', () => {
    it('should add a new user with workout', fakeAsync(() => {
      let result: boolean | undefined;
      service.addUserWorkout('Mudita', 'Running', 30).then(res => {
        result = res;
        console.log('Add user workout result:', res);
      });
      tick();
      expect(result).toBe(true);


      service.userWorkouts$.subscribe(userWorkouts => {
        console.log('User workouts:', userWorkouts);
        const newUser = userWorkouts.find(u => u.name === 'Mudita');
        expect(newUser).toBeTruthy();
        if (newUser) {
          expect(newUser.workouts.length).toBe(1);
          expect(newUser.workouts[0].type).toBe('Running');
          expect(newUser.workouts[0].minutes).toBe(30);
        }
      });
      tick();
    }));

    it('should handle adding workout with 0 minutes', fakeAsync(() => {
      service.addUserWorkout('Amit', 'Meditation', 0).then(result => {
        expect(result).toBe(true);
      });
      tick();
      service.userWorkouts$.subscribe(userWorkouts => {
        const user = userWorkouts.find(u => u.name === 'Amit');
        expect(user).toBeTruthy();
        expect(user?.workouts[0].minutes).toBe(0);
      });
    }));

    it('should add workout to existing user', fakeAsync(() => {
      service.addUserWorkout('Chanu', 'Running', 30);
      tick();
      service.addUserWorkout('Chanu', 'Cycling', 45).then(result => {
        expect(result).toBe(true);
      });
      tick();
      service.userWorkouts$.subscribe(userWorkouts => {
        expect(userWorkouts.length).toBe(6);
        expect(userWorkouts[6].workouts.length).toBe(2);
      });
    }));

    it('should not add duplicate workout type for a user', fakeAsync(() => {
      service.addUserWorkout('Lovish', 'Running', 30);
      tick();
      service.addUserWorkout('Lovish', 'Running', 45).then(result => {
        expect(result).toBe(false);
      });
      tick();
      service.userWorkouts$.subscribe(userWorkouts => {
        expect(userWorkouts[0].workouts.length).toBe(2);
      });
    }));
  });

  describe('getWorkoutTypes', () => {
    it('should return unique workout types', fakeAsync(() => {
      service.addUserWorkout('Lovish', 'Running', 30);
      service.addUserWorkout('Ayush', 'Cycling', 45);
      service.addUserWorkout('Lovish', 'Swimming', 60);
      tick();

      const types = service.getWorkoutTypes();
      expect(types.length).toBe(3);
      expect(types).toContain('Running');
      expect(types).toContain('Cycling');
      expect(types).toContain('Swimming');
    }));

    it('should return an empty array when no workouts exist', () => {
      const types = service.getWorkoutTypes();
      expect(types.length).toBe(0);
    });

    it('should handle case-sensitive workout types', fakeAsync(() => {
      service.addUserWorkout('User1', 'Running', 30);
      service.addUserWorkout('User2', 'running', 30);
      tick();

      const types = service.getWorkoutTypes();
      expect(types.length).toBe(2);
      expect(types).toContain('Running');
      expect(types).toContain('running');
    }));

  });

  describe('localStorage interactions', () => {
    it('should save users to localStorage', fakeAsync(() => {
      service.addUserWorkout('Lovish', 'Running', 30);
      tick();
      const storedData = localStorage.getItem('users');
      expect(storedData).toBeTruthy();
      const parsedData = JSON.parse(storedData!);
      expect(parsedData.length).toBe(4);
      expect(parsedData[0].name).toBe('John Doe');
    }));

    it('should load users from localStorage', fakeAsync(() => {
      const mockUsers: User[] = [
        { id: 1, name: 'Lovish', workouts: [{ type: 'Running', minutes: 30 }] }
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));

      const newService = TestBed.inject(UserService);
      tick();

      newService.userWorkouts$.subscribe(userWorkouts => {
        console.log(userWorkouts);
        expect(userWorkouts.length).toBe(5);
        expect(userWorkouts[3].name).toBe('Lovish');
      });
    }));

    it('should handle localStorage errors gracefully', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.throwError('localStorage error');
      spyOn(console, 'error');

      // Create a new instance of the service to trigger loadUsers()
      TestBed.resetTestingModule();
      const newService = TestBed.inject(UserService);
      tick(); // Allow any async operations to complete

      expect(console.error).toHaveBeenCalledWith('Error loading from localStorage', jasmine.any(Error));
    }));
  });

  describe('updateUserWorkouts', () => {
    it('should calculate total workouts and minutes correctly', fakeAsync(() => {
      service.addUserWorkout('Lovish', 'Running', 30);
      tick();
      service.addUserWorkout('Lovish', 'Cycling', 45);
      tick();
      service.updateUserWorkouts();
      service.userWorkouts$.subscribe(userWorkouts => {
        expect(userWorkouts[0].totalWorkouts).toBe(2);
        expect(userWorkouts[0].totalMinutes).toBe(75);
      });
    }));
  });
});


