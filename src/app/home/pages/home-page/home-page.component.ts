import { Component, computed, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { HomeService } from '../../services/home.service';
import { DiagramResponse } from '../../interfaces/diagrams-response.interface';
import Swal from 'sweetalert2';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GrapherService } from 'src/app/grapher/services/grapher.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  page: number = 1;
  limit: number = 8;
  projects: DiagramResponse[] = [];
  copyProjects!: DiagramResponse[];
  searchForm!: FormGroup;
  loadingProjects: boolean = true;
  
  showOptions = false;
  openCardIndex: number = -1;
  
  @ViewChild('card') card!: ElementRef;
  
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private modalService: ModalService,
    private homeService: HomeService,
    private alertsService: AlertsService,
    private grapherService: GrapherService,
    private fb: FormBuilder,
  ) {}
  
  ngOnInit(): void {
    this.getAllProjects();
    this.homeService.projects.subscribe((projects) => { 
      this.projects = projects;
      this.copyProjects = this.projects; 
      setTimeout(() => {
        this.loadingProjects = false;
      }, 1000)
    });
    
    this.searchForm = this.fb.group({
      search: [''],
      date: [''],
    });
    
    this.searchForm.valueChanges.subscribe(() => {
      let { search, date } = this.searchForm.value;
      this.projects = this.copyProjects;
      date = this.formatDateInput(date);
      this.filterProjects(search, date);
    });
    
    this.renderer.listen('document', 'click', (event) => {
      const clickedOutsideCards = !this.card.nativeElement.contains(
        event.target
      );
      if (this.showOptions && clickedOutsideCards) {
        this.showOptions = false;
      };
    });
  
  }
  
  // Go to Diagrammer
  goToGrapher(project: DiagramResponse): void {
    this.grapherService.setCurrentProject(project);
    this.router.navigate(['/grapher']);
  }
  
  // Obtener todos los proyectos
  getAllProjects() {
    this.homeService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  // Filtra los proyectos por nombre y fecha
  filterProjects(searchTerm: string, searchDate: string) {
    // this.projects = [...this.diagrams];
    if (searchTerm !== '' && searchDate !== '') {
      this.projects = this.projects.filter(project => {
        const date = this.formatDate(project.createdAt);
        console.log(date);
        return project.name.toLowerCase().includes(searchTerm.toLowerCase()) && date.includes(searchDate)
      });
    } else if (searchDate !== '') {
      this.projects = this.projects.filter(project => {
        const date = this.formatDate(project.createdAt);
        console.log(date);
        return date.includes(searchDate)
      });
    } else if (searchTerm !== '') {
      this.projects = this.projects.filter(project => {
        return project.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      this.getAllProjects();
    }
    
    this.page = 1;
  }
  
  // Formatea la fecha en formato 'dd/mm/yyyy'
  formatDate(date: string): string {
    const fechaRecibida = new Date(date);
    const fechaFormateada = fechaRecibida.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      // fractionalSecondDigits: 3, // Para incluir milisegundos
    });
    return fechaFormateada;
  }
  
  formatDateInput(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const partes = dateString.split('-');
    const nuevaFecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
    return nuevaFecha;
  }
  

  // Show Options Card
  toggleOptions(index: number): void {
    if (this.openCardIndex === index) {
      this.showOptions = !this.showOptions;
    } else {
      this.openCardIndex = index;
      this.showOptions = true;
    }
  }

  hideOptions(): void {
    this.showOptions = false;
  }
  

  // Eliminar un proyecto
  deleteProject(id: number): void {
    // this.hideOptions();
    this.showConfirmationDialog().then((confirmed) => {
      if (confirmed) {
        this.homeService.deleteProject(id).subscribe({
          next: (resp) => {
            const message = 'El proyecto ha sido eliminado con éxito.';
            const title = '¡Proyecto Eliminado!';
            this.alertsService.alertSuccess(message, title);
            
            this.homeService.getProjects().subscribe();
          },
          error: (err) => {
            const message = 'Ha ocurrido un error al intentar eliminar el proyecto.';
            const title = '¡Error!';
            this.alertsService.alertError(message, title);
          }
        });
      }
    });
  }
  
  showConfirmationDialog(): Promise<boolean> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  
  
  // Modals
  openModalSave(): void {
    this.modalService.openModalSave();
  }
  
  openModalEdit(project: DiagramResponse): void {
    this.modalService.openModalEdit(project);
  }
  
}
