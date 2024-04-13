import { Component, computed, effect } from '@angular/core';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  });
  
  public authStatusChangedEffect = effect(() => {
    switch(this.authService.authStatus()) {
      case AuthStatus.checking: 
        return;
      case AuthStatus.authenticated:
        this.router.navigate(['/home']);
        break;
      case AuthStatus.unauthenticated:
        this.router.navigate(['/auth/login']);
        break;
    }
    
  });
  
}
