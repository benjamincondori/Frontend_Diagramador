import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrapherRoutingModule } from './grapher-routing.module';
import { GrapherPageComponent } from './pages/grapher-page/grapher-page.component';
import { ModalShareComponent } from './components/modal-share/modal-share.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GrapherPageComponent,
    ModalShareComponent
  ],
  imports: [
    CommonModule,
    GrapherRoutingModule,
    DragDropModule,
    SharedModule,
  ]
})
export class GrapherModule { }
