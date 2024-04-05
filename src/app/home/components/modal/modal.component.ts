import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  constructor(private modalService: ModalService) { }
  
  get isOpen(): boolean {
    return this.modalService.isOpen;
  }
  
  closeModal(): void {
    this.modalService.closeModal();
  }
  
}
