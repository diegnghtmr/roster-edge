-- ========================================
-- ENUMS PARA ROLES Y POSICIONES
-- ========================================

-- Enum para roles de staff técnico
CREATE TYPE staff_rol_enum AS ENUM (
  'ENTRENADOR',
  'ASISTENTE_TECNICO', 
  'PREPARADOR_FISICO',
  'MEDICO',
  'FISIOTERAPEUTA',
  'PSICOLOGO_DEPORTIVO',
  'ENTRENADOR_PORTEROS',
  'ANALISTA_VIDEO',
  'NUTRICIONISTA',
  'DELEGADO',
  'UTILERO'
);

-- Enum para posiciones de jugador en fútbol
CREATE TYPE jugador_posicion_enum AS ENUM (
  -- Portero
  'PORTERO',
  -- Defensas
  'DEFENSA_CENTRAL',
  'LATERAL_DERECHO',
  'LATERAL_IZQUIERDO',
  'LIBERO',
  -- Centrocampistas
  'MEDIOCENTRO_DEFENSIVO',
  'MEDIOCENTRO',
  'MEDIOCENTRO_OFENSIVO',
  'EXTREMO_DERECHO',
  'EXTREMO_IZQUIERDO',
  'INTERIOR_DERECHO',
  'INTERIOR_IZQUIERDO',
  -- Delanteros
  'DELANTERO_CENTRO',
  'SEGUNDO_DELANTERO',
  'EXTREMO_DELANTERO'
);

-- Enum para estados de suscripción
CREATE TYPE suscripcion_estado_enum AS ENUM (
  'ACTIVO',
  'INACTIVO'
);

-- Enum para métodos de pago
CREATE TYPE metodo_pago_enum AS ENUM (
  'TARJETA_CREDITO',
  'TARJETA_DEBITO',
  'PSE',
  'NEQUI',
  'DAVIPLATA',
  'DAVIVIENDA',
  'BANCOLOMBIA',
  'PAYPAL'
);

-- Enum para categorías de equipo
CREATE TYPE equipo_categoria_enum AS ENUM (
  'MASCULINO',
  'FEMENINO',
  'MIXTO'
);

-- ========================================
-- TABLAS PRINCIPALES
-- ========================================

CREATE TABLE "Usuario" (
  "id" bigint PRIMARY KEY,
  "email" varchar(150) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "apellido" varchar(100) NOT NULL,
  "origen" varchar(100) NOT NULL,
  "telefono" varchar(30),
  "fecha_nacimiento" date NOT NULL
);

CREATE TABLE "Club" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(150) NOT NULL,
  "lema" text,
  "fundacion" date NOT NULL
);

CREATE TABLE "Temporada" (
  "id" bigint PRIMARY KEY,
  "club_id" bigint NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date NOT NULL 
);

CREATE TABLE "Equipo" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(120) NOT NULL,
  "genero" varchar(10) NOT NULL,
  "categoria" equipo_categoria_enum NOT NULL,
  "mascota" varchar(100),
  "fundacion" date NOT NULL,
  "club_id" bigint NOT NULL
);

CREATE TABLE "Color" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) NOT NULL
);

CREATE TABLE "EquipoColor" (
  "equipo_id" bigint NOT NULL,
  "color_id" bigint NOT NULL,
  PRIMARY KEY ("equipo_id", "color_id")
);

CREATE TABLE "Sede" (
  "id" bigint PRIMARY KEY,
  "email" varchar(150) NOT NULL,
  "lugar_origen" varchar(200) NOT NULL,
  "fundacion" date NOT NULL,
  "nombre" varchar(150) NOT NULL,
  "telefono" varchar(30) NOT NULL,
  "club_id" bigint NOT NULL
);

CREATE TABLE "Estadio" (
  "id" bigint PRIMARY KEY,
  "area" decimal(12,2) NOT NULL,
  "suelo" varchar(50) NOT NULL,
  "capacidad_total" integer NOT NULL,
  "fundacion" date NOT NULL,
  "sede_id" bigint NOT NULL
);

CREATE TABLE "Jugador" (
  "estado_fisico" varchar(30) NOT NULL,
  "dorsal" varchar(30) NOT NULL,
  "altura" varchar(4) NOT NULL,
  "pie_dominate" varchar(30) NOT NULL,
  "peso" varchar(10) NOT NULL,
  "posicion_principal" jugador_posicion_enum NOT NULL,
  "equipo_id" bigint NOT NULL 
) INHERITS ("Usuario");

CREATE TABLE "Posicion" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) NOT NULL,
  "deporte" varchar(30) NOT NULL,
  "descripcion" text
);


