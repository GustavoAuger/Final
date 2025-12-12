-- Script de inicialización de datos de prueba para ofertas

-- Limpiar tablas existentes (opcional, descomentar si es necesario para pruebas)
-- TRUNCATE TABLE ofertas CASCADE;
-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS ofertas (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    solicitud_id INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    descripcion TEXT,
    requisitos_minimos TEXT,
    area VARCHAR(50),
    idioma VARCHAR(50),
    pais VARCHAR(50),
    localizacion VARCHAR(150),
    salario_modalidad VARCHAR(30),
    salario_moneda VARCHAR(30),
    salario_desde INTEGER,
    salario_hasta INTEGER,
    salario_mostrar INTEGER DEFAULT 1
);
-- Insertar datos de prueba
INSERT INTO ofertas (id, created_at, updated_at, deleted_at, solicitud_id, titulo, estado, descripcion, requisitos_minimos, area, idioma, pais, localizacion, salario_modalidad, salario_moneda, salario_desde, salario_hasta, salario_mostrar)
VALUES 
(1, NOW(), NOW(), NULL, 1001, 'Desarrollador Backend Senior', 'Activa', 'Buscamos un desarrollador backend con experiencia en Go', '5+ años de experiencia en desarrollo backend, Conocimiento en microservicios', 'Tecnología', 'Español', 'Argentina', 'Buenos Aires', 'Mensual', 'ARS', 500000, 700000, 1),
(2, NOW(), NOW(), NULL, 1002, 'Diseñador UX/UI', 'Activa', 'Buscamos diseñador con experiencia en aplicaciones web', '3+ años de experiencia en diseño de interfaces, Portfolio requerido', 'Diseño', 'Español', 'Colombia', 'Bogotá', 'Mensual', 'USD', 2000, 3000, 1),
(3, NOW(), NOW(), NULL, 1003, 'Product Manager', 'En revisión', 'Gestionar el ciclo de vida de nuestros productos', 'Experiencia en metodologías ágiles, Conocimiento de mercado tech', 'Producto', 'Inglés', 'México', 'CDMX', 'Mensual', 'USD', 3500, 4500, 1);

-- Reiniciar la secuencia para evitar conflictos con los IDs
SELECT setval('ofertas_id_seq', (SELECT MAX(id) FROM ofertas));
