import {
  Component,
  computed,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

const PHOTO: string = './assets/images/user_profile.png';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showOptions = false;
  currentUser = computed(() => this.authService.currentUser());
  photo = computed(() => this.currentUser()?.profile.photo || PHOTO);
  
  @ViewChild('options') options?: ElementRef;
  @ViewChild('avatar') avatar?: ElementRef;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,  
  ) {
  }

  ngOnInit() {
    // this.photo =  this.currentUser()?.profile.photo || PHOTO;
    
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
  
  logout(): void {
    this.authService.logout();
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  hideOptions() {
    this.showOptions = false;
  }
}
