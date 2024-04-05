import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    // canActivate: [ isNotAuthenticatedGuard ],
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    // canActivate: [ isAuthenticatedGuard ],
  },
  {
    path: 'grapher',
    loadChildren: () => import('./grapher/grapher.module').then(m => m.GrapherModule),
    // canActivate: [ isAuthenticatedGuard ],
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
