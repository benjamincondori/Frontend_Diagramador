import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { HomeLayoutComponent } from './pages/home-layout/home-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomePageComponent,
    SettingsPageComponent,
    HomeLayoutComponent,
    NavbarComponent,
    FooterComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class HomeModule { }
