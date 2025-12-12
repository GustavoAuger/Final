-- Script de inicialización de datos de prueba para especificaciones

-- Limpiar tablas existentes (opcional, descomentar si es necesario para pruebas)
-- TRUNCATE TABLE especificaciones CASCADE;
-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS especificaciones (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    oferta_id INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    numero_vacantes INTEGER,
    personal_a_cargo INTEGER,
    tipo_contrato VARCHAR(30),
    modalidad_trabajo VARCHAR(30),
    categoria VARCHAR(30),
    subcategoria VARCHAR(30),
    sector VARCHAR(30),
    nivel_profesional VARCHAR(30),
    departamento VARCHAR(30),
    experiencia_minima VARCHAR(30),
    jornada_laboral VARCHAR(30),
    formacion_minima VARCHAR(30)
);
-- Insertar datos de prueba
INSERT INTO especificaciones (
    created_at, updated_at, deleted_at, oferta_id, activo, numero_vacantes, 
    personal_a_cargo, tipo_contrato, modalidad_trabajo, categoria, 
    subcategoria, sector, nivel_profesional, departamento, 
    experiencia_minima, jornada_laboral, formacion_minima
) VALUES 
(NOW(), NOW(), NULL, 1, true, 2, 0, 'Tiempo completo', 'Remoto', 'Desarrollo', 'Backend', 'Tecnología', 'Senior', 'Tecnología', '5+ años', 'Full-time', 'Universitario'),
(NOW(), NOW(), NULL, 2, true, 1, 0, 'Tiempo completo', 'Híbrido', 'Diseño', 'UX/UI', 'Tecnología', 'Semi-senior', 'Diseño', '3+ años', 'Full-time', 'Universitario'),
(NOW(), NOW(), NULL, 3, true, 1, 3, 'Tiempo completo', 'Híbrido', 'Producto', 'Gestión', 'Tecnología', 'Senior', 'Producto', '5+ años', 'Full-time', 'Universitario');

-- Reiniciar la secuencia para evitar conflictos con los IDs
SELECT setval('especificaciones_id_seq', (SELECT MAX(id) FROM especificaciones));
