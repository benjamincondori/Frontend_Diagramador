import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  page: number = 1;
  limit: number = 8;
  projects;
  
  showOptions = false;
  openCardIndex: number = -1;
  
  @ViewChild('card') card!: ElementRef;
  
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private modalService: ModalService,
  ) {
    
    this.projects = [
      {
        name: 'Proyecto de ing de software',
        description: 'El proyecto de ingeniería de software es una asignatura de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '15 de marzo de 2024',
      },
      {
        name: 'Proyecto de tecnologia web',
        description: 'El proyecto de tecnología web es una asignatura de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '30 de marzo de 2024',
      },
      {
        name: 'Proyecto de sistemas de información',
        description: 'El proyecto de sistemas de información es una asignatura de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '15 de abril de 2024',
      },
      {
        name: 'Proyecto de programación',
        description: 'El proyecto de programación es una asignatura de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '30 de abril de 2024',
      },
      {
        name: 'Proyecto de bases de datos',
        description: 'El proyecto de bases de datos es una asignatura de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '15 de mayo de 2024',
      },
      {
        name: 'Proyecto de redes',
        description: 'El proyecto de redes es de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '30 de mayo de 2024',
      },
      {
        name: 'Proyecto de sistemas operativos',
        description: 'El proyecto de sistemas operativos es una asignatura de la carrera de ingeniería.',
        date: '15 de junio de 2024',
      },
      {
        name: 'Proyecto de arquitectura de computadores',
        description: 'El proyecto de arquitectura de computadores de la Universidad de Cádiz.',
        date: '30 de junio de 2024',
      },
      {
        name: 'Proyecto de inteligencia artificial',
        description: 'El proyecto de inteligencia artificial es de la carrera de ingeniería informática de la Universidad de Cádiz.',
        date: '15 de julio de 2024',
      },
      {
        name: 'Proyecto de computación cuántica',
        description: 'El proyecto de computación cuántica es una asignatura de la carrera de ingeniería informática.',
        date: '30 de julio de 2024',
      }
    ]
    
  }
  
  ngOnInit(): void {
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
  goToGrapher(): void {
    this.router.navigate(['/grapher']);
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
  
  // Projects
  editProject(): void {
    this.hideOptions();
  }
  
  deleteProject(): void {
    this.hideOptions();
  }
  
  
  // Modals
  openModal(): void {
    this.modalService.openModal();
  }
  
}
