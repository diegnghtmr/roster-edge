-- ========================================
-- DATOS DE EJEMPLO PARA ROSTER EDGE
-- ========================================
-- Contraseña predeterminada para todos: password123
-- ========================================
-- USUARIOS BASE (Jugadores y Staff)
-- ========================================

-- ========================================
-- CATALOGOS (reemplazo de ENUMS)
-- ========================================

-- Categorias de equipo
INSERT INTO "EquipoCategoria" (id, nombre) VALUES
    (1, 'PRIMERA_DIVISION'),
    (2, 'RESERVA'),
    (3, 'SUB_20')
ON CONFLICT DO NOTHING;

-- Generos de equipo
INSERT INTO "EquipoGenero" (id, nombre) VALUES
    (1, 'MASCULINO'),
    (2, 'FEMENINO'),
    (3, 'MIXTO')
ON CONFLICT DO NOTHING;

-- Roles de staff (solo los utilizados en este seed)
INSERT INTO "StaffRol" (id, nombre) VALUES
    (1, 'ENTRENADOR'),
    (2, 'MEDICO'),
    (3, 'FISIOTERAPEUTA')
ON CONFLICT DO NOTHING;

-- Posiciones de jugador (solo las utilizadas en este seed)
INSERT INTO "JugadorPosicion" (id, nombre) VALUES
    (1, 'MEDIOCENTRO_OFENSIVO'),
    (2, 'DELANTERO_CENTRO'),
    (3, 'PORTERO')
ON CONFLICT DO NOTHING;

-- Estados de suscripción
INSERT INTO "SuscripcionEstado" (id, nombre) VALUES
    (1, 'ACTIVO'),
    (2, 'INACTIVO')
ON CONFLICT DO NOTHING;

-- Métodos de pago (solo los utilizados en este seed)
INSERT INTO "MetodoPago" (id, nombre) VALUES
    (1, 'TARJETA_CREDITO'),
    (2, 'PSE'),
    (3, 'NEQUI')
ON CONFLICT DO NOTHING;

-- Estados físicos de jugadores
INSERT INTO "EstadoFisico" (id, nombre) VALUES
    (1, 'Disponible'),
    (2, 'Lesionado'),
    (3, 'En recuperación'),
    (4, 'Suspendido'),
    (5, 'No disponible')
ON CONFLICT DO NOTHING;

-- Jornadas de competición
INSERT INTO "Jornada" (id, nombre, descripcion) VALUES
    (1, 'Jornada 1', 'Primera jornada de la temporada regular'),
    (2, 'Jornada 2', 'Segunda jornada de la temporada regular'),
    (3, 'Cuartos de Final', 'Fase de cuartos de final'),
    (4, 'Semifinales', 'Fase de semifinales'),
    (5, 'Final', 'Partido final del torneo')
ON CONFLICT DO NOTHING;

-- Divisas
INSERT INTO "Divisa" (id, nombre, simbolo) VALUES
    (1, 'Peso Colombiano', 'COP'),
    (2, 'Dólar Estadounidense', 'USD'),
    (3, 'Euro', 'EUR')
ON CONFLICT DO NOTHING;

-- Tipos de documento
INSERT INTO "TipoDocumento" (id, nombre) VALUES
    (1, 'CONVOCATORIA'),
    (2, 'MEDICO'),
    (3, 'FACTURA'),
    (4, 'PERMISO'),
    (5, 'COMPROBANTE')
ON CONFLICT DO NOTHING;

-- Formatos de documento
INSERT INTO "FormatoDocumento" (id, nombre) VALUES
    (1, 'PDF'),
    (2, 'DOCX'),
    (3, 'HTML'),
    (4, 'TXT')
ON CONFLICT DO NOTHING;

-- Países
INSERT INTO "Pais" (id, nombre) VALUES
    (1, 'Colombia'),
    (2, 'Argentina'),
    (3, 'España')
ON CONFLICT DO NOTHING;

-- Ciudades
INSERT INTO "Ciudad" (id, nombre, pais_id) VALUES
    (1, 'Medellín', 1),
    (2, 'Buenos Aires', 2),
    (3, 'Madrid', 3),
    (4, 'Cali', 1),
    (5, 'Bogotá', 1)
ON CONFLICT DO NOTHING;

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
INSERT INTO "Equipo" (id, nombre, genero_id, categoria_id, mascota, fundacion, club_id) VALUES
    (1, 'Águilas Primera División', 1, 1, 'Águila Dorada', '2010-03-15', 1)
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
INSERT INTO "Sede" (id, email, ciudad_id, fundacion, nombre, telefono, club_id) VALUES
    (1, 'sede@aguilasdoradas.com', 1, '2010-03-15', 'Sede Principal Águilas', '+57044123456', 1)
ON CONFLICT DO NOTHING;

