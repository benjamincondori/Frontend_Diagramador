import { Component, Input } from '@angular/core';
import { GrapherService } from '../../services/grapher.service';
import { DiagramUpdateParams } from 'src/app/home/interfaces/diagram.interface';
import { DiagramResponse } from 'src/app/home/interfaces/diagrams-response.interface';
import { HomeService } from 'src/app/home/services/home.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';

@Component({
  selector: 'app-modal-save',
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.css']
})
export class ModalSaveComponent {
  @Input() imagenURL?: string;
  
  constructor(
    private grapherService: GrapherService,
    private homeService: HomeService,
    private alertsService: AlertsService,
  ) {}
  
  get showModal(): boolean {
    return this.grapherService.isOpenModalSave;
  }
  
  closeModal() {
    this.grapherService.closeModalSave();
  }
  
  save() {
    this.updateProject();
  }
  
  updateProject(): void {
    if (!this.grapherService.project) return;
    
    const diagram: DiagramResponse = this.grapherService.project;
    const params: DiagramUpdateParams = {
      id: diagram.id,
      data: diagram.data!,
    }

    this.homeService.updateProject(params).subscribe({
      next: (resp) => {
        this.grapherService.closeModalSave();
        // this.homeService.getProjects().subscribe();
        // this.homeService.getCollaborations().subscribe();
        
        const message = 'Tu proyecto ha sido guardado con éxito.';
        const title = '¡Proyecto guardado!';
        this.alertsService.alertSuccess(message, title);
      },
      error: (errorMessage) => {
        const message = 'No se pudo guardar el proyecto.';
        const title = '¡Error!';
        this.alertsService.alertError(message, title);
      },
    });
  }
  
  saveAsImage() {
    // Crear un enlace temporal para descargar la imagen
    if (!this.imagenURL) return;
    const link = document.createElement('a');
    link.href = this.imagenURL;
    link.download = 'mi_diagrama.png';
    link.click();
  }
  
  saveAsJson() {
    const data = this.grapherService.project?.data;
    if (!data) return;
    const dataString = JSON.stringify(data);
    this.descargarArchivo(dataString, 'diagrama.json', 'application/json');
  }
  
  descargarArchivo(contenido: string, nombreArchivo: string, tipoArchivo: string) {
    const blob = new Blob([contenido], { type: tipoArchivo });
    const url = window.URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();

    window.URL.revokeObjectURL(url);
  }
  
}
