-- ========================================
-- CATALOGS (replacement for ENUMs)
-- ========================================

CREATE TABLE IF NOT EXISTS "StaffRole" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "PlayerPosition" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "SubscriptionStatus" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "PaymentMethod" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(80) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "TeamCategory" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "TeamGender" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "PhysicalState" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Matchday" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(100) NOT NULL,
  "description" varchar(255)
);

CREATE TABLE IF NOT EXISTS "Currency" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) UNIQUE NOT NULL,
  "symbol" varchar(10) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "DocumentType" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "DocumentFormat" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) UNIQUE NOT NULL

);

CREATE TABLE IF NOT EXISTS "Country" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "City" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(100) NOT NULL,
  "country_id" bigint
);

-- ========================================
-- MAIN TABLES
-- ========================================

CREATE TABLE IF NOT EXISTS "User" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "email" varchar(150) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "city_id" bigint,
  "phone" varchar(30),
  "birth_date" date NOT NULL
);

CREATE TABLE IF NOT EXISTS "Club" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(150) NOT NULL,
  "motto" text,
  "foundation" date NOT NULL
);

CREATE TABLE IF NOT EXISTS "Season" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "club_id" bigint,
  "name" varchar(100) NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL
);

CREATE TABLE IF NOT EXISTS "Team" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(120) NOT NULL,
  "gender_id" bigint,
  "category_id" bigint,
  "mascot" varchar(100),
  "foundation" date NOT NULL,
  "club_id" bigint
);

CREATE TABLE IF NOT EXISTS "Color" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "TeamColor" (
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "team_id" bigint NOT NULL,
  "color_id" bigint NOT NULL,
  PRIMARY KEY ("team_id", "color_id")
);

CREATE TABLE IF NOT EXISTS "Venue" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "email" varchar(150) NOT NULL,
  "city_id" bigint,
  "foundation" date NOT NULL,
  "name" varchar(150) NOT NULL,
  "phone" varchar(30) NOT NULL,
  "club_id" bigint
);

CREATE TABLE IF NOT EXISTS "Stadium" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "area" decimal(12,2) NOT NULL,
  "surface" varchar(50) NOT NULL,
  "total_capacity" integer NOT NULL,
  "foundation" date NOT NULL,
  "venue_id" bigint
);

CREATE TABLE IF NOT EXISTS "Player" (
  "physical_state_id" bigint,
  "jersey_number" varchar(30) NOT NULL,
  "height" varchar(4) NOT NULL,
  "dominant_foot" varchar(30) NOT NULL,
  "weight" varchar(10) NOT NULL,
  "primary_position_id" bigint,
  "team_id" bigint,
  PRIMARY KEY ("id"),
  UNIQUE ("email")
) INHERITS ("User");

CREATE TABLE IF NOT EXISTS "Staff" (
  "hire_date" date DEFAULT (now()),
  "staff_role_id" bigint,
  "team_id" bigint,
  PRIMARY KEY ("id"),
  UNIQUE ("email")
) INHERITS ("User");

CREATE TABLE IF NOT EXISTS "Roster" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(50) NOT NULL,
  "email" varchar(50) NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "creation_date" date DEFAULT (now()),
  "last_access" date DEFAULT (now()),
  "club_id" bigint UNIQUE,
  "subscription_id" bigint
);

CREATE TABLE IF NOT EXISTS "Event" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "season_id" bigint NOT NULL,
  "venue_id" bigint,
  "name" varchar(150) NOT NULL,
  "description" text,
  "date" date NOT NULL
);

CREATE TABLE IF NOT EXISTS "Match" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "matchday_id" bigint,
  "start_time" time NOT NULL,
  "end_time" time NOT NULL,
  "date" date NOT NULL,
  "stadium_id" bigint,
  "event_id" bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS "MatchHomeTeam" (
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "match_id" bigint NOT NULL,
  "team_id" bigint NOT NULL,
  "score" integer DEFAULT 0,
  PRIMARY KEY ("match_id", "team_id")
);

CREATE TABLE IF NOT EXISTS "MatchAwayTeam" (
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "match_id" bigint NOT NULL,
  "team_id" bigint NOT NULL,
  "score" integer DEFAULT 0,
  PRIMARY KEY ("match_id", "team_id")
);

