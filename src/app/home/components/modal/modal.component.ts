import { Component, computed, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { HomeService } from '../../services/home.service';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { DiagramResponse } from '../../interfaces/diagrams-response.interface';
import { DiagramUpdateParams } from '../../interfaces/diagram.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  projectForm!: FormGroup;
  
  constructor(
    private modalService: ModalService,
    private homeService: HomeService,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
    private router: Router,
    private fb: FormBuilder,  
  ) { }
  
  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
    
    this.modalService.editing.subscribe((isEditing) => {
      if (isEditing) {
        this.projectForm.patchValue({
          name: this.project?.name,
          description: this.project?.description,
        });
      } else {
        this.projectForm.reset();
      }
    });
  }
  
  get isOpen(): boolean {
    return this.modalService.isOpen;
  }
  
  get isEditing(): boolean {
    return this.modalService.isEdit;
  }
  
  get project(): DiagramResponse | undefined {
    return this.modalService.project
  }
  
  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    if (this.isEditing) {
      this.updateProject();
    } else {
      this.saveProject();
    }
    
  }
  
  saveProject(): void {
    const { name, description } = this.projectForm.value;
    
    this.homeService.createProject(name, description).subscribe({
      next: (project) => {
        // this.diagrammerService.setCurrentDiagram(diagram);
        
        this.modalService.closeModal();
        this.projectForm.reset();
        
        const title = '¡Proyecto creado!';
        const message = 'El proyecto ha sido creado con éxito';
        this.alertsService.alertSuccess(message, title);
        this.homeService.getProjects().subscribe();
        
        // this.router.navigateByUrl('/diagrammer');
      }, 
      error: (errorMessage) => {
        const title = '¡Error al crear el proyecto!';
        const message = 'Ha ocurrido un error al crear el proyecto, por favor intenta de nuevo.';
        this.alertsService.alertError(message, title);
      }
    });
  }
  
  updateProject(): void {
    const id = this.project!.id;
    
    const params: DiagramUpdateParams = {
      id: id,
      ...this.projectForm.value,
    }

    this.homeService.updateProject(params).subscribe({
      next: (resp) => {
        this.modalService.closeModal();
        this.projectForm.reset();
        
        const message = 'Tu proyecto ha sido actualizado con éxito.';
        const title = '¡Proyecto actualizado!';
        this.alertsService.alertSuccess(message, title);
        this.homeService.getProjects().subscribe();
      },
      error: (errorMessage) => {
        const message = 'No se pudo actualizar el proyecto.';
        const title = '¡Error!';
        this.alertsService.alertError(message, title);
      },
    });
  }
  
  closeModal(): void {
    this.modalService.closeModal();
    this.projectForm.reset();
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.projectForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.projectForm, field);
  }
}
  

