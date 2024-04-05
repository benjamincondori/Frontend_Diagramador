import { Component } from '@angular/core';
import { ShareService } from '../../services/share.service';


@Component({
  selector: 'app-grapher-page',
  templateUrl: './grapher-page.component.html',
  styleUrls: ['./grapher-page.component.css']
})
export class GrapherPageComponent {
  
  constructor(private shareService: ShareService) { }
  
  openModal(): void {
    this.shareService.openModal();
  }
  
}
