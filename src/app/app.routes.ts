// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then((c) => c.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((c) => c.RegisterComponent),
  },
  {
    path: 'inicio-form',
    loadComponent: () =>
      import('./inicio-form/inicio-form').then((c) => c.InicioFormComponent),
  },
  {
    path: 'test',
    loadComponent: () => import('./test/test').then((c) => c.TestComponent),
  },
  {
    path: 'resultados',
    loadComponent: () =>
      import('./resultados/resultados').then((c) => c.ResultadosComponent),
  },
  {
    path: 'universidad',
    loadComponent: () =>
      import('./universidad/universidad').then((c) => c.UniversidadComponent),
  },
  {
    path: 'carrera/:nombre',
    loadComponent: () =>
      import('./carrera/carrera').then((c) => c.CarreraComponent),
  },
  {
    path: 'universidades/:career',
    loadComponent: () =>
      import('./universidades-carrera/universidades-carrera').then(
        (c) => c.UniversidadesCarreraComponent
      ),
  },
  {
    path: 'info-usuario',
    loadComponent: () =>
      import('./info-user/info-user').then((c) => c.InfoUserComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/login/login').then((c) => c.LoginComponent),
  },
];
