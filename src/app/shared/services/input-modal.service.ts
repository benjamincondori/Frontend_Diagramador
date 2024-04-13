import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputModalService {

  private _showModal: boolean = false;
  private _text = new Subject<string | null>();
  
  public text$ = this._text.asObservable();
  
  constructor() { }
  
  get isOpen(): boolean {
    return this._showModal;
  }
  
  setText(text: string | null) {
    this._text.next(text);
  }
  
  openModal(): void {
    this._showModal = true;
  }
  
  closeModal() {
    this._showModal = false;
  }
  
}
