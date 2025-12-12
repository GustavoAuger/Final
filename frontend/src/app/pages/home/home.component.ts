import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AnimatedBackgroundComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
}