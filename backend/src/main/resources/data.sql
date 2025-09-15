-- ========================================
-- DATOS DE EJEMPLO PARA ROSTER EDGE
-- ========================================
-- Contraseña predeterminada para todos: password123
-- ========================================
-- USUARIOS BASE (Jugadores y Staff)
-- ========================================

-- ========================================
-- ESTRUCTURA DE CLUBES
-- ========================================

-- Insertar club
INSERT INTO "Club" (id, nombre, lema, fundacion) VALUES
    (1, 'Águilas Doradas FC', 'Volar alto, jugar con honor', '2010-03-15')
ON CONFLICT DO NOTHING;

-- Insertar temporada
INSERT INTO "Temporada" (id, club_id, nombre, fecha_inicio, fecha_fin) VALUES
    (1, 1, 'Temporada 2024', '2024-01-01', '2024-12-31')
ON CONFLICT DO NOTHING;

-- Insertar equipo
INSERT INTO "Equipo" (id, nombre, genero, categoria, mascota, fundacion, club_id) VALUES
    (1, 'Águilas Primera División', 'Masculino', 'MASCULINO', 'Águila Dorada', '2010-03-15', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- COLORES Y SEDES
-- ========================================

-- Insertar colores
INSERT INTO "Color" (id, nombre) VALUES
    (1, 'Dorado'),
    (2, 'Negro'),
    (3, 'Blanco')
ON CONFLICT DO NOTHING;

-- Insertar relación equipo-colores
INSERT INTO "EquipoColor" (equipo_id, color_id) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;

-- Insertar sede
INSERT INTO "Sede" (id, email, lugar_origen, fundacion, nombre, telefono, club_id) VALUES
    (1, 'sede@aguilasdoradas.com', 'Medellín, Colombia', '2010-03-15', 'Sede Principal Águilas', '+57044123456', 1)
ON CONFLICT DO NOTHING;

-- Insertar estadio
INSERT INTO "Estadio" (id, area, suelo, capacidad_total, fundacion, sede_id) VALUES
    (1, 7500.50, 'Césped natural', 25000, '2010-04-01', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- STAFF Y JUGADORES
-- ========================================

-- Insertar staff con equipos asignados (incluye todos los campos de Usuario)
INSERT INTO "Staff" (id, email, password_hash, nombre, apellido, origen, telefono, fecha_nacimiento, fecha_contratacion, rol_staff, equipo_id) VALUES
    (1, 'entrenador@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Miguel', 'Rodríguez', 'Argentina', '+54911234567', '1978-07-22', '2023-01-15', 'ENTRENADOR', 1),
    (2, 'medico@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Ana', 'García', 'España', '+34612345678', '1982-11-08', '2023-02-01', 'MEDICO', 1),
    (3, 'fisioterapeuta@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Carlos', 'Mejía', 'Colombia', '+57300111222', '1985-03-15', '2023-03-01', 'FISIOTERAPEUTA', 1)
ON CONFLICT DO NOTHING;

-- Insertar jugadores con equipos asignados (incluye todos los campos de Usuario)
INSERT INTO "Jugador" (id, email, password_hash, nombre, apellido, origen, telefono, fecha_nacimiento, estado_fisico, dorsal, altura, pie_dominate, peso, posicion_principal, equipo_id) VALUES
    (4, 'lionel.martinez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Lionel', 'Martínez', 'Colombia', '+57300987654', '1995-04-10', 'Disponible', '10', '175', 'Derecho', '70', 'MEDIOCENTRO_OFENSIVO', 1),
    (5, 'diego.lopez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Diego', 'López', 'Colombia', '+57301123456', '1997-09-18', 'Disponible', '9', '182', 'Izquierdo', '75', 'DELANTERO_CENTRO', 1),
    (6, 'santiago.perez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Santiago', 'Pérez', 'Colombia', '+57302234567', '1994-12-03', 'Disponible', '1', '188', 'Derecho', '80', 'PORTERO', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PLANES Y SUSCRIPCIONES
-- ========================================

-- Insertar planes de suscripción
INSERT INTO "Plan" (id, nombre, descripcion, beneficios, precio) VALUES
    (1, 'Plan Básico', 'Plan básico para clubes pequeños', 'Gestión de equipos, estadísticas básicas', 50000.00),
    (2, 'Plan Profesional', 'Plan completo para clubes profesionales', 'Gestión avanzada, reportes detallados, análisis táctico', 150000.00),
    (3, 'Plan Premium', 'Plan premium con todas las funcionalidades', 'Funcionalidades completas, soporte prioritario, integraciones', 300000.00)
ON CONFLICT DO NOTHING;

-- Insertar suscripción para el admin del sistema
INSERT INTO "Suscripcion" (id, plan_id, fecha_inicio, fecha_fin, estado) VALUES
    (1, 2, '2024-01-01', '2024-12-31', 'ACTIVO')
ON CONFLICT DO NOTHING;

-- Insertar roster (el admin del sistema de gestión)
INSERT INTO "Roster" (id, nombre, email, password_hash, fecha_creacion, ultimo_accesso, club_id, suscripcion_id) VALUES
    (1, 'Águilas Admin', 'admin@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '2024-01-01', '2024-01-01', 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PAGOS
-- ========================================

-- Insertar pagos relacionados a planes
INSERT INTO "Pago" (id, fecha_pago, metodo_pago, descripcion, monto, descuento, divisa, plan_id) VALUES
    (1, '2024-01-01 09:30:00', 'TARJETA_CREDITO', 'Pago mensual Plan Profesional', 150000.00, 0, 'COP', 2),
    (2, '2024-02-01 10:15:00', 'PSE', 'Pago mensual Plan Profesional con descuento', 150000.00, 15000.00, 'COP', 2),
    (3, '2024-03-01 14:30:00', 'NEQUI', 'Pago Plan Básico', 50000.00, 0, 'COP', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- EVENTOS Y PARTIDOS
-- ========================================

-- Insertar eventos
INSERT INTO "Evento" (id, temporada_id, sede_id, nombre, descripcion, fecha) VALUES
    (1, 1, 1, 'Entrenamiento Preparatorio', 'Sesión de entrenamiento para preparar el próximo partido', '2024-01-15'),
    (2, 1, 1, 'Partido vs Deportivo Cali', 'Partido de liga contra Deportivo Cali', '2024-01-20'),
    (3, 1, 1, 'Reunión Técnica', 'Análisis táctico previo al partido', '2024-01-18')
ON CONFLICT DO NOTHING;

-- Insertar partido
INSERT INTO "Partido" (id, jornada, hora_inicio, hora_fin, fecha, estadio_id, temporada_id) VALUES
    (1, 'Jornada 1', '20:00:00', '22:00:00', '2024-01-20', 1, 1)
ON CONFLICT DO NOTHING;

-- Insertar equipos participantes en el partido
INSERT INTO "PartidoEquipoLocal" (partido_id, equipo_id, marcador) VALUES
    (1, 1, 2)
ON CONFLICT DO NOTHING;

INSERT INTO "PartidoEquipoVisitante" (partido_id, equipo_id, marcador) VALUES
    (1, 1, 1)
ON CONFLICT DO NOTHING;

-- Insertar participación del club en eventos
INSERT INTO "ClubEvento" (id, club_id, evento_id) VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- NOTIFICACIONES
-- ========================================

-- Insertar notificaciones
INSERT INTO "Notificacion" (id, mensaje, fecha_envio) VALUES
    (1, 'Recordatorio: Entrenamiento preparatorio programado para mañana a las 4:00 PM en las instalaciones del club.', '2024-01-14 09:00:00'),
    (2, 'Confirmación: Partido contra Deportivo Cali este sábado 20 de enero a las 8:00 PM. Favor confirmar asistencia del plantel.', '2024-01-18 10:00:00'),
    (3, 'Convocatoria: Reunión técnica obligatoria para todo el cuerpo técnico y jugadores titulares.', '2024-01-17 08:00:00')
ON CONFLICT DO NOTHING;

-- Insertar relaciones notificación-club evento
INSERT INTO "NotificacionClubEvento" (notificacion_id, club_evento_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- RACHAS Y PLANTILLAS
-- ========================================

-- Insertar racha del equipo
INSERT INTO "Racha" (id, equipo_id, fecha_inicio, fecha_fin) VALUES
    (1, 1, '2024-01-01', null)
ON CONFLICT DO NOTHING;

-- Insertar plantillas de documentos
INSERT INTO "PlantillaDocumento" (id, nombre, descripcion, formato, tipo, contenido, creacion) VALUES
    (1, 'Convocatoria Partido', 'Plantilla para convocar jugadores', 'PDF', 'CONVOCATORIA', 'Estimado jugador, queda convocado para el partido...', '2024-01-01 10:00:00'),
    (2, 'Informe Médico', 'Plantilla para informes médicos', 'PDF', 'MEDICO', 'Informe médico del jugador: [NOMBRE]...', '2024-01-01 10:00:00')
ON CONFLICT DO NOTHING;

-- Insertar relación roster-plantillas
INSERT INTO "RosterPlantillaDocumento" (roster_id, plantilla_documento_id) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;