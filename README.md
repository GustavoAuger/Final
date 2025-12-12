# Sistema de Gestión de Personas por Área

Aplicación full-stack para el registro de personas y gestión de áreas de trabajo con visualización de estadísticas en tiempo real.

## 🏗️ Arquitectura del Sistema

```
┌──────────────────┐    HTTP/REST     ┌────────────────────┐
│    Frontend      │ ◄──────────────► │     Backend        │
│  Angular 20.3    │   Port 4200      │   Go 1.22 + Gin    │
│  + Chart.js      │                  │   + GORM           │
└──────────────────┘                  └─────────┬──────────┘
                                           Port 3000
                                                │
                                                ▼
                                       ┌──────────────┐
                                       │  PostgreSQL  │
                                       │    app_db    │
                                       └──────────────┘
                                          Port 5432
```

## 🎯 Funcionalidades Principales

### Backend (Go + Gin + GORM)
- ✅ **CRUD completo de Áreas**: Gestión de áreas de trabajo
- ✅ **CRUD completo de Personas**: Registro y gestión de personas
- ✅ **Endpoint de estadísticas**: Conteo de personas por área para gráficos
- ✅ **Validaciones**: Email único, validación de campos requeridos
- ✅ **Arquitectura limpia**: Handler → Service → Repository
- ✅ **Tests unitarios**: 15 tests unitarios con mocks completos

### Frontend (Angular 20.3)
- ✅ **Formulario de Registro**: Validación en tiempo real, selector dinámico de áreas
- ✅ **Dashboard de Estadísticas**: Gráfico de barras con Chart.js y tabla detallada
- ✅ **Autenticación básica**: Sistema de login con guards de rutas
- ✅ **UI Moderna**: Tailwind CSS + DaisyUI, diseño responsive
- ✅ **Tests unitarios**: 26 tests unitarios con Jasmine/Karma

## 🚀 Inicio Rápido

### Prerrequisitos
- **Docker** y **Docker Compose** instalados
- Puertos libres: **3000** (backend), **4200** (frontend), **5432** (PostgreSQL)

### Levantar Todo el Stack (Recomendado)

```bash
# Desde la raíz del proyecto
docker compose up --build
```

Esto iniciará automáticamente:
- ✅ **Base de datos PostgreSQL** con 6 áreas y 30 personas precargadas
- ✅ **Backend API** en: **http://localhost:3000**
- ✅ **Frontend web** en: **http://localhost:4200**

### Desarrollo Local (Alternativa)

**Levantar solo la base de datos:**
```bash
docker compose up db -d
```

**Ejecutar backend localmente:**
```bash
cd backend
go run cmd/server/main.go
```

**Ejecutar frontend localmente:**
```bash
cd frontend
npm install
npm start
```

---

## 📡 Backend - API REST

### Base URL
```
http://localhost:3000/api/v1
```

### 🔑 Endpoints Principales (Los 3 Más Importantes)

#### 1. **GET /api/v1/areas** - Selector de Áreas para Registro
Obtiene todas las áreas disponibles para el formulario de registro de personas.

**Request:**
```bash
curl http://localhost:3000/api/v1/areas
```

**Response:**
```json
{
  "data": [
    {
      "ID": 1,
      "CreatedAt": "2025-12-12T00:00:00Z",
      "UpdatedAt": "2025-12-12T00:00:00Z",
      "DeletedAt": null,
      "nombre": "Ventas",
      "descripcion": "Área de ventas y comercial"
    },
    {
      "ID": 2,
      "nombre": "Recursos Humanos",
      "descripcion": "Gestión de personal"
    }
  ]
}
```

#### 2. **POST /api/v1/personas** - Crear Persona
Registra una nueva persona asociada a un área.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "area_id": 1
  }'
