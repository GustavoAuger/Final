import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, Especificacion, DetalleOferta, CreateOfertaRequest } from '../../services/job.service';
import { AnimatedBackgroundComponent } from '../../shared/components/animated-background/animated-background.component';
import { CreateJobFormComponent } from './components/create-job-form/create-job-form.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, AnimatedBackgroundComponent, CreateJobFormComponent],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  especificaciones: Especificacion[] = [];
  selectedOferta: any = null;  // Usa any o ajusta según necesites
  loading = true;
  error = '';
  successMessage = ''; // Para mostrar mensaje de éxito de creación
  deleteConfirmMessage = ''; // Para modal de confirmación de eliminación
  selectedIdForDelete: number | null = null; // ID de la especificación a eliminar
  deleteSuccessMessage = ''; // Para mensaje de éxito de eliminación
  showForm = false; // Controla si mostrar el formulario o la lista

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadEspecificaciones();
  }

  loadEspecificaciones() {
    this.loading = true;
    this.jobService.getEspecificaciones().subscribe({
      next: (data: Especificacion[]) => {
        this.especificaciones = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar ofertas: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSelectEspecificacion(id: number) {
    console.log('ID seleccionado:', id);
    this.jobService.getDetalleOferta(id).subscribe({
      next: (data: DetalleOferta) => {
        this.selectedOferta = data.oferta;
      },
      error: (err: any) => {
        console.log('Error:', err);
      }
    });
  }

  onDeleteEspecificacion(id: number) {
    this.deleteConfirmMessage = '¿Estás seguro de que quieres eliminar esta especificación? Esta acción no se puede deshacer.';
    this.selectedIdForDelete = id;
  }

  confirmDelete() {
    if (this.selectedIdForDelete !== null) {
      this.jobService.deleteEspecificacion(this.selectedIdForDelete).subscribe({
        next: () => {
          // Si el detalle está abierto y es la especificación que se eliminó, cerrarlo
          if (this.selectedOferta && this.selectedOferta.ID === this.selectedIdForDelete) {
            this.selectedOferta = null;
          }
          // Recargar la lista inmediatamente después de eliminar
          this.loadEspecificaciones();
          // Mostrar mensaje de éxito
          this.deleteSuccessMessage = 'Especificación eliminada exitosamente';
          this.deleteConfirmMessage = ''; // Ocultar modal de confirmación
          this.selectedIdForDelete = null;
        },
        error: (err: any) => {
          this.error = 'Error al eliminar la especificación: ' + err.message;
          this.deleteConfirmMessage = ''; // Ocultar modal de confirmación
          this.selectedIdForDelete = null;
        }
      });
    }
  }

  cancelDelete() {
    this.deleteConfirmMessage = ''; // Ocultar modal de confirmación
    this.selectedIdForDelete = null;
  }

  closeDetalle() {
    this.selectedOferta = null;
  }

  showCreateForm() {
    this.showForm = true;
  }

  hideCreateForm() {
    this.showForm = false;
  }

  onFormSuccess() {
    // Recargar la lista inmediatamente después de crear
    this.loadEspecificaciones();
    // Mostrar mensaje de éxito y ocultar el formulario
    this.successMessage = 'Oferta creada exitosamente'; // Mostrar mensaje de éxito
    this.showForm = false;
  }

  closeDeleteSuccessMessage() {
    this.deleteSuccessMessage = '';
  }

  closeSuccessMessage() {
    this.successMessage = ''; // Ocultar mensaje de éxito sin recargar de nuevo
  }
}
