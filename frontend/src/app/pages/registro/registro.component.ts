import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';

interface Area {
  ID: number;
  nombre: string;
}

interface ApiError {
  error: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AnimatedBackgroundComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  nombre = signal('');
  email = signal('');
  areaId = signal<number | null>(null);
  
  areas = signal<Area[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    console.log('Cargando áreas desde el backend...');
    this.http.get<{data: Area[]}>('/api/v1/areas').subscribe({
      next: (response) => {
        console.log('Respuesta completa del backend:', response);
        const areasArray = response.data;
        console.log('Áreas extraídas:', areasArray);
        console.log('Primera área completa:', areasArray[0]);
        console.log('Propiedades de la primera área:', Object.keys(areasArray[0]));
        console.log('ID de la primera área (minúscula):', (areasArray[0] as any)?.id);
        console.log('ID de la primera área (MAYÚSCULA):', areasArray[0]?.ID);
        this.areas.set(areasArray);
        console.log('Total de áreas cargadas:', areasArray.length);
      },
      error: (error) => {
        console.error('Error al cargar áreas:', error);
        this.errorMessage.set('No se pudieron cargar las áreas. Por favor, intenta de nuevo.');
      }
    });
  }

  onSubmit(): void {
    console.log('=== INICIO DEL SUBMIT ===');
    console.log('Estado inicial - nombre:', this.nombre());
    console.log('Estado inicial - email:', this.email());
    console.log('Estado inicial - areaId:', this.areaId());
    
    // Reset messages
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validación de nombre
    if (!this.nombre() || this.nombre().trim() === '') {
      const mensaje = 'El nombre es obligatorio. Por favor, ingresa el nombre completo.';
      this.errorMessage.set(mensaje);
      console.log('Error de validación:', mensaje);
      return;
    }

    // Validación de email
    if (!this.email() || this.email().trim() === '') {
      const mensaje = 'El correo electrónico es obligatorio. Por favor, ingresa un correo válido.';
      this.errorMessage.set(mensaje);
      console.log('Error de validación:', mensaje);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email())) {
      const mensaje = 'El formato del correo electrónico no es válido. Ej: nombre@empresa.com';
      this.errorMessage.set(mensaje);
      console.log('Error de validación:', mensaje);
      return;
    }

    // Validación de área
    const areaValue = this.areaId();
    console.log('Validando área - Valor actual de areaId():', areaValue);
    console.log('Tipo de areaId():', typeof areaValue);
    console.log('Es null?:', areaValue === null);
    console.log('Es NaN?:', Number.isNaN(areaValue));
    console.log('Es 0?:', areaValue === 0);
    
    if (areaValue === null || Number.isNaN(areaValue) || areaValue === 0) {
      const mensaje = 'Debes seleccionar un área. Por favor, elige una opción del menú desplegable.';
      this.errorMessage.set(mensaje);
      console.log('Error de validación:', mensaje);
      return;
    }

    this.loading.set(true);

    const personaData = {
      nombre: this.nombre(),
      email: this.email(),
      area_id: this.areaId()
    };

    console.log('Enviando datos al backend:', personaData);
    console.log('Tipo de area_id:', typeof personaData.area_id);

    this.http.post('/api/v1/personas', personaData).subscribe({
      next: (response) => {
        console.log('Persona registrada exitosamente. Respuesta del backend:', response);
        this.successMessage.set('¡Persona registrada exitosamente!');
        this.loading.set(false);
        
        // Limpiar formulario
        this.nombre.set('');
        this.email.set('');
        this.areaId.set(null);

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/resultados']);
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        
        // Mostrar mensaje de error del backend
        if (error.error && error.error.error) {
          this.errorMessage.set(error.error.error);
        } else if (error.status === 0) {
          this.errorMessage.set('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
        } else {
          this.errorMessage.set('Ocurrió un error al registrar la persona. Por favor, intenta de nuevo.');
        }
        console.error('Error al registrar persona:', error);
      }
    });
  }

  onAreaChange(event: Event): void {
    console.log('🔵 onAreaChange LLAMADO');
    console.log('0. Áreas disponibles:', this.areas());
    console.log('0b. Cantidad de áreas:', this.areas().length);
    
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    
    console.log('1. Valor crudo del select:', value);
    console.log('1b. Selected index:', selectElement.selectedIndex);
    console.log('1c. Selected option text:', selectElement.options[selectElement.selectedIndex]?.text);
    console.log('1d. Todas las opciones:', Array.from(selectElement.options).map(o => ({value: o.value, text: o.text})));
    console.log('2. Tipo del valor:', typeof value);
    console.log('3. Valor es string vacío?:', value === '');
    
    if (!value || value === '' || value === 'undefined') {
      console.log('4. Valor vacío o undefined, seteando null');
      this.areaId.set(null);
      return;
    }
    
    const selectedId = Number(value);
    console.log('5. Número convertido:', selectedId);
    console.log('6. Es NaN?:', Number.isNaN(selectedId));
    
    this.areaId.set(selectedId);
    console.log('7. areaId después de set:', this.areaId());
    
    // Buscar el área seleccionada para mostrar su nombre
    const selectedArea = this.areas().find(a => a.ID === selectedId);
    console.log('8. Área encontrada:', selectedArea);
  }
}
