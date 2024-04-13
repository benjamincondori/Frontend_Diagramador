import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { DiagramResponse } from 'src/app/home/interfaces/diagrams-response.interface';
import { environment } from 'src/environments/environment';
import { Link } from '../interfaces/link.interface';

@Injectable({
  providedIn: 'root'
})
export class GrapherService {
  private readonly baseUrl: string = environment.baseUrl;
  
  private showModal: boolean = false;
  private currentProject?: DiagramResponse;
  
  private _link = new Subject<Link>();
  public link = this._link.asObservable();
  
  constructor(private http: HttpClient) { }
  
  get isOpen(): boolean {
    return this.showModal;
  }
  
  get project(): DiagramResponse | undefined {
    return this.currentProject;
  }
  
  setLink(link: Link): void {
    this._link.next(link);
  }
  
  setCurrentProject(project: DiagramResponse): void {
    this.currentProject = project;
    this.generateTokenShare(project.id).subscribe();
  }
  
  generateTokenShare(id: number): Observable<Link> {
    const url = `${this.baseUrl}/drawing/share-token/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Link>(url, { headers }).pipe(
      tap((link) => this.setLink(link)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  } 
  
  openModal(): void {
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
}
