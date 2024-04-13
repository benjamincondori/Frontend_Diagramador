import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({ 
        transform: 'translateX(-100%)', 
        opacity: 0 
      })),
      state('*', style({ 
        transform: 'translateX(0)', 
        opacity: 1 
      })),
      transition('void <=> *', animate('600ms ease-in-out')),
    ]),
    trigger('circleAnimation', [
      state(
        'void',
        style({
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
        })
      ),
      state(
        '*',
        style({
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1,
        })
      ),
      transition('void <=> *', animate('600ms ease-in-out')),
    ]),
  ],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
  ) {}
  
  ngOnInit(): void {
    
    this.loginForm = this.fb.group({
      email: [
        'benjamin@gmail.com',
        [
          Validators.required,
          CustomValidators.emailValid,
        ],
      ],
      password: [
        'Benjamin123',
        [
          Validators.required,
          // Validators.minLength(6),
          // Validators.maxLength(50),
          // CustomValidators.passwordComplexity,
        ],
      ],
    });
  }
  
  

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    const email = this.loginForm.value.email.trim();
    const password = this.loginForm.value.password.trim();
    
    this.authService.login(email, password)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.alertsService.alertSuccess('Usuario autenticado con éxito');
          const url = localStorage.getItem('url');
          this.router.navigateByUrl(url || '/home');
        },
        error: (errorMessage) => {
          this.alertsService.alertError(errorMessage);
        },
      });
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.loginForm, field);
  }
}