CREATE TABLE IF NOT EXISTS "Streak" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "team_id" bigint UNIQUE,
  "start_date" date NOT NULL,
  "end_date" date
);

CREATE TABLE IF NOT EXISTS "Plan" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "name" varchar(80) UNIQUE NOT NULL,
  "description" varchar(255),
  "price" decimal(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "PlanBenefit" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "plan_id" bigint,
  "description" varchar(255) NOT NULL,
  UNIQUE ("plan_id", "description")
);

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "plan_id" bigint,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "status_id" bigint
);

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "payment_date" timestamp DEFAULT (now()),
  "payment_method_id" bigint,
  "description" varchar(255),
  "amount" decimal(12,2) NOT NULL,
  "discount" decimal(12,2) DEFAULT 0,
  "currency_id" bigint,
  "plan_id" bigint,
  "roster_id" bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS "ClubEvent" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "club_id" bigint,
  "event_id" bigint,
  UNIQUE ("club_id", "event_id")
);

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "message" text NOT NULL,
  "status" varchar(30) DEFAULT 'PENDING' NOT NULL,
  "send_date" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "NotificationClubEvent" (
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "active" boolean DEFAULT true,
  "notification_id" bigint NOT NULL,
  "club_event_id" bigint NOT NULL,
  PRIMARY KEY ("notification_id", "club_event_id")
);

-- ========================================
-- TABLE COMMENTS
-- ========================================

COMMENT ON TABLE "User" IS 'Main user table of the system';

COMMENT ON TABLE "Club" IS 'Sports clubs managed on the platform';

COMMENT ON TABLE "Season" IS 'Sports seasons per club. Status: PLANNED, IN_PROGRESS, CLOSED';

COMMENT ON TABLE "Team" IS 'Club teams. Genders: M, F, MIXED';

COMMENT ON TABLE "Venue" IS 'Venues where events and trainings take place';

COMMENT ON TABLE "Stadium" IS 'Stadiums with area, surface, capacity and foundation information';

COMMENT ON TABLE "Player" IS 'Registered players with primary position';

COMMENT ON TABLE "Staff" IS 'Technical staff with specific roles defined by the StaffRole catalog';

-- Comments on catalogs
COMMENT ON TABLE "StaffRole" IS 'Catalog of available roles for technical staff';
COMMENT ON TABLE "PlayerPosition" IS 'Catalog of specific football player positions';
COMMENT ON TABLE "SubscriptionStatus" IS 'Catalog of subscription statuses';
COMMENT ON TABLE "PaymentMethod" IS 'Catalog of available payment methods';
COMMENT ON TABLE "TeamCategory" IS 'Team category catalog: MALE, FEMALE, MIXED';

COMMENT ON TABLE "TeamGender" IS 'Team gender catalog: MALE, FEMALE, MIXED';
COMMENT ON TABLE "Roster" IS 'Team management system with subscriptions.';

COMMENT ON TABLE "Event" IS 'Team events. Types: TRAINING, MATCH, MEETING, EVALUATION';

COMMENT ON TABLE "Match" IS 'Specific match information';

COMMENT ON TABLE "Streak" IS 'Team streaks. Types: WINS, LOSSES, DRAWS, GOALS';

COMMENT ON TABLE "Plan" IS 'Subscription plans. Periods: MONTHLY, ANNUAL';

COMMENT ON TABLE "PlanBenefit" IS 'Atomic benefits associated with each subscription plan';

COMMENT ON TABLE "Subscription" IS 'User subscriptions. Status: ACTIVE, INACTIVE';

COMMENT ON TABLE "Payment" IS 'Payment records with transactional information';

COMMENT ON TABLE "ClubEvent" IS 'Relationship of clubs participating in sports events';

COMMENT ON TABLE "Notification" IS 'Notifications about specific club participations in events';

COMMENT ON TABLE "Color" IS 'Catalog of colors used by teams';

COMMENT ON TABLE "TeamColor" IS 'Relationship between teams and their colors';

-- ========================================
-- FOREIGN KEYS
-- ========================================

