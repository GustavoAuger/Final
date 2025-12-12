import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let store: { [key: string]: string } = {};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    
    // Mock localStorage
    store = {};
    
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return store[key] || null;
      },
      setItem: (key: string, value: string): void => {
        store[key] = value;
      },
      removeItem: (key: string): void => {
        delete store[key];
      },
      clear: (): void => {
        store = {};
      }
    };
    
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe guardar el nombre de usuario al hacer login', () => {
    // Arrange
    const userName = 'testUser';
    
    // Act
    service.login(userName);
    
    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('userName', userName);
    expect(store['userName']).toBe(userName);
  });

  it('debe retornar true si el usuario está autenticado', () => {
    // Arrange
    store['userName'] = 'testUser';
    
    // Act
    const isAuth = service.isAuthenticated();
    
    // Assert
    expect(isAuth).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith('userName');
  });

  it('debe retornar false si el usuario NO está autenticado', () => {
    // Arrange - localStorage vacío
    
    // Act
    const isAuth = service.isAuthenticated();
    
    // Assert
    expect(isAuth).toBe(false);
  });

  it('debe obtener el nombre de usuario guardado', () => {
    // Arrange
    const userName = 'testUser';
    store['userName'] = userName;
    
    // Act
    const retrievedUserName = service.getUserName();
    
    // Assert
    expect(retrievedUserName).toBe(userName);
    expect(localStorage.getItem).toHaveBeenCalledWith('userName');
  });

  it('debe retornar null si no hay usuario guardado', () => {
    // Act
    const retrievedUserName = service.getUserName();
    
    // Assert
    expect(retrievedUserName).toBeNull();
  });

  it('debe eliminar el nombre de usuario al hacer logout', () => {
    // Arrange
    store['userName'] = 'testUser';
    
    // Act
    service.logout();
    
    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('userName');
    expect(store['userName']).toBeUndefined();
  });

  it('debe retornar false después de hacer logout', () => {
    // Arrange
    store['userName'] = 'testUser';
    
    // Act
    service.logout();
    const isAuth = service.isAuthenticated();
    
    // Assert
    expect(isAuth).toBe(false);
  });
});
