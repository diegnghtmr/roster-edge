-- Baseline for a fresh installation and reconciliation of pre-Flyway installations.
CREATE TABLE IF NOT EXISTS "StaffRole" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(100) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "PlayerPosition" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(100) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "SubscriptionStatus" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(50) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "PaymentMethod" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(80) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "TeamCategory" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(50) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "TeamGender" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(20) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "PhysicalState" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(50) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "Matchday" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(100) NOT NULL, description varchar(255)
);
CREATE TABLE IF NOT EXISTS "Currency" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(50) UNIQUE NOT NULL, symbol varchar(10) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "Country" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(100) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS "City" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(100) NOT NULL, country_id bigint
);
CREATE TABLE IF NOT EXISTS "User" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  email varchar(150) UNIQUE NOT NULL, password_hash varchar(255) NOT NULL, name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL, city_id bigint, phone varchar(30), birth_date date NOT NULL
);
CREATE TABLE IF NOT EXISTS "Club" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(150) NOT NULL, motto text, foundation date NOT NULL
);
CREATE TABLE IF NOT EXISTS "Season" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  club_id bigint, name varchar(100) NOT NULL, start_date date NOT NULL, end_date date NOT NULL
);
CREATE TABLE IF NOT EXISTS "Team" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  name varchar(120) NOT NULL, gender_id bigint, category_id bigint, mascot varchar(100), foundation date NOT NULL, club_id bigint
);
CREATE TABLE IF NOT EXISTS "Color" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS "TeamColor" (
  created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  team_id bigint NOT NULL, color_id bigint NOT NULL, PRIMARY KEY (team_id, color_id)
);
CREATE TABLE IF NOT EXISTS "Venue" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  email varchar(150) NOT NULL, city_id bigint, foundation date NOT NULL, name varchar(150) NOT NULL, phone varchar(30) NOT NULL, club_id bigint
);
CREATE TABLE IF NOT EXISTS "Stadium" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  area decimal(12,2) NOT NULL, surface varchar(50) NOT NULL, total_capacity integer NOT NULL, foundation date NOT NULL, venue_id bigint
);
CREATE TABLE IF NOT EXISTS "Player" (
  physical_state_id bigint, jersey_number varchar(30) NOT NULL, height varchar(4) NOT NULL, dominant_foot varchar(30) NOT NULL,
  weight varchar(10) NOT NULL, primary_position_id bigint, team_id bigint, PRIMARY KEY (id), UNIQUE (email)
) INHERITS ("User");
CREATE TABLE IF NOT EXISTS "Staff" (
  hire_date date DEFAULT now(), staff_role_id bigint, team_id bigint, PRIMARY KEY (id), UNIQUE (email)
) INHERITS ("User");
CREATE TABLE IF NOT EXISTS "Roster" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  name varchar(50) NOT NULL, email varchar(50) NOT NULL, password_hash varchar(255) NOT NULL, creation_date date DEFAULT now(),
  last_access date DEFAULT now(), club_id bigint UNIQUE, subscription_id bigint
);
CREATE TABLE IF NOT EXISTS "Event" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  season_id bigint NOT NULL, venue_id bigint, name varchar(150) NOT NULL, description text, date date NOT NULL
);
CREATE TABLE IF NOT EXISTS "Match" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  matchday_id bigint, start_time time NOT NULL, end_time time NOT NULL, date date NOT NULL, stadium_id bigint, event_id bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS "MatchHomeTeam" (
  created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  match_id bigint NOT NULL, team_id bigint NOT NULL, score integer DEFAULT 0, PRIMARY KEY (match_id, team_id)
);
CREATE TABLE IF NOT EXISTS "MatchAwayTeam" (
  created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  match_id bigint NOT NULL, team_id bigint NOT NULL, score integer DEFAULT 0, PRIMARY KEY (match_id, team_id)
);
CREATE TABLE IF NOT EXISTS "Streak" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  team_id bigint UNIQUE, start_date date NOT NULL, end_date date
);
CREATE TABLE IF NOT EXISTS "Plan" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, name varchar(80) UNIQUE NOT NULL, description varchar(255), price decimal(12,2) NOT NULL
);
CREATE TABLE IF NOT EXISTS "PlanBenefit" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, plan_id bigint, description varchar(255) NOT NULL, UNIQUE (plan_id, description)
);
CREATE TABLE IF NOT EXISTS "Subscription" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  plan_id bigint, start_date date NOT NULL, end_date date NOT NULL, status_id bigint
);
CREATE TABLE IF NOT EXISTS "Payment" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  payment_date timestamp DEFAULT now(), payment_method_id bigint, description varchar(255), amount decimal(12,2) NOT NULL,
  discount decimal(12,2) DEFAULT 0, currency_id bigint, plan_id bigint, roster_id bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS "ClubEvent" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(),
  active boolean DEFAULT true, club_id bigint, event_id bigint, UNIQUE (club_id, event_id)
);
CREATE TABLE IF NOT EXISTS "Notification" (
  id BIGSERIAL PRIMARY KEY, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  message text NOT NULL, status varchar(30) DEFAULT 'PENDING' NOT NULL, send_date timestamp DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "NotificationClubEvent" (
  created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now(), active boolean DEFAULT true,
  notification_id bigint NOT NULL, club_event_id bigint NOT NULL, PRIMARY KEY (notification_id, club_event_id)
);

-- Match constraints by relation and columns, not name, so old installations are not given duplicate FKs.
DO $$
DECLARE
    fk record;
    source_table regclass;
    target_table regclass;
BEGIN
    FOR fk IN SELECT * FROM (VALUES
        ('City', 'country_id', 'Country'), ('User', 'city_id', 'City'), ('Season', 'club_id', 'Club'),
        ('Team', 'club_id', 'Club'), ('Team', 'category_id', 'TeamCategory'), ('Team', 'gender_id', 'TeamGender'),
        ('Venue', 'club_id', 'Club'), ('Venue', 'city_id', 'City'), ('Stadium', 'venue_id', 'Venue'),
        ('Player', 'team_id', 'Team'), ('Player', 'primary_position_id', 'PlayerPosition'),
        ('Player', 'physical_state_id', 'PhysicalState'), ('Staff', 'team_id', 'Team'), ('Staff', 'staff_role_id', 'StaffRole'),
        ('Roster', 'club_id', 'Club'), ('Roster', 'subscription_id', 'Subscription'),
        ('Event', 'season_id', 'Season'), ('Event', 'venue_id', 'Venue'), ('Match', 'stadium_id', 'Stadium'),
        ('Match', 'event_id', 'Event'), ('Match', 'matchday_id', 'Matchday'), ('MatchHomeTeam', 'match_id', 'Match'),
        ('MatchHomeTeam', 'team_id', 'Team'), ('MatchAwayTeam', 'match_id', 'Match'), ('MatchAwayTeam', 'team_id', 'Team'),
        ('Streak', 'team_id', 'Team'), ('Subscription', 'plan_id', 'Plan'), ('Subscription', 'status_id', 'SubscriptionStatus'),
        ('PlanBenefit', 'plan_id', 'Plan'), ('Payment', 'plan_id', 'Plan'), ('Payment', 'payment_method_id', 'PaymentMethod'),
        ('Payment', 'currency_id', 'Currency'), ('Payment', 'roster_id', 'Roster'), ('ClubEvent', 'club_id', 'Club'),
        ('ClubEvent', 'event_id', 'Event'), ('NotificationClubEvent', 'notification_id', 'Notification'),
        ('NotificationClubEvent', 'club_event_id', 'ClubEvent'), ('TeamColor', 'team_id', 'Team'), ('TeamColor', 'color_id', 'Color')
    ) AS expected(src, column_name, target)
    LOOP
        source_table := format('%I.%I', current_schema(), fk.src)::regclass;
        target_table := format('%I.%I', current_schema(), fk.target)::regclass;
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_attribute a ON a.attrelid = c.conrelid AND c.conkey = ARRAY[a.attnum]
            JOIN pg_attribute b ON b.attrelid = c.confrelid AND c.confkey = ARRAY[b.attnum]
            WHERE c.contype = 'f' AND c.convalidated AND c.conrelid = source_table AND c.confrelid = target_table
                AND a.attname = fk.column_name AND b.attname = 'id'
        ) THEN
            EXECUTE format('ALTER TABLE %s ADD FOREIGN KEY (%I) REFERENCES %s (id)', source_table, fk.column_name, target_table);
        END IF;
    END LOOP;
END;
$$;
