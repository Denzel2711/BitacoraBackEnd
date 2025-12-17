-- Script de limpieza y reinicio de la base de datos
-- ADVERTENCIA: Este script eliminará todos los datos existentes

USE bitacora_tcu;

-- Deshabilitar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas
TRUNCATE TABLE sesiones;
TRUNCATE TABLE evidencias;
TRUNCATE TABLE actividades;
TRUNCATE TABLE estudiantes;
TRUNCATE TABLE usuarios;

-- Rehabilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Reinsertar datos de prueba
INSERT INTO estudiantes (cedula, nombre, primer_apellido, segundo_apellido, carrera, academico_a_cargo, sede, horas_acumuladas) VALUES
('123456789', 'Juan', 'Pérez', 'González', 'Ingeniería en Software', 'Dr. Carlos Ramírez', 'San Carlos', 0.00),
('987654321', 'María', 'Rodríguez', 'Mora', 'Administración', 'Dr. Carlos Ramírez', 'Atenas', 0.00),
('456789123', 'Carlos', 'López', 'Salas', 'Turismo', 'Dr. Carlos Ramírez', 'Central', 0.00),
('789123456', 'Ana', 'Hernández', 'Castro', 'Ingeniería Industrial', 'Dra. Laura Méndez', 'San Carlos', 0.00),
('321654987', 'Luis', 'Jiménez', 'Vargas', 'Contabilidad', 'Lic. Roberto Solís', 'Atenas', 0.00);

INSERT INTO usuarios (nombre_usuario, email, password_hash, nombre_completo, rol) VALUES
('admin', 'admin@tcu.ac.cr', '$2b$10$XQKnJ8h9JXYvZQqK7d5xNO5QqJ5xQqK7d5xNO5QqJ5xQqK7d5xNO', 'Administrador del Sistema', 'Admin'),
('carlos.ramirez', 'carlos.ramirez@tcu.ac.cr', '$2b$10$XQKnJ8h9JXYvZQqK7d5xNO5QqJ5xQqK7d5xNO5QqJ5xQqK7d5xNO', 'Dr. Carlos Ramírez', 'Academico');

SELECT 'Base de datos reiniciada exitosamente' AS mensaje;
