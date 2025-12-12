
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Especificacion {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  oferta_id: number;
  numero_vacantes: number;
  personal_a_cargo: number;
  tipo_contrato: string;
  modalidad_trabajo: string;
  categoria: string;
  subcategoria: string;
  sector: string;
  nivel_profesional: string;
  departamento: string;
  experiencia_minima: string;
  jornada_laboral: string;
  formacion_minima: string;
  oferta: Oferta;
}

export interface Oferta {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  area: string;
  descripcion: string;
  estado: string;
  idioma: string;
  localizacion: string;
  pais: string;
  requisitos_minimos: string;
  salario_desde: number;
  salario_hasta: number;
  salario_modalidad: string;
  salario_moneda: string;
  salario_mostrar: number;
  solicitud_id: number;
  titulo: string;
}

export interface DetalleOferta {
  oferta: Oferta;
}

export interface CreateOfertaRequest {
  titulo: string;
  descripcion: string;
  estado: string;
  area: string;
  localizacion: string;
  pais: string;
  idioma: string;
  requisitos_minimos: string;
  salario_desde: number;
  salario_hasta: number;
  salario_modalidad: string;
  salario_moneda: string;
  salario_mostrar: number;
  solicitud_id: number;
}

export interface CreateEspecificacionRequest {
  oferta_id: number;
  numero_vacantes: number;
  personal_a_cargo: number;
  tipo_contrato: string;
  modalidad_trabajo: string;
  categoria: string;
  subcategoria: string;
  sector: string;
  nivel_profesional: string;
  departamento: string;
  experiencia_minima: string;
  jornada_laboral: string;
  formacion_minima: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost/api/v1';  // Especificaciones service


  constructor(private http: HttpClient) {}

  getEspecificaciones(): Observable<Especificacion[]> {
    console.log('🚀 JobService - Obteniendo especificaciones');
    return this.http.get<Especificacion[]>(`${this.apiUrl}/especificaciones`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDetalleOferta(id: number): Observable<DetalleOferta> {
    console.log('🚀 JobService - Obteniendo detalle de oferta:', id);
    return this.http.get<DetalleOferta>(`${this.apiUrl}/especificaciones/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEspecificacion(id: number): Observable<any> {
    console.log('🚀 JobService - Eliminando especificación:', id);
    return this.http.delete(`${this.apiUrl}/especificaciones/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createOferta(oferta: CreateOfertaRequest): Observable<Oferta> {
    console.log('🚀 JobService - Creando oferta:', oferta);
    return this.http.post<Oferta>(`${this.apiUrl}/ofertas`, oferta)
      .pipe(
        catchError(this.handleError)
      );
  }

  createEspecificacion(especificacion: CreateEspecificacionRequest): Observable<Especificacion> {
    console.log('🚀 JobService - Creando especificación:', especificacion);
    return this.http.post<Especificacion>(`${this.apiUrl}/especificaciones`, especificacion)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(' JobService - Error HTTP:', error);

    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || error.message || `Código de error: ${error.status}`;
    }

    console.error('📝 JobService - Error details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}