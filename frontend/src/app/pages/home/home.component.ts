import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { RoadmapComponent } from './components/roadmap/roadmap.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AnimatedBackgroundComponent, RouterLink, RoadmapComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentWeek = 1;
  sprintData = [
  { week: 1, title: 'Backend con SpringBoot', description: 'Consolidar los conocimientos en Java implementando un backend con SpringBoot, utilizando buenas practicas de diseño.', link: 'https://github.com/GustavoAuger/semana1' },
  { week: 2, title: 'Microservicios con Go', description: 'Refactorización del backend para implementar microservicios con Go.', link: 'https://github.com/GustavoAuger/semana2' },
  { week: 3, title: 'Frontend con Angular', description: 'Diseño y desarrollo del frontend con Angular e integración con el backend.', link: 'https://github.com/GustavoAuger/semana3' },
  { week: 4, title: 'Implementación Pruebas unitarias', description: 'Pruebas unitarias para validar funcionalidades.', link: 'https://github.com/GustavoAuger/semana4' },
  { week: 5, title: 'Funcionalidades Avanzadas', description: 'Continuidad por definir.', link: 'https://github.com/GustavoAuger/semana5' }
];

    nextWeek() {
    if (this.currentWeek < 4) {  // Máximo 4 semanas
      this.currentWeek++;
    }
  }

  previousWeek() {
    if (this.currentWeek > 1) {  // Mínimo 1
      this.currentWeek--;
    }
  }
}