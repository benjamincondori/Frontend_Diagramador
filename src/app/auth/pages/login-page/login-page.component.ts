import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component } from '@angular/core';

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
export class LoginPageComponent {
  constructor() {}

  ngOnInit() {
  }
}
