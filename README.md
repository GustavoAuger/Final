# Sistema de Gestión de Personas por Área

Aplicación full-stack para el registro de personas y gestión de áreas de trabajo con visualización de estadísticas.

## 🏗️ Arquitectura

```
┌──────────────┐    HTTP/REST    ┌──────────────┐
│   Frontend   │ ◄─────────────► │   Backend    │
│   Angular    │   Port 4200     │  Monolito Go │
│   15+        │                 │   Gin + GORM │
└──────────────┘                 └───────┬──────┘
                                    Port 3000
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │ PostgreSQL  │
                                  │   app_db    │
                                  └─────────────┘
                                    Port 5432
```

## 🎯 Funcionalidades

### 📝 Registro de Personas
- Formulario con validaciones en tiempo real
- Campos: Nombre, Email (único), Área de trabajo
- Selector de área dinámico desde la API
- Mensajes de éxito/error al usuario

### 📊 Dashboard de Estadísticas
- Tabla con áreas y cantidad de personas
- Visualización gráfica de distribución
- Actualización en tiempo real

### 🏢 Gestión de Áreas
- CRUD completo de áreas
- 6 áreas precargadas: Ventas, RRHH, Tecnología, Marketing, Finanzas, Operaciones

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ y npm (para frontend)
- Go 1.22+ (opcional, para desarrollo local)

### 1. Levantar Backend y Base de Datos

```bash
# Desde la raíz del proyecto
docker compose up --build
```

✅ Backend disponible en: **http://localhost:3000**  
✅ Base de datos con 6 áreas y 30 personas de prueba

### 2. Levantar Frontend (en otra terminal)

```bash
cd frontend
npm install
npm start
```

✅ Frontend disponible en: **http://localhost:4200**

## 📡 API Endpoints

**Base URL:** `http://localhost:3000/api/v1`

### Áreas
```
GET    /areas           # Listar todas las áreas
GET    /areas/:id       # Obtener área por ID
GET    /areas/conteo    # Áreas con conteo de personas
POST   /areas           # Crear área
PUT    /areas/:id       # Actualizar área
DELETE /areas/:id       # Eliminar área
```

### Personas
```
GET    /personas              # Listar todas
GET    /personas/:id          # Obtener por ID
GET    /personas/email/:email # Buscar por email
POST   /personas              # Crear persona
PUT    /personas/:id          # Actualizar persona
DELETE /personas/:id          # Eliminar persona
```

### Health Check
```
GET /health   # Estado del servicio
```

## 📝 Ejemplos de Uso

### Listar áreas
```bash
curl http://localhost:3000/api/v1/areas
```

### Crear persona
```bash
curl -X POST http://localhost:3000/api/v1/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "area_id": 1
  }'
```

### Obtener conteo por área
```bash
curl http://localhost:3000/api/v1/areas/conteo
```

Respuesta:
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Ventas",
      "cantidad_personas": 5
    },
    ...
  ]
}
```

## 📂 Estructura del Proyecto

```
.
├── backend/                    # Backend Go
│   ├── cmd/server/            # Punto de entrada (main.go)
│   ├── internal/
│   │   ├── handler/           # Controladores HTTP
│   │   ├── service/           # Lógica de negocio
│   │   ├── repository/        # Acceso a datos
│   │   └── model/             # Modelos (Area, Persona)
│   ├── scripts/
│   │   └── init_db.sql        # Script SQL con datos iniciales
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
│
├── frontend/                   # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/         # Páginas (registro, dashboard)
│   │   │   ├── services/      # Servicios HTTP
│   │   │   └── shared/        # Componentes compartidos
│   │   └── assets/
│   ├── angular.json
│   └── package.json
│
├── docker-compose.yml         # Orquestación Docker
├── .gitignore
└── README.md
```

## 🔧 Tecnologías

### Backend
- **Go 1.22** - Lenguaje de programación
- **Gin** - Framework web HTTP
- **GORM** - ORM para Go
- **PostgreSQL 15** - Base de datos

### Frontend
- **Angular 15+** - Framework frontend
- **TypeScript** - Lenguaje tipado
- **Tailwind CSS / Material / Bootstrap** - UI/UX
- **RxJS** - Programación reactiva

## 📊 Base de Datos

### Esquema

```sql
-- Tabla de áreas
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de personas
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    area_id INTEGER NOT NULL REFERENCES areas(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### Datos Iniciales

- **6 áreas**: Ventas, Recursos Humanos, Tecnología, Marketing, Finanzas, Operaciones
- **30 personas** distribuidas entre las áreas

### Acceso a la BD

```bash
# Conectar al contenedor PostgreSQL
docker exec -it app_db psql -U postgres -d app_db

# Consultas útiles
SELECT * FROM areas;
SELECT * FROM personas;

# Conteo por área
SELECT a.nombre, COUNT(p.id) as cantidad 
FROM areas a 
LEFT JOIN personas p ON a.id = p.area_id 
GROUP BY a.nombre;
```

## 🐳 Docker

### Comandos Útiles

```bash
# Levantar servicios
docker compose up -d

# Ver logs
docker compose logs -f backend
docker compose logs -f app_db

# Reconstruir
docker compose up --build

# Detener servicios
docker compose down

# Limpiar volúmenes (elimina BD)
docker compose down -v
```

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| DB_HOST | Host PostgreSQL | db |
| DB_PORT | Puerto PostgreSQL | 5432 |
| DB_USER | Usuario PostgreSQL | postgres |
| DB_PASSWORD | Password PostgreSQL | postgres |
| DB_NAME | Nombre de la BD | app_db |
| PORT | Puerto del backend | 3000 |

## 🎨 Buenas Prácticas

### Backend
✅ Arquitectura en capas (handler → service → repository)  
✅ Separación de responsabilidades  
✅ Validaciones en múltiples capas  
✅ Manejo de errores consistente  
✅ Foreign keys para integridad referencial  
✅ CORS configurado  

### Frontend
✅ Componentes modulares y reutilizables  
✅ Servicios para comunicación HTTP  
✅ Validaciones de formularios  
✅ Feedback visual al usuario  
✅ Diseño responsive  
✅ Accesibilidad (ARIA, navegación por teclado)  

## 🔒 Seguridad

- Email único (constraint de BD + validación backend)
- Foreign keys para integridad referencial
- Validación de entrada en backend y frontend
- CORS configurado (actualmente `*` para desarrollo)
- Variables de entorno para configuración sensible
- Sin credenciales en código fuente

## 🧪 Testing

### Backend
```bash
cd backend
go test ./...
```

### Frontend
```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### Error: Puerto 3000 en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 externamente
```

### Error: Base de datos no inicializa
```bash
# Limpiar volúmenes y reconstruir
docker compose down -v
docker compose up --build
```

### Frontend no conecta al backend
- Verificar que backend esté corriendo: `http://localhost:3000/api/v1/health`
- Revisar CORS en el backend
- Verificar URL del servicio en el frontend

## 📚 Recursos

- [Documentación Go](https://go.dev/doc/)
- [Gin Framework](https://gin-gonic.com/)
- [GORM](https://gorm.io/)
- [Angular](https://angular.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)

## 🚧 Roadmap

- [ ] Autenticación y autorización
- [ ] Paginación en listados
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de datos (CSV/Excel)
- [ ] Gráficos más avanzados
- [ ] Tests unitarios e integración
- [ ] CI/CD pipeline
- [ ] Dockerización del frontend

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Proyecto educativo - Sin licencia específica

---

**Autor:** Gustavo Auger  
**Versión:** 1.0.0  
**Fecha:** Diciembre 2025
