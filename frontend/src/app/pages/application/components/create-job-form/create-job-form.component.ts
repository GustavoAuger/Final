import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobService, CreateOfertaRequest, CreateEspecificacionRequest } from '../../../../services/job.service';

@Component({
  selector: 'app-create-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job-form.component.html',
  styleUrls: ['./create-job-form.component.css']
})
export class CreateJobFormComponent {
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  jobForm: FormGroup;
  isSubmitting = false;
  submitError = '';

  // Opciones para dropdowns
  estados = ['Activa', 'Inactiva', 'Pausada'];
  idiomas = ['Español', 'Inglés', 'Portugués', 'Francés'];
  paises = ['Argentina', 'Colombia', 'México', 'Chile', 'Perú', 'Uruguay', 'Brasil', 'Ecuador'];
  monedas = ['USD', 'ARS', 'COP', 'MXN', 'CLP', 'PEN', 'UYU', 'BRL', 'EUR'];
  modalidadesSalario = ['Mensual', 'Anual', 'Por hora', 'Por proyecto'];
  tiposContrato = ['Tiempo completo', 'Medio tiempo', 'Por contrato', 'Freelance', 'Pasantía'];
  modalidadesTrabajo = ['Remoto', 'Presencial', 'Híbrido'];
  categorias = ['Desarrollo', 'Diseño', 'Marketing', 'Ventas', 'Administración', 'Recursos Humanos', 'Finanzas'];
  sectores = ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Retail', 'Manufactura', 'Servicios'];
  nivelesProfesionales = ['Junior', 'Semi-senior', 'Senior', 'Lead', 'Principal'];
  departamentos = ['Ingeniería', 'Diseño', 'Marketing', 'Ventas', 'Administración', 'Recursos Humanos', 'Finanzas', 'Operaciones'];
  jornadasLaborales = ['Full-time', 'Part-time', 'Flexible', 'Por turnos'];
  formacionesMinimas = ['Universitario', 'Posgrado', 'Doctorado'];

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.jobForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Campos de la oferta
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      estado: ['Activa', Validators.required],
      area: ['', Validators.required],
      localizacion: ['', Validators.required],
      pais: ['Argentina', Validators.required],
      idioma: ['Español', Validators.required],
      requisitos_minimos: ['', [Validators.required, Validators.minLength(10)]],
      salario_desde: [0, [Validators.required, Validators.min(0)]],
      salario_hasta: [0, [Validators.required, Validators.min(0)]],
      salario_modalidad: ['Mensual', Validators.required],
      salario_moneda: ['USD', Validators.required],
      salario_mostrar: [1, Validators.required],

      // Campos de la especificación
      numero_vacantes: [1, [Validators.required, Validators.min(1)]],
      personal_a_cargo: [0, [Validators.required, Validators.min(0)]],
      tipo_contrato: ['Tiempo completo', Validators.required],
      modalidad_trabajo: ['Remoto', Validators.required],
      categoria: ['Desarrollo', Validators.required],
      subcategoria: ['', Validators.required],
      sector: ['Tecnología', Validators.required],
      nivel_profesional: ['Junior', Validators.required],
      departamento: ['Ingeniería', Validators.required],
      experiencia_minima: ['', Validators.required],
      jornada_laboral: ['Full-time', Validators.required],
      formacion_minima: ['Universitario', Validators.required]
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';

      // Crear oferta primero
      const ofertaData: CreateOfertaRequest = {
        titulo: this.jobForm.value.titulo,
        descripcion: this.jobForm.value.descripcion,
        estado: this.jobForm.value.estado,
        area: this.jobForm.value.area,
        localizacion: this.jobForm.value.localizacion,
        pais: this.jobForm.value.pais,
        idioma: this.jobForm.value.idioma,
        requisitos_minimos: this.jobForm.value.requisitos_minimos,
        salario_desde: this.jobForm.value.salario_desde,
        salario_hasta: this.jobForm.value.salario_hasta,
        salario_modalidad: this.jobForm.value.salario_modalidad,
        salario_moneda: this.jobForm.value.salario_moneda,
        salario_mostrar: this.jobForm.value.salario_mostrar,
        solicitud_id: 1 //hardcodeado
      };

      console.log('📤 Enviando oferta:', ofertaData);

      this.jobService.createOferta(ofertaData).subscribe({
        next: (ofertaCreada) => {
          console.log('✅ Oferta creada:', ofertaCreada);

          // Ahora crear la especificación con el ID de la oferta
          const especificacionData: CreateEspecificacionRequest = {
            oferta_id: ofertaCreada.ID,
            numero_vacantes: this.jobForm.value.numero_vacantes,
            personal_a_cargo: this.jobForm.value.personal_a_cargo,
            tipo_contrato: this.jobForm.value.tipo_contrato,
            modalidad_trabajo: this.jobForm.value.modalidad_trabajo,
            categoria: this.jobForm.value.categoria,
            subcategoria: this.jobForm.value.subcategoria,
            sector: this.jobForm.value.sector,
            nivel_profesional: this.jobForm.value.nivel_profesional,
            departamento: this.jobForm.value.departamento,
            experiencia_minima: this.jobForm.value.experiencia_minima,
            jornada_laboral: this.jobForm.value.jornada_laboral,
            formacion_minima: this.jobForm.value.formacion_minima
          };

          console.log('📤 Enviando especificación:', especificacionData);

          this.jobService.createEspecificacion(especificacionData).subscribe({
            next: () => {
              console.log('✅ Especificación creada exitosamente');
              this.isSubmitting = false;
              this.onSuccess.emit(); // Emitir evento de éxito
            },
            error: (error) => {
              console.error('Error al crear especificación:', error);
              this.isSubmitting = false;
              this.submitError = 'Error al crear la especificación: ' + (error.message || error.error?.message || 'Error desconocido');
            }
          });
        },
        error: (error) => {
          console.error('Error al crear oferta:', error);
          this.isSubmitting = false;
          this.submitError = 'Error al crear la oferta: ' + (error.message || error.error?.message || 'Error desconocido');
        }
      });
    } else {
      console.log('Formulario inválido:', this.jobForm.errors);
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.jobForm.controls).forEach(key => {
      const control = this.jobForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel() {
    this.onCancel.emit(); // Emitir evento de cancelación
  }

  // Validación personalizada para salario hasta > desde
  validateSalarioHasta() {
    const desde = this.jobForm.get('salario_desde')?.value;
    const hasta = this.jobForm.get('salario_hasta')?.value;

    if (desde && hasta && hasta <= desde) {
      this.jobForm.get('salario_hasta')?.setErrors({ invalidRange: true });
    } else {
      const errors = this.jobForm.get('salario_hasta')?.errors;
      if (errors) {
        delete errors['invalidRange'];
        this.jobForm.get('salario_hasta')?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
}
