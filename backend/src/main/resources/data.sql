-- ========================================
-- SAMPLE DATA FOR ROSTER EDGE
-- ========================================
-- Default password for all users: password123
-- ========================================
-- BASE USERS (Players and Staff)
-- ========================================

-- ========================================
-- CATALOGS (replacement for ENUMs)
-- ========================================

-- Team categories
INSERT INTO "TeamCategory" (name) VALUES
    ('FIRST_DIVISION'),
    ('RESERVE'),
    ('UNDER_20')
ON CONFLICT DO NOTHING;

-- Team genders
INSERT INTO "TeamGender" (name) VALUES
    ('MALE'),
    ('FEMALE'),
    ('MIXED')
ON CONFLICT DO NOTHING;

-- Staff roles (only those used in this seed)
INSERT INTO "StaffRole" (name) VALUES
    ('COACH'),
    ('DOCTOR'),
    ('PHYSIOTHERAPIST')
ON CONFLICT DO NOTHING;

-- Player positions (only those used in this seed)
INSERT INTO "PlayerPosition" (name) VALUES
    ('ATTACKING_MIDFIELDER'),
    ('CENTER_FORWARD'),
    ('GOALKEEPER')
ON CONFLICT DO NOTHING;

-- Subscription statuses
INSERT INTO "SubscriptionStatus" (name) VALUES
    ('ACTIVE'),
    ('INACTIVE')
ON CONFLICT DO NOTHING;

-- Payment methods (only those used in this seed)
INSERT INTO "PaymentMethod" (name) VALUES
    ('CREDIT_CARD'),
    ('PSE'),
    ('NEQUI')
ON CONFLICT DO NOTHING;

-- Physical states of players
INSERT INTO "PhysicalState" (name) VALUES
    ('Available'),
    ('Injured'),
    ('In recovery'),
    ('Suspended'),
    ('Not available')
ON CONFLICT DO NOTHING;

-- Competition matchdays
INSERT INTO "Matchday" (name, description) VALUES
    ('Matchday 1', 'First matchday of the regular season'),
    ('Matchday 2', 'Second matchday of the regular season'),
    ('Quarter Finals', 'Quarter finals phase'),
    ('Semi Finals', 'Semi finals phase'),
    ('Final', 'Tournament final match')
ON CONFLICT DO NOTHING;

-- Currencies
INSERT INTO "Currency" (name, symbol) VALUES
    ('Colombian Peso', 'COP'),
    ('US Dollar', 'USD'),
    ('Euro', 'EUR')
ON CONFLICT DO NOTHING;

-- Document types
INSERT INTO "DocumentType" (name) VALUES
    ('SUMMONS'),
    ('MEDICAL'),
    ('INVOICE'),
    ('PERMIT'),
    ('RECEIPT')
ON CONFLICT DO NOTHING;

-- Document formats
INSERT INTO "DocumentFormat" (name) VALUES
    ('PDF'),
    ('DOCX'),
    ('HTML'),
    ('TXT')
ON CONFLICT DO NOTHING;

-- Countries
INSERT INTO "Country" (name) VALUES
    ('Colombia'),
    ('Argentina'),
    ('Spain')
ON CONFLICT DO NOTHING;

