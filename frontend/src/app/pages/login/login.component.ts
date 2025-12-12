import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AnimatedBackgroundComponent],
  template: `
    <app-animated-background></app-animated-background>
    
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-white mb-2">Bienvenido a</h1>
          <div class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            GustavoCode
          </div>
        </div>

        <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
          <h2 class="text-2xl font-bold text-white text-center mb-8">Iniciar Sesión</h2>
          
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
            <div>
              <label for="userName" class="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <input 
                type="text" 
                id="userName" 
                name="userName" 
                [(ngModel)]="userName" 
                required 
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu nombre de usuario"
              >
            </div>

            <button cursor-pointer
              type="submit" 
              [disabled]="!loginForm.form.valid || isLoading"
              class="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <span *ngIf="!isLoading">Ingresar</span>
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>

            <div class="text-center mt-4">
              <p class="text-sm text-gray-400">
                ¿No tienes una cuenta? 
                <a routerLink="/" class="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Regístrate
                </a>
              </p>
            </div>
          </form>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            Al continuar, aceptas nuestros 
            <a href="#" class="text-indigo-400 hover:underline">Términos de servicio</a> y 
            <a href="#" class="text-indigo-400 hover:underline">Política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  userName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.userName.trim()) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      // Simulamos un pequeño retraso para la animación de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.authService.login(this.userName);
      this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}