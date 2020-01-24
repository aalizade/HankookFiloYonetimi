import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  // Login Layout
  {
    path: 'login',
    loadChildren : () => import('./lazy-login/lazy-login.module').then(m => m.LazyLoginModule)
  },

  {
    path: '',
    pathMatch:"full",
    loadChildren : () => import('./lazy-login/lazy-login.module').then(m => m.LazyLoginModule)
  },

  // Home Layout

  {
    path: 'home',
    loadChildren : () => import('./lazy-home-page/lazy-home-page.module').then(m => m.LazyHomePageModule)
  },

  // Admin Layout
  {
    path: 'admin',
    loadChildren : () => import('./lazy-general-page/lazy-general-page.module').then(m => m.LazyGeneralPageModule)
  },

  // Araç Bakım Layout
  {
    path: 'islemler',
    loadChildren : () => import('./lazy-arac-bakim-page/lazy-arac-bakim-page.module').then(m => m.LazyAracBakimPageModule)
  },

    // Lastik Bakım Layout
    {
      path: 'lastik-bakim',
      loadChildren : () => import('./lazy-lastik-bakim-page/lazy-lastik-bakim-page.module').then(m => m.LazyLastikBakimPageModule)
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