CREATE TABLE "Staff" (
  "fecha_contratacion" date DEFAULT (now()),
  "rol_staff" staff_rol_enum NOT NULL,
  "equipo_id" bigint NOT NULL 
) INHERITS ("Usuario");


CREATE TABLE "Roster" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) NOT NULL,
  "email" varchar(50) NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "fecha_creacion" date DEFAULT (now()),
  "ultimo_accesso" date DEFAULT (now()),
  "club_id" bigint UNIQUE NOT NULL,
  "suscripcion_id" bigint NOT NULL
);

CREATE TABLE "Evento" (
  "id" bigint PRIMARY KEY,
  "temporada_id" bigint NOT NULL,
  "sede_id" bigint,
  "nombre" varchar(150) NOT NULL,
  "descripcion" text,
  "fecha" date NOT NULL 
);

CREATE TABLE "Partido" (
  "id" bigint PRIMARY KEY,
  "evento_id" bigint UNIQUE NOT NULL,
  "jornada" text NOT NULL,
  "hora_inicio" time NOT NULL,
  "hora_fin" time NOT NULL,
  "fecha" date NOT NULL,
  "estadio_id" bigint NOT NULL,
  "temporada_id" bigint NOT NULL
);

CREATE TABLE "PartidoEquipoLocal" (
  "partido_id" bigint NOT NULL,
  "equipo_id" bigint NOT NULL,
  "marcador" integer DEFAULT 0,
  PRIMARY KEY ("partido_id", "equipo_id")
);

CREATE TABLE "PartidoEquipoVisitante" (
  "partido_id" bigint NOT NULL,
  "equipo_id" bigint NOT NULL,
  "marcador" integer DEFAULT 0,
  PRIMARY KEY ("partido_id", "equipo_id")
);

CREATE TABLE "Racha" (
  "id" bigint PRIMARY KEY,
  "equipo_id" bigint UNIQUE NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date
);
CREATE TABLE "Plan" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(80) UNIQUE NOT NULL,
  "descripcion" varchar(255),
  "beneficios" varchar(255),
  "precio" decimal(12,2) NOT NULL 
);

CREATE TABLE "Suscripcion" (
  "id" bigint PRIMARY KEY,
  "usuario_id" bigint NOT NULL,
  "plan_id" bigint NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date NOT NULL,
  "estado" suscripcion_estado_enum NOT NULL DEFAULT 'ACTIVO' 
);

CREATE TABLE "Pago" (
  "id" bigint PRIMARY KEY,
  "fecha_pago" timestamp DEFAULT (now()),
  "metodo_pago" metodo_pago_enum NOT NULL,
  "descripcion" varchar(255),
  "monto" decimal(12,2) NOT NULL,
  "descuento" decimal(12,2) DEFAULT 0,
  "divisa" varchar(3) NOT NULL DEFAULT 'COP',
  "plan_id" bigint NOT NULL
);


CREATE TABLE "ClubEvento" (
  "id" bigint PRIMARY KEY,
  "club_id" bigint NOT NULL,
  "evento_id" bigint NOT NULL,
  UNIQUE ("club_id", "evento_id")
);

CREATE TABLE "Notificacion" (
  "id" bigint PRIMARY KEY,
  "mensaje" text NOT NULL,
  "fecha_envio" timestamp DEFAULT (now()) 
);

CREATE TABLE "NotificacionClubEvento" (
  "notificacion_id" bigint NOT NULL,
  "club_evento_id" bigint NOT NULL,
  PRIMARY KEY ("notificacion_id", "club_evento_id")
);

CREATE TABLE "PlantillaDocumento" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(120) NOT NULL,
  "descripcion" varchar(120) NOT NULL,
  "formato" varchar(120) NOT NULL,
  "tipo" varchar(20) NOT NULL,
  "contenido" text NOT NULL,
  "creacion" timestamp DEFAULT (now())
);

CREATE TABLE "RosterPlantillaDocumento" (
  "roster_id" bigint NOT NULL,
  "plantilla_documento_id" bigint NOT NULL,
  PRIMARY KEY ("roster_id", "plantilla_documento_id")
);

COMMENT ON TABLE "Usuario" IS 'Tabla principal de usuarios del sistema';


COMMENT ON TABLE "Club" IS 'Clubes deportivos gestionados en la plataforma';

COMMENT ON TABLE "Temporada" IS 'Temporadas deportivas por club. Estados: PLANIFICADA, EN_CURSO, CERRADA';

COMMENT ON TABLE "Equipo" IS 'Equipos de un club. Géneros: M, F, MIXTO';

COMMENT ON TABLE "Sede" IS 'Sedes donde se realizan eventos y entrenamientos';

COMMENT ON TABLE "Estadio" IS 'Estadios con información de área, suelo, capacidad y fundación';

COMMENT ON TABLE "Jugador" IS 'Jugadores registrados con posición principal';

