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
INSERT INTO "TeamCategory" (id, name) VALUES
    (1, 'FIRST_DIVISION'),
    (2, 'RESERVE'),
    (3, 'UNDER_20')
ON CONFLICT DO NOTHING;

-- Team genders
INSERT INTO "TeamGender" (id, name) VALUES
    (1, 'MALE'),
    (2, 'FEMALE'),
    (3, 'MIXED')
ON CONFLICT DO NOTHING;

-- Staff roles (only those used in this seed)
INSERT INTO "StaffRole" (id, name) VALUES
    (1, 'COACH'),
    (2, 'DOCTOR'),
    (3, 'PHYSIOTHERAPIST')
ON CONFLICT DO NOTHING;

-- Player positions (only those used in this seed)
INSERT INTO "PlayerPosition" (id, name) VALUES
    (1, 'ATTACKING_MIDFIELDER'),
    (2, 'CENTER_FORWARD'),
    (3, 'GOALKEEPER')
ON CONFLICT DO NOTHING;

-- Subscription statuses
INSERT INTO "SubscriptionStatus" (id, name) VALUES
    (1, 'ACTIVE'),
    (2, 'INACTIVE')
ON CONFLICT DO NOTHING;

-- Payment methods (only those used in this seed)
INSERT INTO "PaymentMethod" (id, name) VALUES
    (1, 'CREDIT_CARD'),
    (2, 'PSE'),
    (3, 'NEQUI')
ON CONFLICT DO NOTHING;

-- Physical states of players
INSERT INTO "PhysicalState" (id, name) VALUES
    (1, 'Available'),
    (2, 'Injured'),
    (3, 'In recovery'),
    (4, 'Suspended'),
    (5, 'Not available')
ON CONFLICT DO NOTHING;

-- Competition matchdays
INSERT INTO "Matchday" (id, name, description) VALUES
    (1, 'Matchday 1', 'First matchday of the regular season'),
    (2, 'Matchday 2', 'Second matchday of the regular season'),
    (3, 'Quarter Finals', 'Quarter finals phase'),
    (4, 'Semi Finals', 'Semi finals phase'),
    (5, 'Final', 'Tournament final match')
ON CONFLICT DO NOTHING;

-- Currencies
INSERT INTO "Currency" (id, name, symbol) VALUES
    (1, 'Colombian Peso', 'COP'),
    (2, 'US Dollar', 'USD'),
    (3, 'Euro', 'EUR')
ON CONFLICT DO NOTHING;

-- Document types
INSERT INTO "DocumentType" (id, name) VALUES
    (1, 'SUMMONS'),
    (2, 'MEDICAL'),
    (3, 'INVOICE'),
    (4, 'PERMIT'),
    (5, 'RECEIPT')
ON CONFLICT DO NOTHING;

-- Document formats
INSERT INTO "DocumentFormat" (id, name) VALUES
    (1, 'PDF'),
    (2, 'DOCX'),
    (3, 'HTML'),
    (4, 'TXT')
ON CONFLICT DO NOTHING;

-- Countries
INSERT INTO "Country" (id, name) VALUES
    (1, 'Colombia'),
    (2, 'Argentina'),
    (3, 'Spain')
ON CONFLICT DO NOTHING;

