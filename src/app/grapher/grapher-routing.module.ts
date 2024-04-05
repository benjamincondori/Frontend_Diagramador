import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrapherPageComponent } from './pages/grapher-page/grapher-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: GrapherPageComponent },
      { path: '**', redirectTo: '' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrapherRoutingModule { }
