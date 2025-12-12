import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimatedBackgroundComponent],
  templateUrl: './about.component.html', 
  styleUrls: ['./about.component.css']     
})
// En about.component.ts
export class AboutComponent {
  skills = [
    { name: 'Angular', icon: '🅰️', levelPercentage: 65 },
    { name: 'GO', icon: '🟢', levelPercentage: 55 },
    { name: 'C#', icon: '🔷', levelPercentage: 60 },
    { name: 'React', icon: '⚛️', levelPercentage: 75 },
    { name: 'AWS', icon: '☁️', levelPercentage: 80 },
    { name: 'Docker', icon: '🐳', levelPercentage: 80 },
    { name: 'SQL', icon: '🗃️', levelPercentage: 80 },
    { name: 'Python', icon: '🐍', levelPercentage: 75 }
  ];  

  scrollToSkills() {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}