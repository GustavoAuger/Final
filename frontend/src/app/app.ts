import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  template: `
    <app-header *ngIf="showHeaderAndFooter()"></app-header>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="showHeaderAndFooter()"></app-footer>
  `,
  styles: []
})
export class App {
  private router = inject(Router);

  showHeaderAndFooter(): boolean {
    // Obtiene la URL actual sin parámetros
    const url = this.router.url.split('?')[0];
    // Lista de rutas donde NO queremos mostrar el header ni el footer
    const hiddenRoutes = ['/login'];
    return !hiddenRoutes.includes(url);
  }
}