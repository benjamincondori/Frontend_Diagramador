import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LoaderComponent } from './components/loader/loader.component';
import { InputModalComponent } from './components/input-modal/input-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './components/slider/slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    LoaderComponent,
    InputModalComponent,
    SliderComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    CarouselModule,
  ],
  exports: [
    LoaderComponent,
    InputModalComponent,
    SliderComponent,
  ]
})
export class SharedModule { }
