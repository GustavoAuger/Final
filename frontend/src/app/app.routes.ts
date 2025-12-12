import { Routes, Router } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/about.component';
import { ApplicationComponent } from './pages/application/application.component';
import { authGuard } from './guards/auth.guard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';


export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [() => {
      const router = inject(Router);
      const authService = inject(AuthService);
      if (authService.isAuthenticated()) {
        return router.parseUrl('/');
      }
      return true;
    }]
  },
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'acerca', 
    component: AboutComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'aplicacion',
    component: ApplicationComponent,
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: 'login',
    pathMatch: 'full' 
  },
];