-- Cities
INSERT INTO "City" (id, name, country_id) VALUES
    (1, 'Medellín', 1),
    (2, 'Buenos Aires', 2),
    (3, 'Madrid', 3),
    (4, 'Cali', 1),
    (5, 'Bogotá', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- CLUB STRUCTURE
-- ========================================

-- Insert club
INSERT INTO "Club" (id, name, motto, foundation) VALUES
    (1, 'Águilas Doradas FC', 'Fly high, play with honor', '2010-03-15')
ON CONFLICT DO NOTHING;

-- Insert season
INSERT INTO "Season" (id, club_id, name, start_date, end_date) VALUES
    (1, 1, 'Season 2024', '2024-01-01', '2024-12-31')
ON CONFLICT DO NOTHING;

-- Insert team
INSERT INTO "Team" (id, name, gender_id, category_id, mascot, foundation, club_id) VALUES
    (1, 'Águilas First Division', 1, 1, 'Golden Eagle', '2010-03-15', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- COLORS AND VENUES
-- ========================================

-- Insert colors
INSERT INTO "Color" (id, name) VALUES
    (1, 'Gold'),
    (2, 'Black'),
    (3, 'White')
ON CONFLICT DO NOTHING;

-- Insert team-color relationships
INSERT INTO "TeamColor" (teamId, colorId) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;

-- Insert venue
INSERT INTO "Venue" (id, email, city_id, foundation, name, phone, club_id) VALUES
    (1, 'venue@aguilasdoradas.com', 1, '2010-03-15', 'Main Venue Águilas', '+57044123456', 1)
ON CONFLICT DO NOTHING;

-- Insert stadium
INSERT INTO "Stadium" (id, area, surface, total_capacity, foundation, venue_id) VALUES
    (1, 7500.50, 'Natural grass', 25000, '2010-04-01', 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- STAFF AND PLAYERS
-- ========================================

-- Insert staff with assigned teams (includes all User fields)
INSERT INTO "Staff" (id, email, password_hash, name, last_name, city_id, phone, birth_date, hire_date, staff_role_id, team_id) VALUES
    (2, 'doctor@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Ana', 'García', 3, '+34612345678', '1982-11-08', '2023-02-01', 2, 1),
    (3, 'physiotherapist@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Carlos', 'Mejía', 1, '+57300111222', '1985-03-15', '2023-03-01', 3, 1)
ON CONFLICT DO NOTHING;

-- Insert players with assigned teams (includes all User fields)
INSERT INTO "Player" (id, email, password_hash, name, last_name, city_id, phone, birth_date, physical_state_id, jersey_number, height, dominant_foot, weight, primary_position_id, team_id) VALUES
    (4, 'lionel.martinez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Lionel', 'Martínez', 1, '+57300987654', '1995-04-10', 1, '10', '175', 'Right', '70', 1, 1),
    (5, 'diego.lopez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Diego', 'López', 4, '+57301123456', '1997-09-18', 1, '9', '182', 'Left', '75', 2, 1),
    (6, 'santiago.perez@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Santiago', 'Pérez', 5, '+57302234567', '1994-12-03', 1, '1', '188', 'Right', '80', 3, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PLANS AND SUBSCRIPTIONS
-- ========================================

-- Insert subscription plans
INSERT INTO "Plan" (id, name, description, price) VALUES
    (1, 'Basic Plan', 'Basic plan for small clubs', 50000.00),
    (2, 'Professional Plan', 'Complete plan for professional clubs', 150000.00),
    (3, 'Premium Plan', 'Premium plan with all functionalities', 300000.00)
ON CONFLICT DO NOTHING;

-- Insert plan benefits
INSERT INTO "PlanBenefit" (id, plan_id, description) VALUES
    (1, 1, 'Team management'),
    (2, 1, 'Basic statistics'),
    (3, 2, 'Advanced management'),
    (4, 2, 'Detailed reports'),
    (5, 2, 'Tactical analysis'),
    (6, 3, 'Complete functionalities'),
    (7, 3, 'Priority support'),
    (8, 3, 'Integrations')
ON CONFLICT DO NOTHING;

-- Insert subscription for system admin
INSERT INTO "Subscription" (id, plan_id, start_date, end_date, status_id) VALUES
    (1, 2, '2024-01-01', '2024-12-31', 1)
ON CONFLICT DO NOTHING;

-- Insert roster (system admin)
INSERT INTO "Roster" (id, name, email, password_hash, creation_date, last_access, club_id, subscription_id) VALUES
    (1, 'Águilas Admin', 'admin@aguilasdoradas.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '2024-01-01', '2024-01-01', 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- PAYMENTS
-- ========================================

-- Insert payments related to plans
INSERT INTO "Payment" (id, payment_date, payment_method_id, description, amount, discount, currency_id, plan_id) VALUES
    (1, '2024-01-01 09:30:00', 1, 'Monthly payment Professional Plan', 150000.00, 0, 1, 2),
    (2, '2024-02-01 10:15:00', 2, 'Monthly payment Professional Plan with discount', 150000.00, 15000.00, 1, 2),
    (3, '2024-03-01 14:30:00', 3, 'Basic Plan payment', 50000.00, 0, 1, 1)
ON CONFLICT DO NOTHING;

-- ========================================
-- EVENTS AND MATCHES
-- ========================================

-- Insert events
INSERT INTO "Event" (id, season_id, venue_id, name, description, date) VALUES
    (1, 1, 1, 'Preparatory Training', 'Training session to prepare for the next match', '2024-01-15'),
    (2, 1, 1, 'Match vs Deportivo Cali', 'League match against Deportivo Cali', '2024-01-20'),
    (3, 1, 1, 'Technical Meeting', 'Pre-match tactical analysis', '2024-01-18')
ON CONFLICT DO NOTHING;

-- Insert match
INSERT INTO "Match" (id, matchday_id, start_time, end_time, date, stadium_id, season_id) VALUES
    (1, 1, '20:00:00', '22:00:00', '2024-01-20', 1, 1)
ON CONFLICT DO NOTHING;

-- Insert participating teams in the match
INSERT INTO "MatchHomeTeam" (match_id, team_id, score) VALUES
    (1, 1, 2)
ON CONFLICT DO NOTHING;

INSERT INTO "MatchAwayTeam" (match_id, team_id, score) VALUES
    (1, 1, 1)
ON CONFLICT DO NOTHING;

-- Insert club participation in events
INSERT INTO "ClubEvent" (id, club_id, event_id) VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- NOTIFICATIONS
-- ========================================

-- Insert notifications
INSERT INTO "Notification" (id, message, sendDate) VALUES
    (1, 'Reminder: Preparatory training scheduled for tomorrow at 4:00 PM at the club facilities.', '2024-01-14 09:00:00'),
    (2, 'Confirmation: Match against Deportivo Cali this Saturday January 20 at 8:00 PM. Please confirm squad attendance.', '2024-01-18 10:00:00'),
    (3, 'Summons: Mandatory technical meeting for all technical staff and starting players.', '2024-01-17 08:00:00')
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
INSERT INTO "Streak" (id, team_id, start_date, end_date) VALUES
    (1, 1, '2024-01-01', null)
ON CONFLICT DO NOTHING;

-- Insert document templates
INSERT INTO "DocumentTemplate" (id, name, description, document_format_id, document_type_id, content, creation) VALUES
    (1, 'Match Summons', 'Template for summoning players', 1, 1, 'Dear player, you are summoned for the match...', '2024-01-01 10:00:00'),
    (2, 'Medical Report', 'Template for medical reports', 1, 2, 'Medical report of player: [NAME]...', '2024-01-01 10:00:00')
ON CONFLICT DO NOTHING;

-- Insert roster-document template relationships
INSERT INTO "RosterDocumentTemplate" (roster_id, document_template_id) VALUES
    (1, 1),
    (1, 2)
ON CONFLICT DO NOTHING;

