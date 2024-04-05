import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent {
  
  constructor(private router: Router) { }

  ngOnInit() {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    sign_up_btn!.addEventListener("click", () => {
      container!.classList.add("sign-up-mode");
      this.router.navigate(['/auth/register']);
    });

    sign_in_btn!.addEventListener("click", () => {
      container!.classList.remove("sign-up-mode");
      this.router.navigate(['/auth/login']);
    });
  }
  
}
