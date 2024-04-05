import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showOptions = false;
  @ViewChild('options') options?: ElementRef;
  @ViewChild('avatar') avatar?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.listen('document', 'click', (event) => {
      const clickedOutsideOptions = !this.options?.nativeElement.contains(
        event.target
      );
      const clickedOutsideAvatar = !this.avatar?.nativeElement.contains(
        event.target
      );
      if (this.showOptions && clickedOutsideOptions && clickedOutsideAvatar) {
        this.showOptions = false;
      };
    });
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  hideOptions() {
    this.showOptions = false;
  }
}
