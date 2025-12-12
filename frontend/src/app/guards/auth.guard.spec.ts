import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'parseUrl']);
    routerSpy.parseUrl.and.callFake((url: string) => {
      return { toString: () => url } as UrlTree;
    });
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    
    // Mock de ActivatedRouteSnapshot y RouterStateSnapshot
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/registro' } as RouterStateSnapshot;
  });

  it('debe ser creado', () => {
    expect(authGuard).toBeTruthy();
  });

  it('debe permitir acceso si el usuario está autenticado', () => {
    // Arrange
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    
    // Act
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    
    // Assert
    expect(result).toBe(true);
    expect(authService.isAuthenticated).toHaveBeenCalled();
  });

  it('debe redirigir a login si el usuario NO está autenticado', () => {
    // Arrange
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    
    // Act
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    
    // Assert
    expect(result).toBeTruthy();
    expect(result.toString()).toContain('/login');
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });

  it('debe bloquear acceso a rutas protegidas sin autenticación', () => {
    // Arrange
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    const protectedState = { url: '/registro' } as RouterStateSnapshot;
    
    // Act
    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, protectedState)
    );
    
    // Assert
    expect(result).toBeTruthy();
    expect(result.toString()).toContain('/login');
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });

  it('debe verificar autenticación en cada intento de acceso', () => {
    // Arrange
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    
    // Act - Primera verificación
    let result1 = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    
    // Act - Segunda verificación
    let result2 = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    
    // Assert
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(authService.isAuthenticated).toHaveBeenCalledTimes(2);
  });

  it('debe cambiar comportamiento cuando cambia el estado de autenticación', () => {
    // Arrange
    const authSpy = spyOn(authService, 'isAuthenticated');
    
    // Act & Assert - Primera vez autenticado
    authSpy.and.returnValue(true);
    let result1 = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    expect(result1).toBe(true);
    
    // Act & Assert - Segunda vez NO autenticado
    authSpy.and.returnValue(false);
    let result2 = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    expect(result2).toBeTruthy();
    expect(result2.toString()).toContain('/login');
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });
});