```

**Response (Éxito 201):**
```json
{
  "message": "Persona registrada exitosamente",
  "data": {
    "ID": 31,
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "area_id": 1
  }
}
```

**Response (Error 400 - Email duplicado):**
```json
{
  "error": "Error al registrar la persona",
  "details": "el correo electrónico ya está registrado"
}
```

#### 3. **GET /api/v1/areas/conteo** - Estadísticas para Gráficos
Obtiene todas las áreas con el conteo de personas asociadas para visualizar en el dashboard.

**Request:**
```bash
curl http://localhost:3000/api/v1/areas/conteo
```

**Response:**
```json
{
  "data": [
    {
      "ID": 1,
      "nombre": "Ventas",
      "descripcion": "Área de ventas y comercial",
      "personas": 8
    },
    {
      "ID": 2,
      "nombre": "Recursos Humanos",
      "descripcion": "Gestión de personal",
      "personas": 5
    },
    {
      "ID": 3,
      "nombre": "Tecnología",
      "descripcion": "Área de desarrollo y TI",
      "personas": 12
    }
  ]
}
```

---

### 📋 Endpoints Completos (Referencia para Futuras Actualizaciones)

#### Áreas
| Método | Endpoint | Descripción | Request Body |
|--------|----------|-------------|--------------|
| GET | `/areas` | Listar todas las áreas | - |
| GET | `/areas/:id` | Obtener área por ID | - |
| GET | `/areas/conteo` | Áreas con conteo de personas | - |
| POST | `/areas` | Crear nueva área | `{"nombre": "...", "descripcion": "..."}` |
| PUT | `/areas/:id` | Actualizar área | `{"nombre": "...", "descripcion": "..."}` |
| DELETE | `/areas/:id` | Eliminar área | - |

#### Personas
| Método | Endpoint | Descripción | Request Body |
|--------|----------|-------------|--------------|
| GET | `/personas` | Listar todas las personas | - |
| GET | `/personas/:id` | Obtener persona por ID | - |
| GET | `/personas/email/:email` | Buscar persona por email | - |
| POST | `/personas` | Crear nueva persona | `{"nombre": "...", "email": "...", "area_id": 1}` |
| PUT | `/personas/:id` | Actualizar persona | `{"nombre": "...", "email": "...", "area_id": 1}` |
| DELETE | `/personas/:id` | Eliminar persona | - |

#### Health Check
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servicio |

---

## 🎨 Frontend - Aplicación Angular

### Páginas Disponibles
- **`/login`** - Página de inicio de sesión
- **`/`** - Home (requiere autenticación)
- **`/registro`** - Formulario de registro de personas
- **`/resultados`** - Dashboard con gráficos y estadísticas
- **`/acerca`** - Información del proyecto

### Características
- **Validación en tiempo real**: Mensajes descriptivos de error en cada campo
- **Selector dinámico**: Carga de áreas desde el backend
- **Gráfico de barras**: Visualización con Chart.js de distribución de personas
- **Diseño responsive**: Compatible con móviles, tablets y desktop
- **Guards de autenticación**: Protección de rutas privadas

---

## 🧪 Testing

### Backend - Tests Unitarios (Go)

**Ejecutar todos los tests:**
```bash
cd backend
go test ./internal/service/... ./internal/handler/... -v
# Con cobertura de código
go test ./internal/service/... ./internal/handler/... -cover
```

**Resultado esperado:**
```
=== RUN   TestGetAllAreas
--- PASS: TestGetAllAreas
=== RUN   TestGetAreasConConteo
--- PASS: TestGetAreasConConteo
...
ok      backend/internal/service        0.463s
ok      backend/internal/handler        0.633s
TOTAL: 15 SUCCESS
```

**Tests creados (15 tests):**
- ✅ `area_service_test.go` - 3 tests (GetAll, Error handling, GetAreasConConteo)
- ✅ `persona_service_test.go` - 5 tests (GetAll, Create, Email duplicado, Errores, Lista vacía)
- ✅ `handler_test.go` - 7 tests HTTP (GET áreas, conteo, GET personas, POST personas, validaciones)

**Nota:** Aunque el requisito mínimo era **3 tests unitarios**, se implementaron **15 tests** para garantizar mayor cobertura y robustez del código, abarcando servicios y handlers con mocks completos.

### Frontend - Tests Unitarios (Angular + Jasmine/Karma)

**Ejecutar tests (PowerShell con permisos):**
```powershell
cd frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm test -- --watch=false --browsers=ChromeHeadless
```

**Ejecutar tests (WSL/Bash):**
```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

**Resultado esperado:**
```
Chrome Headless 142.0.0.0 (Windows 10): Executed 26 of 26 SUCCESS
TOTAL: 26 SUCCESS
```

**Tests creados (26 tests):**
- ✅ `auth.service.spec.ts` - 8 tests (Login, Logout, Autenticación, LocalStorage)
- ✅ `api.service.spec.ts` - 14 tests (GET áreas, GET conteo, POST personas, validaciones HTTP)
- ✅ `auth.guard.spec.ts` - 6 tests (Protección de rutas, Redirecciones)
- ✅ `app.spec.ts` - 2 tests (Creación app, Router outlet)

