import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private showModal: boolean = false;
  private isEditing: boolean = false;
  
  constructor() { }
  
  get isOpen(): boolean {
    return this.showModal;
  }
  
  get isEdit(): boolean {
    return this.isEditing;
  }
  
  openModal(): void {
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
}
