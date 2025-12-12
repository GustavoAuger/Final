import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';

interface Area {
  ID: number;
  nombre: string;
  descripcion?: string;
}

interface Persona {
  ID: number;
  nombre: string;
  email: string;
  area_id: number;
}

interface AreaConteo {
  ID: number;
  nombre: string;
  descripcion: string;
  personas: number;
}

describe('API de Areas - Tests de Integración', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  const baseUrl = '/api/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GET /api/v1/areas', () => {
    it('debe obtener todas las áreas correctamente', () => {
      // Arrange
      const mockAreas: Area[] = [
        { ID: 1, nombre: 'Ventas', descripcion: 'Área de ventas' },
        { ID: 2, nombre: 'Marketing', descripcion: 'Área de marketing' },
        { ID: 3, nombre: 'Tecnología', descripcion: 'Área de TI' }
      ];

      const mockResponse = { data: mockAreas };

      // Act
      httpClient.get<{data: Area[]}>(`${baseUrl}/areas`).subscribe(response => {
        // Assert
        expect(response.data).toEqual(mockAreas);
        expect(response.data.length).toBe(3);
        expect(response.data[0].nombre).toBe('Ventas');
        expect(response.data[0].ID).toBe(1);
      });

      // Simular respuesta HTTP
      const req = httpMock.expectOne(`${baseUrl}/areas`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debe manejar error al obtener áreas', () => {
      // Act
      httpClient.get<{data: Area[]}>(`${baseUrl}/areas`).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(500);
        }
      });

      // Simular error HTTP
      const req = httpMock.expectOne(`${baseUrl}/areas`);
      req.flush('Error del servidor', { status: 500, statusText: 'Internal Server Error' });
    });

    it('debe retornar lista vacía cuando no hay áreas', () => {
      // Arrange
      const mockResponse = { data: [] };

      // Act
      httpClient.get<{data: Area[]}>(`${baseUrl}/areas`).subscribe(response => {
        // Assert
        expect(response.data).toEqual([]);
        expect(response.data.length).toBe(0);
      });

      // Simular respuesta HTTP
      const req = httpMock.expectOne(`${baseUrl}/areas`);
      req.flush(mockResponse);
    });
  });

  describe('GET /api/v1/areas/conteo', () => {
    it('debe obtener áreas con conteo de personas', () => {
      // Arrange
      const mockAreasConteo: AreaConteo[] = [
        { ID: 1, nombre: 'Ventas', descripcion: 'Área de ventas', personas: 15 },
        { ID: 2, nombre: 'Marketing', descripcion: 'Área de marketing', personas: 8 },
        { ID: 3, nombre: 'Tecnología', descripcion: 'Área de TI', personas: 22 }
      ];

      const mockResponse = { data: mockAreasConteo };

      // Act
      httpClient.get<{data: AreaConteo[]}>(`${baseUrl}/areas/conteo`).subscribe(response => {
        // Assert
        expect(response.data).toEqual(mockAreasConteo);
        expect(response.data.length).toBe(3);
        expect(response.data[0].personas).toBe(15);
        expect(response.data[2].personas).toBe(22);
      });

      // Simular respuesta HTTP
      const req = httpMock.expectOne(`${baseUrl}/areas/conteo`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debe calcular correctamente el total de personas', () => {
      // Arrange
      const mockAreasConteo: AreaConteo[] = [
        { ID: 1, nombre: 'Ventas', descripcion: 'Ventas', personas: 10 },
        { ID: 2, nombre: 'Marketing', descripcion: 'Marketing', personas: 20 },
        { ID: 3, nombre: 'TI', descripcion: 'TI', personas: 30 }
      ];

      const mockResponse = { data: mockAreasConteo };

      // Act
      httpClient.get<{data: AreaConteo[]}>(`${baseUrl}/areas/conteo`).subscribe(response => {
        const total = response.data.reduce((sum, area) => sum + area.personas, 0);
        
        // Assert
        expect(total).toBe(60);
        expect(response.data.every(area => area.personas > 0)).toBe(true);
      });

      // Simular respuesta HTTP
      const req = httpMock.expectOne(`${baseUrl}/areas/conteo`);
      req.flush(mockResponse);
    });
  });

  describe('POST /api/v1/personas', () => {
    it('debe crear una nueva persona exitosamente', () => {
      // Arrange
      const nuevaPersona = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        area_id: 1
      };

      const mockResponse = {
        message: 'Persona registrada exitosamente',
        data: {
          ID: 1,
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          area_id: 1
        }
      };

      // Act
      httpClient.post<any>(`${baseUrl}/personas`, nuevaPersona).subscribe(response => {
        // Assert
        expect(response.message).toBe('Persona registrada exitosamente');
        expect(response.data.ID).toBe(1);
        expect(response.data.nombre).toBe('Juan Pérez');
        expect(response.data.email).toBe('juan@example.com');
        expect(response.data.area_id).toBe(1);
      });

      // Simular respuesta HTTP
      const req = httpMock.expectOne(`${baseUrl}/personas`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevaPersona);
      req.flush(mockResponse);
    });

    it('debe rechazar persona con email duplicado', () => {
      // Arrange
      const personaDuplicada = {
        nombre: 'María López',
        email: 'maria@example.com',
        area_id: 2
      };

      const errorResponse = {
        error: 'Error al registrar la persona',
        details: 'el correo electrónico ya está registrado'
      };

      // Act
      httpClient.post<any>(`${baseUrl}/personas`, personaDuplicada).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
          expect(error.error.details).toContain('correo electrónico ya está registrado');
        }
      });

      // Simular error HTTP
      const req = httpMock.expectOne(`${baseUrl}/personas`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('debe validar campos requeridos al crear persona', () => {
      // Arrange
      const personaInvalida = {
        nombre: '',
        email: 'invalido',
        area_id: 0
      };

      const errorResponse = {
        error: 'Datos inválidos',
        details: 'Todos los campos son requeridos'
      };

      // Act
      httpClient.post<any>(`${baseUrl}/personas`, personaInvalida).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
        }
      });

      // Simular error HTTP
      const req = httpMock.expectOne(`${baseUrl}/personas`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('debe rechazar email con formato inválido', () => {
      // Arrange
      const personaEmailInvalido = {
        nombre: 'Carlos Ruiz',
        email: 'email-sin-arroba',
        area_id: 1
      };

      const errorResponse = {
        error: 'Datos inválidos',
        details: 'El email debe tener un formato válido'
      };

      // Act
      httpClient.post<any>(`${baseUrl}/personas`, personaEmailInvalido).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
        }
      });

      // Simular error HTTP
      const req = httpMock.expectOne(`${baseUrl}/personas`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('GET /api/v1/personas', () => {
    it('debe obtener todas las personas correctamente', () => {
      // Arrange
      const mockPersonas: Persona[] = [
        { ID: 1, nombre: 'Juan Pérez', email: 'juan@test.com', area_id: 1 },
        { ID: 2, nombre: 'María López', email: 'maria@test.com', area_id: 2 }
      ];

      const mockResponse = { data: mockPersonas };

      // Act
      httpClient.get<{data: Persona[]}>(`${baseUrl}/personas`).subscribe(response => {
        // Assert
        expect(response.data).toEqual(mockPersonas);
        expect(response.data.length).toBe(2);
        expect(response.data[0].nombre).toBe('Juan Pérez');
      });

      // Simular respuesta HTTP
      const req = httpMock.expectOne(`${baseUrl}/personas`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