**Nota:** Aunque el requisito mínimo era **3 tests unitarios**, se implementaron **26 tests** para cubrir servicios, guards y componentes principales, garantizando la calidad del código frontend.

---

## 📊 Base de Datos

### Esquema

```sql
-- Tabla de áreas
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de personas
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    area_id INTEGER NOT NULL REFERENCES areas(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### Datos Iniciales Precargados

**6 Áreas:**
1. Ventas - Área de ventas y comercial
2. Recursos Humanos - Gestión de personal
3. Tecnología - Área de desarrollo y TI
4. Marketing - Estrategia y comunicación
5. Finanzas - Gestión financiera y contabilidad
6. Operaciones - Logística y operaciones

**30 Personas** distribuidas entre las 6 áreas (5 personas por área)

### Acceso Directo a PostgreSQL

```bash
# Conectar al contenedor PostgreSQL
docker exec -it app_db psql -U postgres -d app_db

# Consultas útiles
SELECT * FROM areas;
SELECT * FROM personas;
SELECT COUNT(*) FROM personas;

# Consulta de conteo por área (igual que el endpoint)
SELECT a.id, a.nombre, a.descripcion, COUNT(p.id) as personas
FROM areas a
LEFT JOIN personas p ON a.id = p.area_id
GROUP BY a.id, a.nombre, a.descripcion
ORDER BY a.id;
```

---

## 📂 Estructura del Proyecto

```
.
├── backend/                        # Backend Monolítico en Go
│   ├── cmd/
│   │   └── server/
│   │       └── main.go            # Punto de entrada principal
│   ├── internal/
│   │   ├── handler/               # Controladores HTTP (Gin handlers)
│   │   │   ├── area_handler.go
│   │   │   ├── persona_handler.go
│   │   │   └── handler_test.go    # 🧪 Tests de handlers
│   │   ├── service/               # Lógica de negocio
│   │   │   ├── area_service.go
│   │   │   ├── area_service_test.go      # 🧪 Tests de area service
│   │   │   ├── persona_service.go
│   │   │   └── persona_service_test.go   # 🧪 Tests de persona service
│   │   ├── repository/            # Acceso a datos (GORM)
│   │   │   ├── area_repository.go
│   │   │   └── persona_repository.go
│   │   ├── model/                 # Modelos de dominio
│   │   │   ├── area.go
│   │   │   └── persona.go
│   ├── scripts/
│   │   └── init_db.sql            # Script SQL con datos iniciales
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
│
├── frontend/                       # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── login/         # Página de login
│   │   │   │   ├── home/          # Página principal
│   │   │   │   ├── registro/      # 📝 Formulario de registro
│   │   │   │   ├── resultados/    # 📊 Dashboard con gráficos
│   │   │   │   └── about/         # Información del proyecto
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.service.spec.ts     # 🧪 Tests auth service
│   │   │   │   └── api.service.spec.ts      # 🧪 Tests API HTTP
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── auth.guard.spec.ts       # 🧪 Tests auth guard
│   │   │   ├── shared/            # Componentes compartidos
│   │   │   │   └── components/
│   │   │   │       ├── header/
│   │   │   │       ├── footer/
│   │   │   │       └── animated-background/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── app.ts
│   │   │   └── app.spec.ts        # 🧪 Tests app component
│   │   ├── assets/                # Recursos estáticos
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml             # Orquestación completa (DB + Backend + Frontend)
├── .gitignore
└── README.md                      # Este archivo
```

---

## 🐳 Docker y Despliegue

### Comandos Útiles

```bash
# Levantar todo el stack (backend, frontend, DB)
docker compose up --build

# Levantar en modo detached (background)
docker compose up -d

# Ver logs en tiempo real de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Reconstruir solo un servicio
docker compose up --build backend
docker compose up --build frontend

# Detener todos los servicios
docker compose down

# Limpiar volúmenes (elimina BD - se reinician los datos)
docker compose down -v

