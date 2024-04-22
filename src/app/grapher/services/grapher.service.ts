import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { DiagramResponse } from 'src/app/home/interfaces/diagrams-response.interface';
import { environment } from 'src/environments/environment';
import { Link } from '../interfaces/link.interface';
import { CookieService } from 'ngx-cookie-service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class GrapherService {
  private readonly baseUrl: string = environment.baseUrl;
  
  private showModal: boolean = false;
  private showModalSave: boolean = false;
  private currentProject?: DiagramResponse;
  
  private _link = new Subject<Link>();
  public link = this._link.asObservable();
  
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private wsService: WebsocketService,
  ) { }
  
  get isOpen(): boolean {
    return this.showModal;
  }
  
  get isOpenModalSave(): boolean {
    return this.showModalSave;
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
    
    // this.saveCookieRoom(project.id);
    this.joinRoom();
  }
  
  private joinRoom() {
    this.wsService.joinRoom(this.project!.id);
  }
  
  // private saveCookieRoom(nameRoom: string) {
  //   this.cookieService.set('room', nameRoom);
  // }
  
  setDataCurrentProject(data: string): void {
    this.currentProject!.data = data;
  }
  
  generateTokenShare(id: string): Observable<Link> {
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
  
  openModalSave(): void {
    this.showModalSave = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
  closeModalSave(): void {
    this.showModalSave = false;
  }
  
}
