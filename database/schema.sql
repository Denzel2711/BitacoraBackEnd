-- =====================================================
-- Script de Base de Datos: Sistema de Bitácora TCU
-- Universidad Técnica Nacional
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS bitacora_tcu 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE bitacora_tcu;

-- =====================================================
-- Tabla: estudiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    carrera VARCHAR(150) NOT NULL,
    academico_a_cargo VARCHAR(150) NOT NULL,
    sede VARCHAR(100) NOT NULL,
    horas_acumuladas DECIMAL(5,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cedula (cedula),
    INDEX idx_nombre (nombre, primer_apellido, segundo_apellido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: actividades
-- =====================================================
CREATE TABLE IF NOT EXISTS actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    fecha_actividad DATE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_actividad ENUM('Planificación', 'Ejecución del proyecto') NOT NULL,
    subtipo_actividad VARCHAR(200) NOT NULL,
    tipo_capacitacion VARCHAR(150) NULL,
    experiencias_aprendizajes TEXT NULL,
    descripcion_actividad TEXT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_final TIME NOT NULL,
    horas_trabajadas DECIMAL(5,2) NOT NULL,
    ubicacion_lat DECIMAL(10, 8) NULL,
    ubicacion_lng DECIMAL(11, 8) NULL,
    descripcion_ubicacion TEXT NULL,
    estado ENUM('Pendiente', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
    observaciones TEXT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    INDEX idx_estudiante (estudiante_id),
    INDEX idx_fecha_actividad (fecha_actividad),
    INDEX idx_tipo_actividad (tipo_actividad),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: evidencias
-- =====================================================
CREATE TABLE IF NOT EXISTS evidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actividad_id INT NOT NULL,
    tipo_evidencia ENUM('Texto', 'Foto', 'Documentos') NOT NULL,
    contenido_texto TEXT NULL,
    ruta_archivo VARCHAR(500) NULL,
    nombre_archivo VARCHAR(255) NULL,
    tamano_archivo INT NULL,
    tipo_mime VARCHAR(100) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
    INDEX idx_actividad (actividad_id),
    INDEX idx_tipo_evidencia (tipo_evidencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: usuarios (para administradores/académicos)
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    rol ENUM('Admin', 'Academico', 'Estudiante') NOT NULL DEFAULT 'Estudiante',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario (nombre_usuario),
    INDEX idx_email (email),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: sesiones (tokens de autenticación)
-- =====================================================
CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Datos de Prueba
-- =====================================================

-- Insertar estudiantes de ejemplo
INSERT INTO estudiantes (cedula, nombre, primer_apellido, segundo_apellido, carrera, academico_a_cargo, sede, horas_acumuladas) VALUES
('123456789', 'Juan', 'Pérez', 'González', 'Ingeniería en Software', 'Dr. Carlos Ramírez', 'San Carlos', 0.00),
('987654321', 'María', 'Rodríguez', 'Mora', 'Administración', 'Dr. Carlos Ramírez', 'Atenas', 0.00),
('456789123', 'Carlos', 'López', 'Salas', 'Turismo', 'Dr. Carlos Ramírez', 'Central', 0.00),
('789123456', 'Ana', 'Hernández', 'Castro', 'Ingeniería Industrial', 'Dra. Laura Méndez', 'San Carlos', 0.00),
('321654987', 'Luis', 'Jiménez', 'Vargas', 'Contabilidad', 'Lic. Roberto Solís', 'Atenas', 0.00);

-- Insertar usuario administrador de ejemplo (password: admin123)
INSERT INTO usuarios (nombre_usuario, email, password_hash, nombre_completo, rol) VALUES
('admin', 'admin@tcu.ac.cr', '$2b$10$XQKnJ8h9JXYvZQqK7d5xNO5QqJ5xQqK7d5xNO5QqJ5xQqK7d5xNO', 'Administrador del Sistema', 'Admin'),
('carlos.ramirez', 'carlos.ramirez@tcu.ac.cr', '$2b$10$XQKnJ8h9JXYvZQqK7d5xNO5QqJ5xQqK7d5xNO5QqJ5xQqK7d5xNO', 'Dr. Carlos Ramírez', 'Academico');

-- =====================================================
-- Vistas útiles
-- =====================================================

-- Vista: Resumen de actividades por estudiante
CREATE OR REPLACE VIEW vista_resumen_estudiantes AS
SELECT 
    e.id,
    e.cedula,
    CONCAT(e.nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido) AS nombre_completo,
    e.carrera,
    e.sede,
    e.horas_acumuladas,
    COUNT(a.id) AS total_actividades,
    COUNT(CASE WHEN a.estado = 'Aprobada' THEN 1 END) AS actividades_aprobadas,
    COUNT(CASE WHEN a.estado = 'Pendiente' THEN 1 END) AS actividades_pendientes,
    COUNT(CASE WHEN a.estado = 'Rechazada' THEN 1 END) AS actividades_rechazadas
FROM estudiantes e
LEFT JOIN actividades a ON e.id = a.estudiante_id
GROUP BY e.id, e.cedula, e.nombre, e.primer_apellido, e.segundo_apellido, e.carrera, e.sede, e.horas_acumuladas;

-- Vista: Actividades con información del estudiante
CREATE OR REPLACE VIEW vista_actividades_completas AS
SELECT 
    a.id,
    a.fecha_actividad,
    a.fecha_registro,
    e.cedula,
    CONCAT(e.nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido) AS nombre_estudiante,
    e.carrera,
    e.sede,
    a.tipo_actividad,
    a.subtipo_actividad,
    a.tipo_capacitacion,
    a.descripcion_actividad,
    a.hora_inicio,
    a.hora_final,
    a.horas_trabajadas,
    a.estado,
    a.ubicacion_lat,
    a.ubicacion_lng,
    a.descripcion_ubicacion,
    GROUP_CONCAT(DISTINCT ev.tipo_evidencia) AS tipos_evidencias
FROM actividades a
INNER JOIN estudiantes e ON a.estudiante_id = e.id
LEFT JOIN evidencias ev ON a.id = ev.actividad_id
GROUP BY a.id, a.fecha_actividad, a.fecha_registro, e.cedula, e.nombre, e.primer_apellido, 
         e.segundo_apellido, e.carrera, e.sede, a.tipo_actividad, a.subtipo_actividad, 
         a.tipo_capacitacion, a.descripcion_actividad, a.hora_inicio, a.hora_final, 
         a.horas_trabajadas, a.estado, a.ubicacion_lat, a.ubicacion_lng, a.descripcion_ubicacion;

-- =====================================================
-- Procedimientos Almacenados
-- =====================================================

DELIMITER //

-- Procedimiento: Registrar actividad completa
CREATE PROCEDURE sp_registrar_actividad(
    IN p_estudiante_id INT,
    IN p_fecha_actividad DATE,
    IN p_tipo_actividad VARCHAR(50),
    IN p_subtipo_actividad VARCHAR(200),
    IN p_tipo_capacitacion VARCHAR(150),
    IN p_experiencias_aprendizajes TEXT,
    IN p_descripcion_actividad TEXT,
    IN p_hora_inicio TIME,
    IN p_hora_final TIME,
    IN p_ubicacion_lat DECIMAL(10,8),
    IN p_ubicacion_lng DECIMAL(11,8),
    IN p_descripcion_ubicacion TEXT,
    OUT p_actividad_id INT
)
BEGIN
    DECLARE v_horas_trabajadas DECIMAL(5,2);
    
    -- Calcular horas trabajadas
    SET v_horas_trabajadas = TIMESTAMPDIFF(MINUTE, 
        CONCAT(p_fecha_actividad, ' ', p_hora_inicio),
        CONCAT(p_fecha_actividad, ' ', p_hora_final)
    ) / 60.0;
    
    -- Insertar actividad
    INSERT INTO actividades (
        estudiante_id, fecha_actividad, tipo_actividad, subtipo_actividad,
        tipo_capacitacion, experiencias_aprendizajes, descripcion_actividad,
        hora_inicio, hora_final, horas_trabajadas,
        ubicacion_lat, ubicacion_lng, descripcion_ubicacion
    ) VALUES (
        p_estudiante_id, p_fecha_actividad, p_tipo_actividad, p_subtipo_actividad,
        p_tipo_capacitacion, p_experiencias_aprendizajes, p_descripcion_actividad,
        p_hora_inicio, p_hora_final, v_horas_trabajadas,
        p_ubicacion_lat, p_ubicacion_lng, p_descripcion_ubicacion
    );
    
    SET p_actividad_id = LAST_INSERT_ID();
END //

-- Procedimiento: Aprobar actividad y actualizar horas
CREATE PROCEDURE sp_aprobar_actividad(
    IN p_actividad_id INT,
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_estudiante_id INT;
    DECLARE v_horas_trabajadas DECIMAL(5,2);
    
    -- Obtener información de la actividad
    SELECT estudiante_id, horas_trabajadas 
    INTO v_estudiante_id, v_horas_trabajadas
    FROM actividades 
    WHERE id = p_actividad_id;
    
    -- Actualizar estado de la actividad
    UPDATE actividades 
    SET estado = 'Aprobada', observaciones = p_observaciones
    WHERE id = p_actividad_id;
    
    -- Actualizar horas acumuladas del estudiante
    UPDATE estudiantes
    SET horas_acumuladas = horas_acumuladas + v_horas_trabajadas
    WHERE id = v_estudiante_id;
END //

-- Procedimiento: Rechazar actividad
CREATE PROCEDURE sp_rechazar_actividad(
    IN p_actividad_id INT,
    IN p_observaciones TEXT
)
BEGIN
    UPDATE actividades 
    SET estado = 'Rechazada', observaciones = p_observaciones
    WHERE id = p_actividad_id;
END //

DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

DELIMITER //

-- Trigger: Validar horas antes de insertar actividad
CREATE TRIGGER trg_validar_horas_actividad
BEFORE INSERT ON actividades
FOR EACH ROW
BEGIN
    DECLARE v_horas DECIMAL(5,2);
    
    SET v_horas = TIMESTAMPDIFF(MINUTE, 
        CONCAT(NEW.fecha_actividad, ' ', NEW.hora_inicio),
        CONCAT(NEW.fecha_actividad, ' ', NEW.hora_final)
    ) / 60.0;
    
    -- Validar que no exceda 8 horas (o 12 para giras)
    IF v_horas > 12 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se pueden registrar más de 12 horas al día';
    END IF;
    
    SET NEW.horas_trabajadas = v_horas;
END //

DELIMITER ;

-- =====================================================
-- Índices adicionales para optimización
-- =====================================================

CREATE INDEX idx_fecha_registro ON actividades(fecha_registro);
CREATE INDEX idx_estudiante_fecha ON actividades(estudiante_id, fecha_actividad);
CREATE INDEX idx_estado_fecha ON actividades(estado, fecha_actividad);

-- =====================================================
-- Fin del Script
-- =====================================================
