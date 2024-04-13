import { Injectable } from '@angular/core';
import { DiagramResponse } from '../interfaces/diagrams-response.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private showModal: boolean = false;
  private isEditing: boolean = false;
  
  private _editingSubject = new Subject<boolean>();
  public editing = this._editingSubject.asObservable();
  
  private myProject?: DiagramResponse;
  
  constructor() { }
  
  get isOpen(): boolean {
    return this.showModal;
  }
  
  get isEdit(): boolean {
    return this.isEditing;
  }
  
  get project(): DiagramResponse | undefined {
    return this.myProject;
  }
  
  openModalSave(): void {
    this.showModal = true;
    this.isEditing = false;
    this._editingSubject.next(false);
  }
  
  openModalEdit(project: DiagramResponse): void {
    this.showModal = true;
    this.isEditing = true;
    this.myProject = project;
    this._editingSubject.next(true);
  }
  
  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
  }
  
}