COMMENT ON TABLE "Posicion" IS 'Posiciones disponibles por deporte (portero, defensa, medio, delantero, etc.)';

COMMENT ON TABLE "Staff" IS 'Personal técnico con roles específicos definidos por staff_rol_enum';

-- Comentarios sobre los enums
COMMENT ON TYPE staff_rol_enum IS 'Roles disponibles para el staff técnico: entrenadores, cuerpo médico, analistas, etc.';
COMMENT ON TYPE jugador_posicion_enum IS 'Posiciones específicas de jugadores de fútbol organizadas por líneas: portero, defensas, centrocampistas y delanteros';
COMMENT ON TYPE suscripcion_estado_enum IS 'Estados simples para suscripciones: ACTIVO (suscripción vigente), INACTIVO (suspendida o vencida)';
COMMENT ON TYPE metodo_pago_enum IS 'Métodos de pago disponibles: tarjetas, billeteras digitales y transferencias';

COMMENT ON TYPE equipo_categoria_enum IS 'Categoría del equipo: MASCULINO, FEMENINO, MIXTO';

COMMENT ON TABLE "Roster" IS 'Asignación de jugadores a equipos por temporada con posición específica.';


COMMENT ON TABLE "Evento" IS 'Eventos del equipo. Tipos: ENTRENAMIENTO, PARTIDO, REUNION, EVALUACION';

COMMENT ON TABLE "Partido" IS 'Información específica de partidos';

COMMENT ON TABLE "Racha" IS 'Rachas de equipos. Tipos: VICTORIAS, DERROTAS, EMPATES, GOLES';

COMMENT ON TABLE "Plan" IS 'Planes de suscripción. Períodos: MENSUAL, ANUAL';

COMMENT ON TABLE "Suscripcion" IS 'Suscripciones de usuarios. Estados: ACTIVO, INACTIVO';

COMMENT ON TABLE "Pago" IS 'Registros de pagos realizados con información transaccional';


COMMENT ON TABLE "ClubEvento" IS 'Relación de clubs que participan en eventos deportivos';

COMMENT ON TABLE "Notificacion" IS 'Notificaciones sobre participaciones específicas de clubs en eventos';

COMMENT ON TABLE "PlantillaDocumento" IS 'Plantillas para documentos. Tipos: FACTURA, PERMISO, COMPROBANTE';

COMMENT ON TABLE "Color" IS 'Catálogo de colores utilizados por los equipos';

COMMENT ON TABLE "EquipoColor" IS 'Relación entre equipos y sus colores';

ALTER TABLE "Club" ADD FOREIGN KEY ("propietario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Temporada" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("temporada_actual_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Sede" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Estadio" ADD FOREIGN KEY ("sede_id") REFERENCES "Sede" ("id");

ALTER TABLE "Jugador" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Staff" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("jugador_id") REFERENCES "Jugador" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("suscripcion_id") REFERENCES "Suscripcion" ("id");

ALTER TABLE "RosterPlantillaDocumento" ADD FOREIGN KEY ("roster_id") REFERENCES "Roster" ("id");

ALTER TABLE "RosterPlantillaDocumento" ADD FOREIGN KEY ("plantilla_documento_id") REFERENCES "PlantillaDocumento" ("id");


ALTER TABLE "Evento" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("sede_id") REFERENCES "Sede" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("created_by") REFERENCES "Usuario" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("id") REFERENCES "Partido" ("evento_id");

ALTER TABLE "Partido" ADD FOREIGN KEY ("estadio_id") REFERENCES "Estadio" ("id");

ALTER TABLE "Partido" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "PartidoEquipoLocal" ADD FOREIGN KEY ("partido_id") REFERENCES "Partido" ("id");

ALTER TABLE "PartidoEquipoLocal" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "PartidoEquipoVisitante" ADD FOREIGN KEY ("partido_id") REFERENCES "Partido" ("id");

ALTER TABLE "PartidoEquipoVisitante" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Racha" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Racha" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Suscripcion" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Suscripcion" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Pago" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "ClubEvento" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "ClubEvento" ADD FOREIGN KEY ("evento_id") REFERENCES "Evento" ("id");

ALTER TABLE "NotificacionClubEvento" ADD FOREIGN KEY ("notificacion_id") REFERENCES "Notificacion" ("id");

ALTER TABLE "NotificacionClubEvento" ADD FOREIGN KEY ("club_evento_id") REFERENCES "ClubEvento" ("id");

ALTER TABLE "Notificacion" ADD FOREIGN KEY ("created_by") REFERENCES "Usuario" ("id");

ALTER TABLE "EquipoColor" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "EquipoColor" ADD FOREIGN KEY ("color_id") REFERENCES "Color" ("id");