ALTER TABLE "City" ADD FOREIGN KEY ("country_id") REFERENCES "Country" ("id");

ALTER TABLE "User" ADD FOREIGN KEY ("city_id") REFERENCES "City" ("id");

ALTER TABLE "Season" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Team" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Team" ADD FOREIGN KEY ("category_id") REFERENCES "TeamCategory" ("id");

ALTER TABLE "Team" ADD FOREIGN KEY ("gender_id") REFERENCES "TeamGender" ("id");

ALTER TABLE "Venue" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Venue" ADD FOREIGN KEY ("city_id") REFERENCES "City" ("id");

ALTER TABLE "Stadium" ADD FOREIGN KEY ("venue_id") REFERENCES "Venue" ("id");

ALTER TABLE "Player" ADD FOREIGN KEY ("team_id") REFERENCES "Team" ("id");

ALTER TABLE "Player" ADD FOREIGN KEY ("primary_position_id") REFERENCES "PlayerPosition" ("id");

ALTER TABLE "Player" ADD FOREIGN KEY ("physical_state_id") REFERENCES "PhysicalState" ("id");

ALTER TABLE "Staff" ADD FOREIGN KEY ("team_id") REFERENCES "Team" ("id");

ALTER TABLE "Staff" ADD FOREIGN KEY ("staff_role_id") REFERENCES "StaffRole" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "Roster" ADD FOREIGN KEY ("subscription_id") REFERENCES "Subscription" ("id");

ALTER TABLE "Event" ADD FOREIGN KEY ("season_id") REFERENCES "Season" ("id");

ALTER TABLE "Event" ADD FOREIGN KEY ("venue_id") REFERENCES "Venue" ("id");

ALTER TABLE "Match" ADD FOREIGN KEY ("stadium_id") REFERENCES "Stadium" ("id");

ALTER TABLE "Match" ADD FOREIGN KEY ("event_id") REFERENCES "Event" ("id");

ALTER TABLE "Match" ADD FOREIGN KEY ("matchday_id") REFERENCES "Matchday" ("id");

ALTER TABLE "MatchHomeTeam" ADD FOREIGN KEY ("match_id") REFERENCES "Match" ("id");

ALTER TABLE "MatchHomeTeam" ADD FOREIGN KEY ("team_id") REFERENCES "Team" ("id");

ALTER TABLE "MatchAwayTeam" ADD FOREIGN KEY ("match_id") REFERENCES "Match" ("id");

ALTER TABLE "MatchAwayTeam" ADD FOREIGN KEY ("team_id") REFERENCES "Team" ("id");

ALTER TABLE "Streak" ADD FOREIGN KEY ("team_id") REFERENCES "Team" ("id");

ALTER TABLE "Subscription" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Subscription" ADD FOREIGN KEY ("status_id") REFERENCES "SubscriptionStatus" ("id");

ALTER TABLE "PlanBenefit" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Payment" ADD FOREIGN KEY ("plan_id") REFERENCES "Plan" ("id");

ALTER TABLE "Payment" ADD FOREIGN KEY ("payment_method_id") REFERENCES "PaymentMethod" ("id");

ALTER TABLE "Payment" ADD FOREIGN KEY ("currency_id") REFERENCES "Currency" ("id");

ALTER TABLE "Payment" ADD FOREIGN KEY ("roster_id") REFERENCES "Roster" ("id");

ALTER TABLE "ClubEvent" ADD FOREIGN KEY ("club_id") REFERENCES "Club" ("id");

ALTER TABLE "ClubEvent" ADD FOREIGN KEY ("event_id") REFERENCES "Event" ("id");

ALTER TABLE "NotificationClubEvent" ADD FOREIGN KEY ("notification_id") REFERENCES "Notification" ("id");

ALTER TABLE "NotificationClubEvent" ADD FOREIGN KEY ("club_event_id") REFERENCES "ClubEvent" ("id");

ALTER TABLE "TeamColor" ADD FOREIGN KEY ("team_id") REFERENCES "Team" ("id");

ALTER TABLE "TeamColor" ADD FOREIGN KEY ("color_id") REFERENCES "Color" ("id");

