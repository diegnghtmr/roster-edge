CREATE TABLE "Usuario" (
  "id" bigint PRIMARY KEY,
  "email" varchar(150) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "apellido" varchar(100) NOT NULL,
  "telefono" varchar(30),
  "fecha_nacimiento" date,
  "activo" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "Rol" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) UNIQUE NOT NULL,
  "descripcion" text,
  "activo" boolean DEFAULT true
);

CREATE TABLE "UsuarioRol" (
  "id" bigint PRIMARY KEY,
  "usuario_id" bigint NOT NULL,
  "rol_id" bigint NOT NULL,
  "club_id" bigint,
  "fecha_asignacion" date DEFAULT (now()),
  "activo" boolean DEFAULT true
);

CREATE TABLE "Club" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(150) NOT NULL,
  "nit" varchar(30),
  "logo_url" varchar(255),
  "color_hex" varchar(7),
  "ciudad" varchar(100),
  "telefono" varchar(30),
  "propietario_id" bigint NOT NULL,
  "activo" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Temporada" (
  "id" bigint PRIMARY KEY,
  "club_id" bigint NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date NOT NULL,
  "estado" varchar(20) NOT NULL DEFAULT 'PLANIFICADA'
);

CREATE TABLE "Equipo" (
  "id" bigint PRIMARY KEY,
  "club_id" bigint NOT NULL,
  "nombre" varchar(120) NOT NULL,
  "categoria" varchar(50) NOT NULL,
  "genero" varchar(10) NOT NULL DEFAULT 'MIXTO',
  "temporada_actual_id" bigint,
  "activo" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Sede" (
  "id" bigint PRIMARY KEY,
  "club_id" bigint NOT NULL,
  "nombre" varchar(150) NOT NULL,
  "direccion" varchar(200) NOT NULL,
  "capacidad" integer,
  "activo" boolean DEFAULT true
);

CREATE TABLE "Jugador" (
  "id" bigint PRIMARY KEY,
  "usuario_id" bigint,
  "nombre" varchar(100) NOT NULL,
  "apellido" varchar(100) NOT NULL,
  "fecha_nacimiento" date,
  "documento" varchar(30),
  "telefono_contacto" varchar(30),
  "contacto_emergencia" varchar(100),
  "activo" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Posicion" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(50) NOT NULL,
  "deporte" varchar(30) NOT NULL,
  "descripcion" text
);

CREATE TABLE "Staff" (
  "id" bigint PRIMARY KEY,
  "usuario_id" bigint,
  "nombre" varchar(100) NOT NULL,
  "apellido" varchar(100) NOT NULL,
  "rol_staff" varchar(20) NOT NULL,
  "certificaciones" text,
  "telefono" varchar(30),
  "activo" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Roster" (
  "id" bigint PRIMARY KEY,
  "jugador_id" bigint NOT NULL,
  "equipo_id" bigint NOT NULL,
  "temporada_id" bigint NOT NULL,
  "posicion_id" bigint,
  "dorsal" integer,
  "estado" varchar(20) NOT NULL DEFAULT 'ACTIVA',
  "fecha_alta" date DEFAULT (now()),
  "fecha_baja" date,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "EquipoStaff" (
  "id" bigint PRIMARY KEY,
  "staff_id" bigint NOT NULL,
  "equipo_id" bigint NOT NULL,
  "temporada_id" bigint NOT NULL,
  "rol_principal" boolean DEFAULT false,
  "fecha_inicio" date DEFAULT (now()),
  "fecha_fin" date,
  "activo" boolean DEFAULT true
);

CREATE TABLE "Evento" (
  "id" bigint PRIMARY KEY,
  "equipo_id" bigint NOT NULL,
  "temporada_id" bigint NOT NULL,
  "sede_id" bigint,
  "tipo" varchar(20) NOT NULL,
  "titulo" varchar(150) NOT NULL,
  "descripcion" text,
  "fecha_inicio" timestamp NOT NULL,
  "fecha_fin" timestamp NOT NULL,
  "estado" varchar(20) NOT NULL DEFAULT 'PROGRAMADO',
  "created_by" bigint,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Partido" (
  "id" bigint PRIMARY KEY,
  "evento_id" bigint UNIQUE NOT NULL,
  "rival" varchar(150) NOT NULL,
  "marcador_local" integer DEFAULT 0,
  "marcador_rival" integer DEFAULT 0,
  "incidencias" text
);

CREATE TABLE "Racha" (
  "id" bigint PRIMARY KEY,
  "equipo_id" bigint NOT NULL,
  "temporada_id" bigint,
  "tipo_racha" varchar(20) NOT NULL,
  "longitud" integer NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date,
  "activa" boolean DEFAULT true
);

CREATE TABLE "Plan" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(80) UNIQUE NOT NULL,
  "descripcion" varchar(255),
  "precio_cop" decimal(12,2) NOT NULL,
  "periodo" varchar(10) NOT NULL,
  "max_equipos" integer,
  "max_jugadores" integer,
  "activo" boolean DEFAULT true
);

CREATE TABLE "Suscripcion" (
  "id" bigint PRIMARY KEY,
  "usuario_id" bigint NOT NULL,
  "plan_id" bigint NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date NOT NULL,
  "estado" varchar(20) NOT NULL DEFAULT 'ACTIVA',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Pago" (
  "id" bigint PRIMARY KEY,
  "suscripcion_id" bigint NOT NULL,
  "fecha" timestamp DEFAULT (now()),
  "metodo" varchar(20) NOT NULL,
  "monto" decimal(12,2) NOT NULL,
  "estado" varchar(20) NOT NULL,
  "referencia" varchar(100)
);

