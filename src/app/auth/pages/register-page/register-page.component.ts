import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';
import { UserRegister } from '../../interfaces/user.interface';
import { AlertsService } from 'src/app/shared/services/alerts.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void <=> *', animate('600ms ease-in-out')),
    ]),
    trigger('circleAnimation', [
      state('void', style({
        transform: 'translate(100%, -50%) scale(0)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translate(100%, -50%) scale(1)',
        opacity: 1
      })),
      transition('void <=> *', animate('600ms ease-in-out')),
    ])
  ]
})
export class RegisterPageComponent {

  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            CustomValidators.emailValid,
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
            CustomValidators.passwordComplexity,
          ],
        ],
      }
    );
  }
  
  
  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    const formData = this.registerForm.value;
    const user: UserRegister = {
      name: formData.name,
      lastName: formData.lastname,
      email: formData.email,
      password: formData.password,
    }
    
    this.authService.register(user)
      .subscribe({
        next: () => {
          this.alertsService.alertSuccess('Usuario registrado con éxito');
          this.router.navigate(['/auth/login']);
        },
        error: (errorMessage) => {
          this.alertsService.alertError(errorMessage);
          console.error('Error en el registro:', errorMessage);
        },
      });
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.registerForm, field);
  }
  
}
