import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, OnInit, signal } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { Profile } from 'src/app/auth/interfaces/register-response.interface';
import { environment } from 'src/environments/environment';
import { Diagram, DiagramUpdateParams } from '../interfaces/diagram.interface';
import { DiagramResponse } from '../interfaces/diagrams-response.interface';
import { AddCollaboratorResponse } from '../interfaces/add-collaborator.interface';

@Injectable({
  providedIn: 'root'
})
export class HomeService implements OnInit {
  
  private readonly baseUrl: string = environment.baseUrl;
  
  private _projectsSubject = new Subject<DiagramResponse[]>();
  public projects = this._projectsSubject.asObservable();
  
  private myCollaborations?: DiagramResponse[];

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    
  }
  
  get collaborations(): DiagramResponse[] {
    return this.myCollaborations || [];
  }
  
  setProjects(projects: DiagramResponse[]) {
    this._projectsSubject.next(projects);
  }
  
  // Actualizar el perfil del usuario
  uploadProfile(id: number, file: File, gender: string): Observable<Profile> {
    const url = `${this.baseUrl}/profile/upload-profile-image/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = new FormData();
    
    body.append('file', file);
    body.append('gender', gender);

    return this.http.patch<Profile>(url, body, { headers })
    .pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Obtener los proyectos colaborativos
  getCollaborations(): Observable<DiagramResponse[]> {
    const url = `${this.baseUrl}/drawing/collaborations`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<DiagramResponse[]>(url, { headers }).pipe(
      tap((diagrams) => (this.myCollaborations = diagrams)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  // Valida el token para agregarse a un proyecto como colaborador
  validateToken(id: string): Observable<DiagramResponse> {
    const url = `${this.baseUrl}/drawing/validateToken/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<AddCollaboratorResponse>(url, { headers }).pipe(
      map((resp) => resp.drawing),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Crear un nuevo proyecto
  createProject(name: string, description: string): Observable<Diagram> {
    const url = `${this.baseUrl}/drawing/create`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { name, description };
    
    return this.http.post<Diagram>(url, body, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Actualizar un proyecto
  updateProject(params: DiagramUpdateParams): Observable<any> {
    const { id, name, description, data } = params;
    const url = `${this.baseUrl}/drawing/update/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { name, description, data };
    
    return this.http.patch(url, body, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  // Eliminar un proyecto
  deleteProject(id: string): Observable<any> {
    const url = `${this.baseUrl}/drawing/delete/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(url, { headers }).pipe(
      // tap((res) => console.log(res)),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  
  // Obtener un proyecto por su id
  getProject(id: string): Observable<DiagramResponse> {
    const url = `${this.baseUrl}/drawing/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<DiagramResponse>(url, { headers }).pipe(
      // tap((resp) => console.log(resp)),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Obtener los proyectos del usuario actual
  getProjects(): Observable<DiagramResponse[]> {
    const url = `${this.baseUrl}/drawing`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<DiagramResponse[]>(url, { headers }).pipe(
      tap((diagrams) => (this._projectsSubject.next(diagrams))),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
}