-- Cities
INSERT INTO "City" (name, country_id) VALUES
    ('Medellin', 1),
    ('Buenos Aires', 2),
    ('Madrid', 3),
    ('Cali', 1),
    ('Bogota', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- CLUB STRUCTURE
-- ========================================

-- Insert club
INSERT INTO "Club" (name, motto, foundation, created_at, updated_at, active) VALUES
    ('Aguilas Doradas FC', 'Fly high, play with honor', '2010-03-15', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert season
INSERT INTO "Season" (club_id, name, start_date, end_date, created_at, updated_at, active) VALUES
    (1, 'Season 2024', '2024-01-01', '2024-12-31', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert team
INSERT INTO "Team" (name, gender_id, category_id, mascot, foundation, club_id, created_at, updated_at, active) VALUES
    ('Aguilas First Division', 1, 1, 'Golden Eagle', '2010-03-15', 1, NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- ========================================
-- COLORS AND VENUES
-- ========================================

-- Insert colors
INSERT INTO "Color" (name) VALUES
    ('Gold'),
    ('Black'),
    ('White')
ON CONFLICT DO NOTHING;

-- Insert team-color relationships
INSERT INTO "TeamColor" (team_id, color_id) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;

-- Insert venue
INSERT INTO "Venue" (email, city_id, foundation, name, phone, club_id) VALUES
    ('venue@aguilasdoradas.com', 1, '2010-03-15', 'Main Venue Aguilas', '+57044123456', 1)
ON CONFLICT DO NOTHING;

-- Insert stadium
INSERT INTO "Stadium" (area, surface, total_capacity, foundation, venue_id) VALUES
    (7500.50, 'Natural grass', 25000, '2010-04-01', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- STAFF AND PLAYERS
-- ========================================

-- Insert staff with assigned teams (includes all User fields)
INSERT INTO "Staff" (email, password_hash, name, last_name, city_id, phone, birth_date, hire_date, staff_role_id, team_id) VALUES
    ('doctor@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ana', 'Garcia', 3, '+34612345678', '1982-11-08', '2023-02-01', 2, 1),
    ('physiotherapist@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Carlos', 'Mejia', 1, '+57300111222', '1985-03-15', '2023-03-01', 3, 1)
ON CONFLICT DO NOTHING;

-- Insert players with assigned teams (includes all User fields)
INSERT INTO "Player" (email, password_hash, name, last_name, city_id, phone, birth_date, physical_state_id, jersey_number, height, dominant_foot, weight, primary_position_id, team_id) VALUES
    ('lionel.martinez@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Lionel', 'Martinez', 1, '+57300987654', '1995-04-10', 1, '10', '175', 'Right', '70', 1, 1),
    ('diego.lopez@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Diego', 'Lopez', 4, '+57301123456', '1997-09-18', 1, '9', '182', 'Left', '75', 2, 1),
    ('santiago.perez@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Santiago', 'Perez', 5, '+57302234567', '1994-12-03', 1, '1', '188', 'Right', '80', 3, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PLANS AND SUBSCRIPTIONS
-- ========================================

-- Insert subscription plans
INSERT INTO "Plan" (name, description, price) VALUES
    ('Basic Plan', 'Basic plan for small clubs', 50000.00),
    ('Professional Plan', 'Complete plan for professional clubs', 150000.00),
    ('Premium Plan', 'Premium plan with all functionalities', 300000.00)
ON CONFLICT DO NOTHING;

-- Insert plan benefits
INSERT INTO "PlanBenefit" (plan_id, description) VALUES
    (1, 'Team management'),
    (1, 'Basic statistics'),
    (2, 'Advanced management'),
    (2, 'Detailed reports'),
    (2, 'Tactical analysis'),
    (3, 'Complete functionalities'),
    (3, 'Priority support'),
    (3, 'Integrations')
ON CONFLICT DO NOTHING;

-- Insert subscription for system admin
INSERT INTO "Subscription" (plan_id, start_date, end_date, status_id) VALUES
    (2, '2024-01-01', '2024-12-31', 1)
ON CONFLICT DO NOTHING;

-- Insert roster (system admin)
INSERT INTO "Roster" (name, email, password_hash, creation_date, last_access, club_id, subscription_id) VALUES
    ('Aguilas Admin', 'admin@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '2024-01-01', '2024-01-01', 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PAYMENTS
-- ========================================

-- Insert payments related to plans
INSERT INTO "Payment" (payment_date, payment_method_id, description, amount, discount, currency_id, plan_id) VALUES
    ('2024-01-01 09:30:00', 1, 'Monthly payment Professional Plan', 150000.00, 0, 1, 2),
    ('2024-02-01 10:15:00', 2, 'Monthly payment Professional Plan with discount', 150000.00, 15000.00, 1, 2),
    ('2024-03-01 14:30:00', 3, 'Basic Plan payment', 50000.00, 0, 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- EVENTS AND MATCHES
-- ========================================

-- Insert events
INSERT INTO "Event" (season_id, venue_id, name, description, date, created_at, updated_at, active) VALUES
    (1, 1, 'Preparatory Training', 'Training session to prepare for the next match', '2024-01-15', NOW(), NOW(), TRUE),
    (1, 1, 'Match vs Deportivo Cali', 'League match against Deportivo Cali', '2024-01-20', NOW(), NOW(), TRUE),
    (1, 1, 'Technical Meeting', 'Pre-match tactical analysis', '2024-01-18', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert match
INSERT INTO "Match" (matchday_id, start_time, end_time, date, stadium_id, season_id) VALUES
    (1, '20:00:00', '22:00:00', '2024-01-20', 1, 1)
ON CONFLICT DO NOTHING;

-- Insert participating teams in the match
INSERT INTO "MatchHomeTeam" (match_id, team_id, score) VALUES
    (1, 1, 2)
ON CONFLICT DO NOTHING;

INSERT INTO "MatchAwayTeam" (match_id, team_id, score) VALUES
    (1, 1, 1)
ON CONFLICT DO NOTHING;

-- Insert club participation in events
INSERT INTO "ClubEvent" (club_id, event_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- NOTIFICATIONS
-- ========================================

-- Insert notifications
INSERT INTO "Notification" (message, send_date) VALUES
    ('Reminder: Preparatory training scheduled for tomorrow at 4:00 PM at the club facilities.', '2024-01-14 09:00:00'),
    ('Confirmation: Match against Deportivo Cali this Saturday January 20 at 8:00 PM. Please confirm squad attendance.', '2024-01-18 10:00:00'),
    ('Summons: Mandatory technical meeting for all technical staff and starting players.', '2024-01-17 08:00:00')
ON CONFLICT DO NOTHING;

-- Insert notification-club event relationships
INSERT INTO "NotificationClubEvent" (notification_id, club_event_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- STREAKS AND DOCUMENT TEMPLATES
-- ========================================

-- Insert team streak
INSERT INTO "Streak" (team_id, start_date, end_date) VALUES
    (1, '2024-01-01', null)
ON CONFLICT DO NOTHING;

-- Insert document templates
INSERT INTO "DocumentTemplate" (name, description, document_format_id, document_type_id, content, creation) VALUES
    ('Match Summons', 'Template for summoning players', 1, 1, 'Dear player, you are summoned for the match...', '2024-01-01 10:00:00'),
    ('Medical Report', 'Template for medical reports', 1, 2, 'Medical report of player: [NAME]...', '2024-01-01 10:00:00')
ON CONFLICT DO NOTHING;

-- Insert roster-document template relationships
INSERT INTO "RosterDocumentTemplate" (roster_id, document_template_id) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;

