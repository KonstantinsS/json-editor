import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: 'editor',
    canActivate: [authGuard],
    loadComponent: () => import('./components/editor/editor.component').then((mod) => mod.EditorComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
