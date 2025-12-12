# Proyecto Eureka - Plataforma de Gestión de Ofertas de Trabajo

## Descripción
Proyecto desarrollado durante el programa Eureka, enfocado en la aplicación de habilidades en desarrollo full-stack. Esta plataforma permite gestionar ofertas de trabajo y especificaciones mediante una arquitectura de microservicios, con un frontend moderno en Angular y un backend robusto en Go. Incluye funcionalidades como un roadmap interactivo con animaciones, protección de rutas y almacenamiento local.

## Estructura del Proyecto

```
semana4/
├── src/
│   ├── app/
│   │   ├── pages/  # Páginas principales (e.g., home, aplicación)
│   │   ├── shared/  # Componentes compartidos (header, footer)
│   │   ├── services/  # Servicios (e.g., job.service.ts para APIs)
│   │   ├── guards/  # Guards para protección de rutas
│   │   └── components/  # Otros componentes reutilizables
│   ├── assets/  # Archivos estáticos (imágenes, íconos)
│   ├── styles.css  # Estilos globales (Tailwind CSS)
│   └── index.html  # Punto de entrada HTML
├── node_modules/  # Dependencias de npm
├── .gitignore  # Archivos a ignorar en Git (e.g., node_modules/, dist/)
├── angular.json  # Configuración de Angular CLI
├── package.json  # Dependencias y scripts
├── package-lock.json  # Lockfile de versiones de npm
├── tsconfig.json  # Configuración de TypeScript
├── tsconfig.app.json  # Configuración de TypeScript para la app
├── tsconfig.spec.json  # Configuración de TypeScript para tests
├── tailwind.config.js  # Configuración de Tailwind CSS
├── .postcssrc.json  # Configuración de PostCSS para Tailwind
├── Dockerfile  # Para containerizar la app
├── docker-compose.yml  # Para orquestación con backend
├── nginx.conf  # Configuración de Nginx para servir la app
├── README.md  # Este archivo
├── dist/  # Archivos compilados para producción (si ejecutes `npm run build` manualmente)
└── .editorconfig  # Configuración para editores de código

```

**Nota**: La carpeta `dist/` NO se genera en la máquina local por defecto (a menos que ejecutes `npm run build` manualmente). Solo existe dentro del contenedor Docker durante la build de la imagen, cuando se ejecuta `npm run build` en la etapa de Node.js. Contiene los archivos compilados de Angular listos para servir en producción vía Nginx. Puedes generarla localmente con `npm run build` para desplegar la app en servidores web estáticos (e.g., Netlify, Vercel) sin necesidad de Docker.

## Tecnologías Utilizadas
- **TypeScript**: Lenguaje de programación para mayor seguridad y mantenibilidad.
- **Tailwind CSS**: Framework de estilos para un diseño responsivo y moderno.
- **SVG Pixel Art**: Diseño personalizado del "autito" en el roadmap, creado con elementos gráficos vectoriales para animaciones fluidas.
- **Angular Guards**: Protección de rutas para autenticación y autorización de usuarios.
- **Local Storage**: Almacenamiento local de datos del usuario (e.g., tokens de sesión).
- **RxJS**: Manejo de observables para llamadas asíncronas y estado reactivo.
- **Docker**: Containerización para despliegue fácil y consistente.

