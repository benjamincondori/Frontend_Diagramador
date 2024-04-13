import { computed, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { UserCurrent, UserRegister } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { CheckTokenResponse } from '../interfaces/check-token-response.interface';
import { Profile, RegisterResponse } from '../interfaces/register-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  
  private _currentUser = signal<UserCurrent | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());
  
  constructor(
    private http: HttpClient
  ) {
    this.checkAuthStatus().subscribe();
  }
  
  private setAuthentication(token: string): boolean {
    let isAuthenticated = false;
    localStorage.setItem('token', token);
    this.getUser().subscribe({
      next: (user) => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        isAuthenticated = true;
      },
      error: () => {
        this._authStatus.set(AuthStatus.unauthenticated);
        isAuthenticated = false;
      }
    });
    
    return isAuthenticated;
  }
  
  // Inicio de sesión
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ token }) => this.setAuthentication(token)),
      catchError((err) => {
        let errorMessage = err.error.message;
        if (err.status === 0) {
          errorMessage = 'No se pudo establecer conexión con el servidor. Por favor, inténtelo de nuevo.';
        } else if (errorMessage.includes('email')) {
          errorMessage = 'El email no está registrado. Por favor, regístrese.';
        } else if (errorMessage.includes('password')) {
          errorMessage = 'Contraseña incorrecta. Por favor, inténtelo de nuevo.';
        } else {
          errorMessage = 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde.';
        }
        return throwError(() => errorMessage);
      })
    );
  }
  
  
  // Registra un nuevo usuario
  register(user: UserRegister): Observable<RegisterResponse> {
    const url = `${this.baseUrl}/auth/register`;

    return this.http.post<RegisterResponse>(url, user)
    .pipe(
      catchError((err) => {
        let errorMessage = err.error.message;
        if (err.status === 0) {
          errorMessage = 'No se pudo establecer conexión con el servidor. Por favor, inténtelo de nuevo.';
        } else if (errorMessage.includes('already exists')) {
          errorMessage = 'El email ya está registrado. Por favor, ingrese otro email.';
        } else {
          errorMessage = 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde.';
        }
        return throwError(() => errorMessage);
      })
    );
  }
  
  // Obtener el usuario actual
  getUser(): Observable<UserCurrent> {
    const url = `${this.baseUrl}/auth/user`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
    return this.http.get<UserCurrent>(url, { headers }).pipe(
      tap((user) => this._currentUser.set(user)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  
  // Verifica el estado de autenticación del usuario
  checkAuthStatus(): Observable<any> {
    const url = `${this.baseUrl}/auth/check-status`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map((resp) => this.setAuthentication(token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.unauthenticated);
        return of(false);
      })
    );
  }
  
  logout() {
    localStorage.clear()
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.unauthenticated);
  }
  
  
}
