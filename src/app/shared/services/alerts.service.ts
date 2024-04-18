import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string) {
    this.toastr.success(message, title);
  }

  error(message: string, title?: string) {
    this.toastr.error(message, title);
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title);
  }

  info(message: string, title?: string) {
    this.toastr.info(message, title);
  }

  alertSuccess(message: string, title?: string): void {
    Swal.fire({
      title: title ? title : 'Todo se realizó con éxito!!',
      text: message,
      icon: 'success',
      timer: 2000,
    });
  }

  alertError(message: string, title?: string): void {
    Swal.fire({
      title: title ? title : 'Oops... ocurrió un error!!',
      text: message,
      icon: 'error',
      timer: 2000,
    });
  }
  
  alertInfo(message: string, title?: string): void {
    Swal.fire({
      title: title ? title : 'Oops...!',
      text: message,
      icon: 'info',
      timer: 2000,
    });
  }

}
