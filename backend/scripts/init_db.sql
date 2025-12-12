-- Script de inicialización de base de datos - Monolito
-- Base de datos: app_db

-- Crear tabla de áreas
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Crear tabla de personas
CREATE TABLE IF NOT EXISTS personas (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    area_id INTEGER NOT NULL,
    CONSTRAINT fk_area FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_personas_email ON personas(email);
CREATE INDEX IF NOT EXISTS idx_personas_area_id ON personas(area_id);
CREATE INDEX IF NOT EXISTS idx_areas_nombre ON areas(nombre);

-- Insertar áreas (6 áreas)
INSERT INTO areas (id, nombre, descripcion) VALUES 
(1, 'Ventas', 'Departamento encargado de las ventas y relaciones con clientes'),
(2, 'Recursos Humanos', 'Gestión de personal, reclutamiento y desarrollo organizacional'),
(3, 'Tecnología', 'Desarrollo de software, infraestructura y soporte técnico'),
(4, 'Marketing', 'Estrategias de marketing, publicidad y comunicación'),
(5, 'Finanzas', 'Contabilidad, presupuestos y planificación financiera'),
(6, 'Operaciones', 'Gestión de operaciones, logística y procesos internos')
ON CONFLICT (id) DO NOTHING;

-- Insertar personas (30 personas distribuidas en las 6 áreas)
INSERT INTO personas (nombre, email, area_id) VALUES 
-- Ventas (5 personas)
('Juan Pérez', 'juan.perez@example.com', 1),
('María González', 'maria.gonzalez@example.com', 1),
('Pedro Ramírez', 'pedro.ramirez@example.com', 1),
('Laura Fernández', 'laura.fernandez@example.com', 1),
('Diego Torres', 'diego.torres@example.com', 1),

-- Recursos Humanos (5 personas)
('Ana Martínez', 'ana.martinez@example.com', 2),
('Carlos López', 'carlos.lopez@example.com', 2),
('Sofía Rodríguez', 'sofia.rodriguez@example.com', 2),
('Miguel Sánchez', 'miguel.sanchez@example.com', 2),
('Valentina Castro', 'valentina.castro@example.com', 2),

-- Tecnología (6 personas)
('Luis García', 'luis.garcia@example.com', 3),
('Carolina Herrera', 'carolina.herrera@example.com', 3),
('Andrés Vargas', 'andres.vargas@example.com', 3),
('Gabriela Morales', 'gabriela.morales@example.com', 3),
('Roberto Díaz', 'roberto.diaz@example.com', 3),
('Daniela Ruiz', 'daniela.ruiz@example.com', 3),

-- Marketing (5 personas)
('Fernando Silva', 'fernando.silva@example.com', 4),
('Patricia Méndez', 'patricia.mendez@example.com', 4),
('Javier Ortiz', 'javier.ortiz@example.com', 4),
('Camila Navarro', 'camila.navarro@example.com', 4),
('Sebastián Romero', 'sebastian.romero@example.com', 4),

-- Finanzas (5 personas)
('Ricardo Flores', 'ricardo.flores@example.com', 5),
('Lorena Gutiérrez', 'lorena.gutierrez@example.com', 5),
('Alejandro Vega', 'alejandro.vega@example.com', 5),
('Natalia Rojas', 'natalia.rojas@example.com', 5),
('Mauricio Campos', 'mauricio.campos@example.com', 5),

-- Operaciones (4 personas)
('Isabel Molina', 'isabel.molina@example.com', 6),
('Esteban Peña', 'esteban.pena@example.com', 6),
('Juliana Cruz', 'juliana.cruz@example.com', 6),
('Martín Aguilar', 'martin.aguilar@example.com', 6)
ON CONFLICT (email) DO NOTHING;

-- Reiniciar las secuencias para evitar conflictos con los IDs
SELECT setval('areas_id_seq', (SELECT COALESCE(MAX(id), 0) FROM areas) + 1, false);
SELECT setval('personas_id_seq', (SELECT COALESCE(MAX(id), 0) FROM personas) + 1, false);
