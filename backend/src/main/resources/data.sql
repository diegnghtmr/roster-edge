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
    ('PHYSIOTHERAPIST'),
    ('ASSISTANT_COACH'),
    ('ANALYST')
ON CONFLICT DO NOTHING;

-- Player positions (only those used in this seed)
INSERT INTO "PlayerPosition" (name) VALUES
    ('ATTACKING_MIDFIELDER'),
    ('CENTER_FORWARD'),
    ('GOALKEEPER'),
    ('CENTER_BACK'),
    ('LEFT_WINGER'),
    ('DEFENSIVE_MIDFIELDER')
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
    ('Aguilas Doradas FC', 'Fly high, play with honor', '2010-03-15', NOW(), NOW(), TRUE),
    ('Condor Valle FC', 'Rise above the valley', '2012-06-20', NOW(), NOW(), TRUE),
    ('Toro Norte FC', 'Strength from the north', '2008-02-10', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert season
INSERT INTO "Season" (club_id, name, start_date, end_date, created_at, updated_at, active) VALUES
    (1, 'Season 2024', '2024-01-01', '2024-12-31', NOW(), NOW(), TRUE),
    (1, 'Season 2025', '2025-01-01', '2025-12-31', NOW(), NOW(), TRUE),
    (2, 'Valle Championship 2024', '2024-02-01', '2024-11-30', NOW(), NOW(), TRUE),
    (2, 'Valle Championship 2025', '2025-02-01', '2025-11-30', NOW(), NOW(), TRUE),
    (3, 'Apertura 2024', '2024-01-15', '2024-06-15', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert team
INSERT INTO "Team" (name, gender_id, category_id, mascot, foundation, club_id, created_at, updated_at, active) VALUES
    ('Aguilas First Division', 1, 1, 'Golden Eagle', '2010-03-15', 1, NOW(), NOW(), TRUE),
    ('Aguilas Youth Squad', 1, 2, 'Young Eagles', '2015-07-01', 1, NOW(), NOW(), TRUE),
    ('Aguilas Femenino', 2, 1, 'Golden Feathers', '2014-04-05', 1, NOW(), NOW(), TRUE),
    ('Condor Valle A', 1, 1, 'Mountain Condor', '2012-06-20', 2, NOW(), NOW(), TRUE),
    ('Condor Valle Juvenil', 1, 3, 'Rising Condor', '2018-01-10', 2, NOW(), NOW(), TRUE),
    ('Toro Norte Elite', 1, 1, 'Steel Bull', '2008-02-10', 3, NOW(), NOW(), TRUE),
    ('Toro Norte Femenino', 2, 1, 'Northern Stars', '2013-05-22', 3, NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- ========================================
-- COLORS AND VENUES
-- ========================================

-- Insert colors
INSERT INTO "Color" (name) VALUES
    ('Gold'),
    ('Black'),
    ('White'),
    ('Blue'),
    ('Red'),
    ('Green')
ON CONFLICT DO NOTHING;

-- Insert team-color relationships
INSERT INTO "TeamColor" (team_id, color_id) VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 1),
    (3, 3),
    (4, 4),
    (4, 5),
    (5, 4),
    (6, 5),
    (6, 6),
    (7, 3),
    (7, 6)
ON CONFLICT DO NOTHING;

-- Insert venue
INSERT INTO "Venue" (email, city_id, foundation, name, phone, club_id) VALUES
    ('venue@aguilasdoradas.com', 1, '2010-03-15', 'Main Venue Aguilas', '+57044123456', 1),
    ('contacto@condorvalle.com', 4, '2012-06-20', 'Condor Arena', '+57044222333', 2),
    ('info@toronorte.com', 5, '2010-08-20', 'Toro Norte Sports Center', '+57044333444', 3)
ON CONFLICT DO NOTHING;

-- Insert stadium
INSERT INTO "Stadium" (area, surface, total_capacity, foundation, venue_id) VALUES
    (7500.50, 'Natural grass', 25000, '2010-04-01', 1),
    (6800.00, 'Hybrid grass', 18000, '2013-02-01', 2),
    (7200.00, 'Artificial turf', 16000, '2011-09-10', 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- STAFF AND PLAYERS
-- ========================================

-- Insert staff with assigned teams (includes all User fields)
INSERT INTO "Staff" (email, password_hash, name, last_name, city_id, phone, birth_date, hire_date, staff_role_id, team_id) VALUES
    ('doctor@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ana', 'Garcia', 3, '+34612345678', '1982-11-08', '2023-02-01', 2, 1),
    ('physiotherapist@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Carlos', 'Mejia', 1, '+57300111222', '1985-03-15', '2023-03-01', 3, 1),
    ('coach.youth@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Jorge', 'Salazar', 1, '+57305551234', '1988-07-22', '2023-04-10', 1, 2),
    ('assistant.femenino@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Sofia', 'Mendez', 5, '+57306662345', '1990-05-16', '2023-06-01', 4, 3),
    ('coach.condor@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Luis', 'Alvarez', 4, '+57307773456', '1981-01-09', '2023-02-15', 1, 4),
    ('physio.condor@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Maria', 'Villada', 4, '+57308884567', '1987-11-30', '2023-03-20', 3, 4),
    ('coach.juvenil@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Hector', 'Ibanez', 4, '+57309995678', '1992-09-05', '2023-05-12', 1, 5),
    ('analyst.condor@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Camila', 'Soto', 2, '+541145678900', '1993-03-18', '2023-07-01', 5, 5),
    ('coach.toronorte@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ricardo', 'Mora', 5, '+57301114567', '1979-12-12', '2022-12-01', 1, 6),
    ('doctor.toronorte@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Elena', 'Suarez', 5, '+57302225678', '1984-04-28', '2023-01-20', 2, 6),
    ('coach.toronorte.femenino@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Valeria', 'Nieto', 3, '+57303336789', '1991-08-02', '2023-05-25', 1, 7)
ON CONFLICT DO NOTHING;

-- Insert players with assigned teams (includes all User fields)
INSERT INTO "Player" (email, password_hash, name, last_name, city_id, phone, birth_date, physical_state_id, jersey_number, height, dominant_foot, weight, primary_position_id, team_id) VALUES
    ('lionel.martinez@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Lionel', 'Martinez', 1, '+57300987654', '1995-04-10', 1, '10', '175', 'Right', '70', 1, 1),
    ('diego.lopez@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Diego', 'Lopez', 4, '+57301123456', '1997-09-18', 1, '9', '182', 'Left', '75', 2, 1),
    ('santiago.perez@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Santiago', 'Perez', 5, '+57302234567', '1994-12-03', 1, '1', '188', 'Right', '80', 3, 1),
    ('julian.garcia@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Julian', 'Garcia', 2, '+573044556677', '1998-06-25', 1, '7', '180', 'Right', '72', 2, 1),
    ('andres.garcia@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Andres', 'Garcia', 1, '+57305556789', '2000-03-11', 1, '15', '183', 'Right', '78', 4, 2),
    ('manuel.rios@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Manuel', 'Rios', 1, '+57306667890', '2001-07-02', 1, '11', '176', 'Left', '70', 5, 2),
    ('esteban.lara@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Esteban', 'Lara', 5, '+57307778901', '1999-01-30', 1, '1', '185', 'Right', '82', 3, 2),
    ('laura.rojas@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Laura', 'Rojas', 1, '+57308889012', '1996-05-18', 1, '8', '170', 'Right', '60', 1, 3),
    ('paula.diaz@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Paula', 'Diaz', 4, '+57309990123', '1997-09-09', 1, '4', '168', 'Right', '58', 4, 3),
    ('mariana.garcia@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Mariana', 'Garcia', 2, '+57301101234', '1998-12-12', 1, '11', '165', 'Left', '56', 5, 3),
    ('mateo.sanchez@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Mateo', 'Sanchez', 4, '+57302202345', '1995-06-14', 1, '9', '184', 'Right', '79', 2, 4),
    ('sebastian.ruiz@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Sebastian', 'Ruiz', 4, '+57303303456', '1996-10-21', 1, '6', '181', 'Right', '76', 6, 4),
    ('oscar.montoya@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Oscar', 'Montoya', 4, '+57304404567', '1993-02-27', 2, '1', '189', 'Left', '85', 3, 4),
    ('daniel.vargas@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Daniel', 'Vargas', 4, '+57305505678', '2001-01-05', 1, '10', '177', 'Right', '72', 1, 5),
    ('julio.benitez@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Julio', 'Benitez', 2, '+541166167890', '2002-08-08', 1, '5', '180', 'Right', '76', 4, 5),
    ('sergio.cardenas@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Sergio', 'Cardenas', 4, '+57306606789', '2000-11-19', 1, '7', '175', 'Left', '70', 5, 5),
    ('ricardo.ortiz@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ricardo', 'Ortiz', 5, '+57307707890', '1994-04-04', 1, '9', '186', 'Right', '80', 2, 6),
    ('martin.guzman@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Martin', 'Guzman', 5, '+57308808901', '1993-07-13', 3, '8', '182', 'Left', '78', 6, 6),
    ('julio.castro@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Julio', 'Castro', 5, '+57309909012', '1990-09-24', 1, '1', '190', 'Right', '88', 3, 6),
    ('valentina.lopez@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Valentina', 'Lopez', 5, '+57301110123', '1997-03-02', 1, '7', '168', 'Right', '59', 5, 7),
    ('camila.hernandez@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Camila', 'Hernandez', 3, '+57302221234', '1998-06-29', 1, '10', '166', 'Left', '57', 1, 7),
    ('isabela.nieto@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Isabela', 'Nieto', 3, '+57303332345', '1999-12-08', 1, '2', '169', 'Right', '60', 4, 7)
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
    (2, '2024-01-01', '2024-12-31', 1),
    (3, '2025-08-01', '2025-10-28', 1),
    (1, '2025-04-01', '2025-07-31', 2),
    (2, '2025-09-01', '2025-11-15', 1)
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
    ('2024-03-01 14:30:00', 3, 'Basic Plan payment', 50000.00, 0, 1, 1),
    ('2025-08-05 09:45:00', 1, 'Premium Plan quarterly payment', 300000.00, 0, 2, 3),
    ('2025-09-10 11:20:00', 2, 'Professional Plan renewal', 150000.00, 10000.00, 1, 2)
ON CONFLICT DO NOTHING;

-- ========================================
-- EVENTS AND MATCHES
-- ========================================

-- Insert events
INSERT INTO "Event" (season_id, venue_id, name, description, date, created_at, updated_at, active) VALUES
    (1, 1, 'Preparatory Training', 'Training session to prepare for the next match', '2024-01-15', NOW(), NOW(), TRUE),
    (1, 1, 'Match vs Deportivo Cali', 'League match against Deportivo Cali', '2024-01-20', NOW(), NOW(), TRUE),
    (1, 1, 'Technical Meeting', 'Pre-match tactical analysis', '2024-01-18', NOW(), NOW(), TRUE),
    (3, 2, 'Valle Preseason Camp', 'High-altitude training microcycle', '2024-02-10', NOW(), NOW(), TRUE),
    (4, 2, 'Condor Strategy Workshop', 'Season planning workshop', '2025-07-20', NOW(), NOW(), TRUE),
    (5, 3, 'Toro Norte Fitness Test', 'Start of Apertura physical evaluations', '2024-01-20', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert match
INSERT INTO "Match" (id, matchday_id, start_time, end_time, date, stadium_id, season_id) VALUES
    (1, 1, '20:00:00', '22:00:00', '2024-01-20', 1, 1),
    (2, 1, '18:00:00', '20:00:00', '2099-05-15', 1, 1),
    (3, 2, '18:30:00', '20:30:00', '2025-09-25', 2, 4),
    (4, 3, '19:30:00', '21:30:00', '2025-11-05', 2, 4),
    (5, 2, '16:00:00', '18:00:00', '2024-03-12', 3, 5)
ON CONFLICT DO NOTHING;

-- Insert participating teams in the match
INSERT INTO "MatchHomeTeam" (match_id, team_id, score) VALUES
    (1, 1, 2),
    (2, 1, 0),
    (3, 4, 1),
    (4, 4, 0),
    (5, 6, 3)
ON CONFLICT DO NOTHING;

INSERT INTO "MatchAwayTeam" (match_id, team_id, score) VALUES
    (1, 2, 1),
    (2, 2, 0),
    (3, 6, 1),
    (4, 1, 0),
    (5, 7, 2)
ON CONFLICT DO NOTHING;

-- Insert club participation in events
INSERT INTO "ClubEvent" (club_id, event_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (3, 6)
ON CONFLICT DO NOTHING;

-- ========================================
-- NOTIFICATIONS
-- ========================================

-- Insert notifications
INSERT INTO "Notification" (message, send_date) VALUES
    ('Reminder: Preparatory training scheduled for tomorrow at 4:00 PM at the club facilities.', '2024-01-14 09:00:00'),
    ('Confirmation: Match against Deportivo Cali this Saturday January 20 at 8:00 PM. Please confirm squad attendance.', '2024-01-18 10:00:00'),
    ('Summons: Mandatory technical meeting for all technical staff and starting players.', '2024-01-17 08:00:00'),
    ('Recordatorio: Campamento de pretemporada Condor Valle inicia el 10 de febrero.', '2024-02-05 09:30:00'),
    ('Alerta: Taller estratégico Condor Valle programado para el 20 de julio.', '2025-07-10 08:45:00'),
    ('Aviso: Evaluaciones físicas Toro Norte comienzan el 20 de enero.', '2024-01-15 07:15:00')
ON CONFLICT DO NOTHING;

-- Insert notification-club event relationships
INSERT INTO "NotificationClubEvent" (notification_id, club_event_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6)
ON CONFLICT DO NOTHING;

-- ========================================
-- STREAKS AND DOCUMENT TEMPLATES
-- ========================================

-- Insert team streak
INSERT INTO "Streak" (team_id, start_date, end_date) VALUES
    (1, '2024-01-01', null),
    (4, '2024-08-01', '2024-09-20'),
    (6, '2024-10-01', null)
ON CONFLICT DO NOTHING;

-- Insert document templates
INSERT INTO "DocumentTemplate" (name, description, document_format_id, document_type_id, content, creation) VALUES
    ('Match Summons', 'Template for summoning players', 1, 1, 'Dear player, you are summoned for the match...', '2024-01-01 10:00:00'),
    ('Medical Report', 'Template for medical reports', 1, 2, 'Medical report of player: [NAME]...', '2024-01-01 10:00:00'),
    ('Scouting Report', 'Template for scouting observations', 1, 3, 'Scouting notes for rival club: [CLUB]...', '2024-05-10 14:30:00')
ON CONFLICT DO NOTHING;

-- Insert roster-document template relationships
INSERT INTO "RosterDocumentTemplate" (roster_id, document_template_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3)
ON CONFLICT DO NOTHING;