### Backend (Microservicios en Go)
- **Go (Golang)**: Lenguaje para los microservicios, optimizado para rendimiento y concurrencia.
- **PostgreSQL**: Bases de datos relacionales para almacenamiento de ofertas y especificaciones.
- **Consul**: Servicio de descubrimiento de servicios (service discovery) para registro y descubrimiento de microservicios.
- **Traefik**: API Gateway y proxy inverso para enrutamiento, balanceo de carga y manejo de CORS.
- **Docker Compose**: Orquestación de contenedores para levantar todos los servicios con un solo comando.
- **Detalle completo**: Ver [Repositorio Semana 2](https://github.com/GustavoAuger/semana2).

### Frontend (Servicio Separado)
- **Aplicación Angular**: Se ejecuta en un contenedor separado, sirviendo en `http://localhost:4200`.
- **Conexión con Backend**: Usa HTTPClient para consumir APIs de Traefik (e.g., `http://localhost/api/v1/especificaciones`).
- **Nginx en Frontend**: Sirve los archivos estáticos de Angular para producción, manejando rutas SPA con `try_files`.

### Flujo de Comunicación
- **Frontend** → **Traefik (Puerto 80)** → **Microservicios (Puertos internos 8081/8082)** → **PostgreSQL (Puertos 5432/5433)**.
- **Service Discovery**: Consul registra servicios, Traefik los enruta automáticamente.
- **Backend en Detalle**: Los microservicios están desarrollados en Go y su implementación completa se encuentra en el [Repositorio Semana 2](https://github.com/GustavoAuger/semana2), incluyendo configuración de Docker Compose, conexiones a DB y registro en Consul.

## Instalación y Ejecución

### Prerrequisitos
- **Docker y Docker Compose**: Instalados y corriendo. Descárgalos desde [docker.com](https://www.docker.com/products/docker-desktop).
- **Sistema Operativo**: Windows, macOS o Linux con soporte para Docker.

### Pasos para Levantar la Aplicación
1. **Clona el Repositorio Frontend**:
   ```bash
   git clone https://github.com/GustavoAuger/semana4.git
   ```
   
2. **Clona el Repositorio Backend**:
   ```bash
   git clone https://github.com/GustavoAuger/semana2.git
   ```

3. **Levanta los Servicios del Backend**:
   ```bash
   cd semana2  # Carpeta del backend
   docker-compose up -d --build
   ```
   - Esto levanta los 6 servicios: 2 DBs, 2 microservicios, Consul y Traefik.
   - Accede a:
     - Traefik Dashboard: `http://localhost:8080`.
     - Consul UI: `http://localhost:8500`.
     - APIs vía Traefik: `http://localhost/api/v1/ofertas` o `/especificaciones`.

4. **Levanta el Frontend**:
   ```bash
   cd ../semana4  # Carpeta del frontend
   docker-compose up -d --build
   ```
   - Accede a la aplicación en `http://localhost:4200`.

5. **Verificación**:
   - Todos los servicios corren en `http://localhost` con puertos específicos.
   - Usa `docker ps` para ver contenedores activos.

### Notas
- **Producción**: Los puertos internos de microservicios están comentados para acceso solo vía Traefik (seguridad).
- **Datos Dummy**: Las DBs incluyen datos iniciales para pruebas.
- **CORS**: Configurado en Traefik para permitir requests del frontend.

## Características del Frontend

### Roadmap Interactivo con Autito Animado
- **Diseño del Autito**: SVG pixel art personalizado, incluyendo:
  - Cuerpo principal (rectángulos para estructura).
  - Cabina con ventana translúcida.
  - Ruedas con detalles (líneas para radios).
  - Detalles laterales (rayas decorativas en colores).
  - Número "1" en el frente.
  - Sombra elíptica para efecto 3D.
- **Animación**: El autito "recorre" puntos en un SVG de pista curva, moviéndose de semana en semana con animaciones CSS (e.g., `transform` para rotación y escala).
- **Interactividad**: Haz clic en círculos para seleccionar semanas; el autito se mueve automáticamente al punto correspondiente.
- **Flechas de Navegación**: Botones para avanzar/retroceder semanas, actualizando la posición del autito.

### Guards y Seguridad
- **Angular Guards**: Protegen rutas (e.g., `/aplicacion`) para requerir autenticación. Implementados con `CanActivate` para verificar tokens.
- **Local Storage**: Almacena tokens de sesión y datos del usuario para mantener el estado entre sesiones.

### Otras Características
- **Navegación**: RouterLink para enlaces a páginas (e.g., home → aplicación).
- **Estilos**: Tailwind CSS para diseños responsivos con gradientes y efectos (e.g., `backdrop-blur`).
- **Servicios**: HttpClient para consumir APIs del backend vía Traefik.


## 👥 Autor

Gustavo Auger


¡Disfruta explorando el proyecto! 🚀
