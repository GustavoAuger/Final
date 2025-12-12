import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

interface AreaConteo {
  ID: number;
  nombre: string;
  descripcion: string;
  personas: number;
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective, AnimatedBackgroundComponent],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  areasConteo = signal<AreaConteo[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  totalPersonas = signal(0);

  // Configuración del gráfico de barras
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Cantidad de Personas',
        backgroundColor: 'rgba(99, 102, 241, 0.7)', // Indigo
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y + ' persona(s)';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        }
      },
      x: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        }
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAreasConteo();
  }

  loadAreasConteo(): void {
    this.loading.set(true);
    console.log('Cargando conteo de áreas desde el backend...');
    
    this.http.get<{data: AreaConteo[]}>('/api/v1/areas/conteo').subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        const areas = response.data;
        this.areasConteo.set(areas);
        
        // Calcular total de personas
        const total = areas.reduce((sum, area) => sum + area.personas, 0);
        this.totalPersonas.set(total);
        
        // Actualizar datos del gráfico
        this.barChartData.labels = areas.map(a => a.nombre);
        this.barChartData.datasets[0].data = areas.map(a => a.personas);
        
        this.loading.set(false);
        console.log('Áreas con conteo cargadas:', areas);
      },
      error: (error) => {
        console.error('Error al cargar áreas con conteo:', error);
        this.errorMessage.set('No se pudieron cargar las estadísticas. Verifica que el backend esté ejecutándose.');
        this.loading.set(false);
      }
    });
  }

  recargarDatos(): void {
    this.errorMessage.set('');
    this.loadAreasConteo();
  }
}