# Ver estado de los servicios
docker compose ps
```

### Servicios Dockerizados

| Servicio | Puerto Host | Puerto Container | URL de Acceso |
|----------|-------------|------------------|---------------|
| Frontend | 4200 | 80 | http://localhost:4200 |
| Backend | 3000 | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | 5432 | localhost:5432 |

### Variables de Entorno (Backend)

Definidas en `docker-compose.yml`:

| Variable | Descripción | Default |
|----------|-------------|---------|
| DB_HOST | Host de PostgreSQL | db |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_USER | Usuario de PostgreSQL | postgres |
| DB_PASSWORD | Contraseña de PostgreSQL | postgres |
| DB_NAME | Nombre de la base de datos | app_db |
| PORT | Puerto del servidor backend | 3000 |

---

## 🔧 Stack Tecnológico

### Backend
- **Lenguaje:** Go 1.22+
- **Framework Web:** Gin (HTTP router y middleware)
- **ORM:** GORM v2 (PostgreSQL driver)
- **Base de Datos:** PostgreSQL 15
- **Testing:** Go testing con mocks personalizados

### Frontend
- **Framework:** Angular 20.3 (standalone components)
- **Lenguaje:** TypeScript 5.9
- **UI Framework:** Tailwind CSS 4.1 + DaisyUI 5.3
- **Gráficos:** Chart.js 4.5 + ng2-charts 8.0
- **HTTP Client:** Angular HttpClient
- **Testing:** Jasmine 5.9 + Karma 6.4

### Infraestructura
- **Contenedores:** Docker + Docker Compose
- **Proxy Reverso:** Nginx (frontend)
- **Control de Versiones:** Git

---

## 🔒 Validaciones y Seguridad

### Backend
✅ Email único (constraint de BD + validación en service)  
✅ Validación de campos requeridos (GORM binding)  
✅ Foreign keys para integridad referencial  
✅ Manejo de errores consistente en todas las capas  
✅ CORS configurado (actualmente `*` para desarrollo)  
✅ Soft deletes con GORM (DeletedAt)  

### Frontend
✅ Validación de formularios en tiempo real  
✅ Mensajes de error descriptivos por campo  
✅ Email con formato válido (regex)  
✅ Campos requeridos  
✅ Guards de autenticación en rutas protegidas  
✅ Feedback visual de éxito/error al usuario  

---

## 🐛 Troubleshooting

### ❌ Error: Puerto 3000 ya en uso
```bash
# Opción 1: Detener el proceso que usa el puerto
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Opción 2: Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 externamente
```

### ❌ Base de datos no inicializa correctamente
```bash
# Limpiar volúmenes y reconstruir desde cero
docker compose down -v
docker compose up --build
```

### ❌ Frontend no conecta al backend
1. Verificar que backend esté corriendo: `http://localhost:3000/health`
2. Revisar configuración de CORS en `backend/cmd/server/main.go`
3. Verificar proxy en `frontend/proxy.conf.json`
4. Revisar logs: `docker compose logs -f backend`

---

## 📚 Recursos y Referencias

- [Documentación de Go](https://go.dev/doc/)
- [Gin Web Framework](https://gin-gonic.com/)
- [GORM ORM](https://gorm.io/)
- [Angular Documentation](https://angular.io/)
- [Chart.js](https://www.chartjs.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🚧 Mejoras Futuras

- [ ] Sistema de autenticación completo (JWT)
- [ ] Autorización por roles (admin, usuario)
- [ ] Paginación en listados de personas
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de datos (CSV/Excel/PDF)
- [ ] Gráficos adicionales (pie chart, line chart)
- [ ] Tests E2E con Cypress o Playwright
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoreo y logging centralizado
- [ ] Rate limiting en la API
- [ ] Validación de CORS más estricta para producción

---

## 👨‍💻 Desarrollo y Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request con descripción detallada

### Estándares de Código
- **Go:** Seguir [Effective Go](https://go.dev/doc/effective_go) y usar `gofmt`
- **TypeScript/Angular:** Seguir [Angular Style Guide](https://angular.io/guide/styleguide)
- **Commits:** Mensajes descriptivos en español o inglés
- **Tests:** Toda nueva funcionalidad debe incluir tests unitarios

---

## 📄 Licencia

Proyecto educativo desarrollado para fines académicos y de aprendizaje.

---

## 📧 Contacto

**Autor:** Gustavo Auger  
**Repositorio:** [GustavoAuger/Final](https://github.com/GustavoAuger/Final)  
**Versión:** 1.0.0  
**Fecha:** Diciembre 2025

---

## ✨ Agradecimientos

Este proyecto fue desarrollado como parte de un ejercicio práctico de desarrollo full-stack. Aunque el requisito mínimo era **3 tests unitarios por cada lado (backend y frontend)**, se decidió implementar **15 tests en el backend** y **26 tests en el frontend** para crear un proyecto más completo y profesional, demostrando mejores prácticas de desarrollo y asegurando la calidad del código.

**Total de Tests:** 41 tests unitarios ✅
