import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { GrapherService } from 'src/app/grapher/services/grapher.service';
import { DiagramResponse } from 'src/app/home/interfaces/diagrams-response.interface';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  
  @Input() cards: DiagramResponse[] = [];
  
  constructor(
    private grapherService: GrapherService,
    private router: Router,
  ) {}

  customOptions: OwlOptions = {
    loop: false,
    // items: 4,
    // margin: 18,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    dotsEach: false,
    nav: true,
    navSpeed: 500,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      1024: {
        items: 4,
      },
    },
  };
  
  goToDiagram(project: DiagramResponse) {
    this.grapherService.setCurrentProject(project);
    this.router.navigate(['/grapher']);
  }
  
  
}
