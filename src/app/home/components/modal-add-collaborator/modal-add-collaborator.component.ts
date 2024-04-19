import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { HomeService } from '../../services/home.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { GrapherService } from 'src/app/grapher/services/grapher.service';
import { Router } from '@angular/router';
import { DiagramResponse } from '../../interfaces/diagrams-response.interface';

@Component({
  selector: 'app-modal-add-collaborator',
  templateUrl: './modal-add-collaborator.component.html',
  styleUrls: ['./modal-add-collaborator.component.css']
})
export class ModalAddCollaboratorComponent implements OnInit {
  
  public myForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private homeService: HomeService,
    private grapherService: GrapherService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
  ) {}
  
  ngOnInit(): void {
    this.myForm = this.fb.group({
      token: ['', Validators.required]
    });
  }
  
  get isOpen(): boolean {
    return this.modalService.isOpenAddCollaborator;
  }
  
  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    
    const token = this.myForm.get('token')?.value;
    if (!token) return;
    
    this.homeService.validateToken(token).subscribe({
      next: (project) => {
        this.closeModal();
        this.myForm.reset();
        console.log(project);
        const title = '¡Token validado con exito!';
        const message = 'Se ha validado el token con exito, ahora puedes colaborar en el proyecto.';
        this.alertsService.alertSuccess(message, title);
        
        this.homeService.getCollaborations().subscribe();
        this.goToGrapher(project);
      },
      error: (errorMessage) => {
        if (errorMessage.includes('User is already a collaborator on this diagram')) {
          const title = '¡Ya eres colaborador!';
          const message = 'Ya eres colaborador en este proyecto, no puedes ser colaborador dos veces.';
          this.alertsService.alertInfo(message, title);
        } else {
          const title = '¡Token invalido!';
          const message = 'El token ingresado no es válido, por favor verifique el token.';
          this.alertsService.alertError(message, title);
        }
      }
    });
  }
  
  goToGrapher(project: DiagramResponse): void {
    this.grapherService.setCurrentProject(project);
    this.router.navigate(['/grapher']);
  }
  
  closeModal(): void {
    this.modalService.closeModal();
    this.myForm.reset();
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.myForm, field);
  }
  
}