CREATE TABLE "Notificacion" (
  "id" bigint PRIMARY KEY,
  "titulo" varchar(150) NOT NULL,
  "contenido" text NOT NULL,
  "canal" varchar(10) NOT NULL,
  "usuario_destinatario_id" bigint,
  "evento_id" bigint,
  "created_by" bigint,
  "created_at" timestamp DEFAULT (now()),
  "enviada" boolean DEFAULT false
);

CREATE TABLE "PlantillaDocumento" (
  "id" bigint PRIMARY KEY,
  "nombre" varchar(120) NOT NULL,
  "tipo" varchar(20) NOT NULL,
  "version" integer DEFAULT 1,
  "contenido_html" text NOT NULL,
  "placeholders_json" text,
  "activo" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

COMMENT ON TABLE "Usuario" IS 'Tabla principal de usuarios del sistema';

COMMENT ON TABLE "Rol" IS 'Roles disponibles en el sistema (ROSTER, STAFF, ADMIN, etc.)';

COMMENT ON TABLE "UsuarioRol" IS 'Asignación de roles a usuarios, opcionalmente por club específico';

COMMENT ON TABLE "Club" IS 'Clubes deportivos gestionados en la plataforma';

COMMENT ON TABLE "Temporada" IS 'Temporadas deportivas por club. Estados: PLANIFICADA, EN_CURSO, CERRADA';

COMMENT ON TABLE "Equipo" IS 'Equipos de un club. Géneros: M, F, MIXTO';

COMMENT ON TABLE "Sede" IS 'Sedes donde se realizan eventos y entrenamientos';

COMMENT ON TABLE "Jugador" IS 'Jugadores registrados en la plataforma';

COMMENT ON TABLE "Posicion" IS 'Posiciones disponibles por deporte (portero, defensa, medio, delantero, etc.)';

COMMENT ON TABLE "Staff" IS 'Personal técnico: ENTRENADOR, ASISTENTE, MEDICO, ARBITRO, PREPARADOR_FISICO';

COMMENT ON TABLE "Roster" IS 'Asignación de jugadores a equipos por temporada. Estados: ACTIVA, INACTIVA, LESIONADO, SUSPENDIDO';

COMMENT ON TABLE "EquipoStaff" IS 'Asignación de staff a equipos por temporada';

COMMENT ON TABLE "Evento" IS 'Eventos del equipo. Tipos: ENTRENAMIENTO, PARTIDO, REUNION, EVALUACION';

COMMENT ON TABLE "Partido" IS 'Información específica de partidos';

COMMENT ON TABLE "Racha" IS 'Rachas de equipos. Tipos: VICTORIAS, DERROTAS, EMPATES, GOLES';

COMMENT ON TABLE "Plan" IS 'Planes de suscripción. Períodos: MENSUAL, ANUAL';

COMMENT ON TABLE "Suscripcion" IS 'Suscripciones de usuarios. Estados: ACTIVA, SUSPENDIDA, VENCIDA';

COMMENT ON TABLE "Pago" IS 'Pagos realizados. Métodos: TARJETA, PSE, BILLETERA, EFECTIVO';

COMMENT ON TABLE "Notificacion" IS 'Notificaciones del sistema. Canales: IN_APP, EMAIL, SMS';

COMMENT ON TABLE "PlantillaDocumento" IS 'Plantillas para documentos. Tipos: FACTURA, PERMISO, COMPROBANTE';

ALTER TABLE "UsuarioRol" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "UsuarioRol" ADD FOREIGN KEY ("rol_id") REFERENCES "Rol" ("id");

ALTER TABLE "UsuarioRol" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Club" ADD FOREIGN KEY ("propietario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Temporada" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Equipo" ADD FOREIGN KEY ("temporada_actual_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Sede" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Jugador" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Staff" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("jugador_id") REFERENCES "Jugador" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("posicion_id") REFERENCES "Posicion" ("id");

ALTER TABLE "EquipoStaff" ADD FOREIGN KEY ("staff_id") REFERENCES "Staff" ("id");

ALTER TABLE "EquipoStaff" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "EquipoStaff" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("sede_id") REFERENCES "Sede" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("created_by") REFERENCES "Usuario" ("id");

ALTER TABLE "Evento" ADD FOREIGN KEY ("id") REFERENCES "Partido" ("evento_id");

ALTER TABLE "Racha" ADD FOREIGN KEY ("equipo_id") REFERENCES "Equipo" ("id");

ALTER TABLE "Racha" ADD FOREIGN KEY ("temporada_id") REFERENCES "Temporada" ("id");

ALTER TABLE "Suscripcion" ADD FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Suscripcion" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Pago" ADD FOREIGN KEY ("suscripcion_id") REFERENCES "Suscripcion" ("id");

ALTER TABLE "Notificacion" ADD FOREIGN KEY ("usuario_destinatario_id") REFERENCES "Usuario" ("id");

ALTER TABLE "Notificacion" ADD FOREIGN KEY ("evento_id") REFERENCES "Evento" ("id");

ALTER TABLE "Notificacion" ADD FOREIGN KEY ("created_by") REFERENCES "Usuario" ("id");
