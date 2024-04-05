import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private showModal: boolean = false;
  
  constructor() { }
  
  get isOpen(): boolean {
    return this.showModal;
  }
  
  openModal(): void {
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
}
