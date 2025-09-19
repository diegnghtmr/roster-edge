-- ========================================
-- CATALOGOS (reemplazo de ENUMs)
-- ========================================

CREATE TABLE "StaffRol" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "JugadorPosicion" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "SuscripcionEstado" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "MetodoPago" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(80) UNIQUE NOT NULL
);

CREATE TABLE "EquipoCategoria" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "EquipoGenero" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(20) UNIQUE NOT NULL
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
  "pais" varchar(100) NOT NULL,
  "ciudad" varchar(100) NOT NULL,
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
  "genero_id" bigint NOT NULL,
  "categoria_id" bigint NOT NULL,
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
  "pais" varchar(100) NOT NULL,
  "ciudad" varchar(100) NOT NULL,
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
  "posicion_principal_id" bigint NOT NULL,
  "equipo_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("email")
) INHERITS ("Usuario");

CREATE TABLE "Staff" (
  "fecha_contratacion" date DEFAULT (now()),
  "rol_staff_id" bigint NOT NULL,
  "equipo_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("email")
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
  "precio" decimal(12,2) NOT NULL 
);

CREATE TABLE "PlanBeneficio" (
  "id" bigint PRIMARY KEY,
  "plan_id" bigint NOT NULL,
  "descripcion" varchar(255) NOT NULL,
  UNIQUE ("plan_id", "descripcion")
);

CREATE TABLE "Suscripcion" (
  "id" bigint PRIMARY KEY,
  "plan_id" bigint NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date NOT NULL,
  "estado_id" bigint NOT NULL 
);

CREATE TABLE "Pago" (
  "id" bigint PRIMARY KEY,
  "fecha_pago" timestamp DEFAULT (now()),
  "metodo_pago_id" bigint NOT NULL,
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

-- ========================================
-- COMENTARIOS DE TABLAS
-- ========================================

COMMENT ON TABLE "Usuario" IS 'Tabla principal de usuarios del sistema';

COMMENT ON TABLE "Club" IS 'Clubes deportivos gestionados en la plataforma';

COMMENT ON TABLE "Temporada" IS 'Temporadas deportivas por club. Estados: PLANIFICADA, EN_CURSO, CERRADA';

COMMENT ON TABLE "Equipo" IS 'Equipos de un club. Géneros: M, F, MIXTO';

COMMENT ON TABLE "Sede" IS 'Sedes donde se realizan eventos y entrenamientos';

COMMENT ON TABLE "Estadio" IS 'Estadios con información de área, suelo, capacidad y fundación';

COMMENT ON TABLE "Jugador" IS 'Jugadores registrados con posición principal';

COMMENT ON TABLE "Staff" IS 'Personal técnico con roles específicos definidos por el catálogo StaffRol';

-- Comentarios sobre los catálogos
COMMENT ON TABLE "StaffRol" IS 'Catálogo de roles disponibles para el staff técnico';
COMMENT ON TABLE "JugadorPosicion" IS 'Catálogo de posiciones específicas de jugadores de fútbol';
COMMENT ON TABLE "SuscripcionEstado" IS 'Catálogo de estados de suscripción';
COMMENT ON TABLE "MetodoPago" IS 'Catálogo de métodos de pago disponibles';
COMMENT ON TABLE "EquipoCategoria" IS 'Catalogo de categorias del equipo: MASCULINO, FEMENINO, MIXTO';

COMMENT ON TABLE "EquipoGenero" IS 'Catalogo de generos de equipo: MASCULINO, FEMENINO, MIXTO';
COMMENT ON TABLE "Roster" IS 'Sistema de gestión de equipos con suscripciones.';


COMMENT ON TABLE "Evento" IS 'Eventos del equipo. Tipos: ENTRENAMIENTO, PARTIDO, REUNION, EVALUACION';

COMMENT ON TABLE "Partido" IS 'Información específica de partidos';

COMMENT ON TABLE "Racha" IS 'Rachas de equipos. Tipos: VICTORIAS, DERROTAS, EMPATES, GOLES';

COMMENT ON TABLE "Plan" IS 'Planes de suscripción. Períodos: MENSUAL, ANUAL';

COMMENT ON TABLE "PlanBeneficio" IS 'Beneficios atomicos asociados a cada plan de suscripcion';

COMMENT ON TABLE "Suscripcion" IS 'Suscripciones de usuarios. Estados: ACTIVO, INACTIVO';

COMMENT ON TABLE "Pago" IS 'Registros de pagos realizados con información transaccional';

COMMENT ON TABLE "ClubEvento" IS 'Relación de clubs que participan en eventos deportivos';

COMMENT ON TABLE "Notificacion" IS 'Notificaciones sobre participaciones específicas de clubs en eventos';

COMMENT ON TABLE "PlantillaDocumento" IS 'Plantillas para documentos. Tipos: FACTURA, PERMISO, COMPROBANTE';

COMMENT ON TABLE "Color" IS 'Catálogo de colores utilizados por los equipos';

COMMENT ON TABLE "EquipoColor" IS 'Relación entre equipos y sus colores';

-- ========================================
-- FOREIGN KEYS
-- ========================================

ALTER TABLE "Temporada" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("categoria_id") REFERENCES "EquipoCategoria" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("genero_id") REFERENCES "EquipoGenero" ("id");

ALTER TABLE "Sede" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Estadio" ADD FOREIGN KEY ("sede_id") REFERENCES "Sede" ("id");

ALTER TABLE "Jugador" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Jugador" ADD FOREIGN KEY ("posicion_principal_id") REFERENCES "JugadorPosicion" ("id");

ALTER TABLE "Staff" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Staff" ADD FOREIGN KEY ("rol_staff_id") REFERENCES "StaffRol" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("suscripcion_id") REFERENCES "Suscripcion" ("id");

ALTER TABLE "RosterPlantillaDocumento" ADD FOREIGN KEY ("roster_id") REFERENCES "Roster" ("id");

ALTER TABLE "RosterPlantillaDocumento" ADD FOREIGN KEY ("plantilla_documento_id") REFERENCES "PlantillaDocumento" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("sede_id") REFERENCES "Sede" ("id");

ALTER TABLE "Partido" ADD FOREIGN KEY ("estadio_id") REFERENCES "Estadio" ("id");

ALTER TABLE "Partido" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "PartidoEquipoLocal" ADD FOREIGN KEY ("partido_id") REFERENCES "Partido" ("id");

ALTER TABLE "PartidoEquipoLocal" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "PartidoEquipoVisitante" ADD FOREIGN KEY ("partido_id") REFERENCES "Partido" ("id");

ALTER TABLE "PartidoEquipoVisitante" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Racha" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Suscripcion" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Suscripcion" ADD FOREIGN KEY ("estado_id") REFERENCES "SuscripcionEstado" ("id");

ALTER TABLE "PlanBeneficio" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Pago" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");
ALTER TABLE "Pago" ADD FOREIGN KEY ("metodo_pago_id") REFERENCES "MetodoPago" ("id");

ALTER TABLE "ClubEvento" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "ClubEvento" ADD FOREIGN KEY ("evento_id") REFERENCES "Evento" ("id");

ALTER TABLE "NotificacionClubEvento" ADD FOREIGN KEY ("notificacion_id") REFERENCES "Notificacion" ("id");

ALTER TABLE "NotificacionClubEvento" ADD FOREIGN KEY ("club_evento_id") REFERENCES "ClubEvento" ("id");

ALTER TABLE "EquipoColor" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "EquipoColor" ADD FOREIGN KEY ("color_id") REFERENCES "Color" ("id");