-- Insertar estadio
INSERT INTO "Estadio" (id, area, suelo, capacidad_total, fundacion, sede_id) VALUES
    (1, 7500.50, 'Césped natural', 25000, '2010-04-01', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- STAFF Y JUGADORES
-- ========================================

-- Insertar staff con equipos asignados (incluye todos los campos de Usuario)
INSERT INTO "Staff" (id, email, password_hash, nombre, apellido, ciudad_id, telefono, fecha_nacimiento, fecha_contratacion, rol_staff_id, equipo_id) VALUES
    (1, 'entrenador@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Miguel', 'Rodríguez', 2, '+54911234567', '1978-07-22', '2023-01-15', 1, 1),
    (2, 'medico@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Ana', 'García', 3, '+34612345678', '1982-11-08', '2023-02-01', 2, 1),
    (3, 'fisioterapeuta@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Carlos', 'Mejía', 1, '+57300111222', '1985-03-15', '2023-03-01', 3, 1)
ON CONFLICT DO NOTHING;

-- Insertar jugadores con equipos asignados (incluye todos los campos de Usuario)
INSERT INTO "Jugador" (id, email, password_hash, nombre, apellido, ciudad_id, telefono, fecha_nacimiento, estado_fisico_id, dorsal, altura, pie_dominate, peso, posicion_principal_id, equipo_id) VALUES
    (4, 'lionel.martinez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Lionel', 'Martínez', 1, '+57300987654', '1995-04-10', 1, '10', '175', 'Derecho', '70', 1, 1),
    (5, 'diego.lopez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Diego', 'López', 4, '+57301123456', '1997-09-18', 1, '9', '182', 'Izquierdo', '75', 2, 1),
    (6, 'santiago.perez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Santiago', 'Pérez', 5, '+57302234567', '1994-12-03', 1, '1', '188', 'Derecho', '80', 3, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PLANES Y SUSCRIPCIONES
-- ========================================

-- Insertar planes de suscripcion
INSERT INTO "Plan" (id, nombre, descripcion, precio) VALUES
    (1, 'Plan Basico', 'Plan basico para clubes pequeños', 50000.00),
    (2, 'Plan Profesional', 'Plan completo para clubes profesionales', 150000.00),
    (3, 'Plan Premium', 'Plan premium con todas las funcionalidades', 300000.00)
ON CONFLICT DO NOTHING;

-- Insertar beneficios por plan
INSERT INTO "PlanBeneficio" (id, plan_id, descripcion) VALUES
    (1, 1, 'Gestion de equipos'),
    (2, 1, 'Estadisticas basicas'),
    (3, 2, 'Gestion avanzada'),
    (4, 2, 'Reportes detallados'),
    (5, 2, 'Analisis tactico'),
    (6, 3, 'Funcionalidades completas'),
    (7, 3, 'Soporte prioritario'),
    (8, 3, 'Integraciones')
ON CONFLICT DO NOTHING;

-- Insertar suscripción para el admin del sistema
INSERT INTO "Suscripcion" (id, plan_id, fecha_inicio, fecha_fin, estado_id) VALUES
    (1, 2, '2024-01-01', '2024-12-31', 1)
ON CONFLICT DO NOTHING;

-- Insertar roster (el admin del sistema de gestión)
INSERT INTO "Roster" (id, nombre, email, password_hash, fecha_creacion, ultimo_accesso, club_id, suscripcion_id) VALUES
    (1, 'Águilas Admin', 'admin@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '2024-01-01', '2024-01-01', 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PAGOS
-- ========================================

-- Insertar pagos relacionados a planes
INSERT INTO "Pago" (id, fecha_pago, metodo_pago_id, descripcion, monto, descuento, divisa_id, plan_id) VALUES
    (1, '2024-01-01 09:30:00', 1, 'Pago mensual Plan Profesional', 150000.00, 0, 1, 2),
    (2, '2024-02-01 10:15:00', 2, 'Pago mensual Plan Profesional con descuento', 150000.00, 15000.00, 1, 2),
    (3, '2024-03-01 14:30:00', 3, 'Pago Plan Básico', 50000.00, 0, 1, 1)
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
INSERT INTO "Partido" (id, jornada_id, hora_inicio, hora_fin, fecha, estadio_id, temporada_id) VALUES
    (1, 1, '20:00:00', '22:00:00', '2024-01-20', 1, 1)
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
INSERT INTO "PlantillaDocumento" (id, nombre, descripcion, formato_documento_id, tipo_documento_id, contenido, creacion) VALUES
    (1, 'Convocatoria Partido', 'Plantilla para convocar jugadores', 1, 1, 'Estimado jugador, queda convocado para el partido...', '2024-01-01 10:00:00'),
    (2, 'Informe Médico', 'Plantilla para informes médicos', 1, 2, 'Informe médico del jugador: [NOMBRE]...', '2024-01-01 10:00:00')
ON CONFLICT DO NOTHING;

-- Insertar relación roster-plantillas
INSERT INTO "RosterPlantillaDocumento" (roster_id, plantilla_documento_id) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;

