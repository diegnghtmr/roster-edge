-- ========================================
-- EXPANDED SAMPLE DATA FOR ROSTER EDGE (4x)
-- ========================================
-- Default password for all users: password123
-- Hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- ========================================

-- ========================================
-- CATALOGS (replacement for ENUMs)
-- ========================================

-- Team categories
INSERT INTO "TeamCategory" (name) VALUES
    ('FIRST_DIVISION'),
    ('RESERVE'),
    ('UNDER_20'),
    ('UNDER_17'),
    ('ACADEMY')
ON CONFLICT DO NOTHING;

-- Team genders
INSERT INTO "TeamGender" (name) VALUES
    ('MALE'),
    ('FEMALE'),
    ('MIXED')
ON CONFLICT DO NOTHING;

-- Staff roles
INSERT INTO "StaffRole" (name) VALUES
    ('COACH'),
    ('DOCTOR'),
    ('PHYSIOTHERAPIST'),
    ('ASSISTANT_COACH'),
    ('ANALYST'),
    ('NUTRITIONIST'),
    ('GOALKEEPER_COACH'),
    ('FITNESS_COACH')
ON CONFLICT DO NOTHING;

-- Player positions
INSERT INTO "PlayerPosition" (name) VALUES
    ('ATTACKING_MIDFIELDER'),
    ('CENTER_FORWARD'),
    ('GOALKEEPER'),
    ('CENTER_BACK'),
    ('LEFT_WINGER'),
    ('DEFENSIVE_MIDFIELDER'),
    ('RIGHT_BACK'),
    ('LEFT_BACK'),
    ('RIGHT_WINGER'),
    ('STRIKER')
ON CONFLICT DO NOTHING;

-- Subscription statuses
INSERT INTO "SubscriptionStatus" (name) VALUES
    ('ACTIVE'),
    ('INACTIVE'),
    ('SUSPENDED'),
    ('TRIAL')
ON CONFLICT DO NOTHING;

-- Payment methods
INSERT INTO "PaymentMethod" (name) VALUES
    ('CREDIT_CARD'),
    ('PSE'),
    ('NEQUI'),
    ('BANK_TRANSFER'),
    ('CASH')
ON CONFLICT DO NOTHING;

-- Physical states of players
INSERT INTO "PhysicalState" (name) VALUES
    ('Available'),
    ('Injured'),
    ('In recovery'),
    ('Suspended'),
    ('Not available'),
    ('On loan'),
    ('Resting')
ON CONFLICT DO NOTHING;

-- Competition matchdays
INSERT INTO "Matchday" (name, description) VALUES
    ('Matchday 1', 'First matchday of the regular season'),
    ('Matchday 2', 'Second matchday of the regular season'),
    ('Matchday 3', 'Third matchday of the regular season'),
    ('Matchday 4', 'Fourth matchday of the regular season'),
    ('Matchday 5', 'Fifth matchday of the regular season'),
    ('Matchday 6', 'Sixth matchday of the regular season'),
    ('Matchday 7', 'Seventh matchday of the regular season'),
    ('Matchday 8', 'Eighth matchday of the regular season'),
    ('Round of 16', 'Round of sixteen phase'),
    ('Quarter Finals', 'Quarter finals phase'),
    ('Semi Finals', 'Semi finals phase'),
    ('Final', 'Tournament final match')
ON CONFLICT DO NOTHING;

-- Currencies
INSERT INTO "Currency" (name, symbol) VALUES
    ('Colombian Peso', 'COP'),
    ('US Dollar', 'USD'),
    ('Euro', 'EUR'),
    ('Argentine Peso', 'ARS')
ON CONFLICT DO NOTHING;

-- Countries
INSERT INTO "Country" (name) VALUES
    ('Colombia'),
    ('Argentina'),
    ('Spain'),
    ('Brazil'),
    ('Mexico'),
    ('Chile')
ON CONFLICT DO NOTHING;

-- Cities
INSERT INTO "City" (name, country_id) VALUES
    ('Medellin', 1),
    ('Buenos Aires', 2),
    ('Madrid', 3),
    ('Cali', 1),
    ('Bogota', 1),
    ('Barranquilla', 1),
    ('Cartagena', 1),
    ('Rosario', 2),
    ('Barcelona', 3),
    ('Sao Paulo', 4),
    ('Mexico City', 5),
    ('Santiago', 6)
ON CONFLICT DO NOTHING;

-- ========================================
-- CLUB STRUCTURE
-- ========================================

INSERT INTO "Club" (name, motto, foundation, created_at, updated_at, active) VALUES
    ('Aguilas Doradas FC', 'Fly high, play with honor', '2010-03-15', NOW(), NOW(), TRUE),
    ('Condor Valle FC', 'Rise above the valley', '2012-06-20', NOW(), NOW(), TRUE),
    ('Toro Norte FC', 'Strength from the north', '2008-02-10', NOW(), NOW(), TRUE),
    ('Pumas del Caribe', 'Roar of the Caribbean', '2015-05-12', NOW(), NOW(), TRUE),
    ('Leones de la Montaña', 'Pride of the highlands', '2011-08-30', NOW(), NOW(), TRUE),
    ('Tiburones del Pacífico', 'Sharks never sleep', '2009-11-22', NOW(), NOW(), TRUE),
    ('Dragones Buenos Aires', 'Fire and passion', '2013-04-18', NOW(), NOW(), TRUE),
    ('Halcones de Rosario', 'Swift and precise', '2014-07-25', NOW(), NOW(), TRUE),
    ('Real Madrid Legends', 'Honor and glory', '2010-01-01', NOW(), NOW(), TRUE),
    ('Barcelona Unidos', 'More than a club', '2011-09-15', NOW(), NOW(), TRUE),
    ('Jaguares Paulistas', 'Speed and strength', '2016-03-08', NOW(), NOW(), TRUE),
    ('Aztecas Mexico', 'Ancient warriors', '2017-06-14', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert seasons
INSERT INTO "Season" (club_id, name, start_date, end_date, created_at, updated_at, active) VALUES
    (1, 'Season 2024', '2024-01-01', '2024-12-31', NOW(), NOW(), TRUE),
    (1, 'Season 2025', '2025-01-01', '2025-12-31', NOW(), NOW(), TRUE),
    (2, 'Valle Championship 2024', '2024-02-01', '2024-11-30', NOW(), NOW(), TRUE),
    (2, 'Valle Championship 2025', '2025-02-01', '2025-11-30', NOW(), NOW(), TRUE),
    (3, 'Apertura 2024', '2024-01-15', '2024-06-15', NOW(), NOW(), TRUE),
    (3, 'Clausura 2024', '2024-07-01', '2024-12-20', NOW(), NOW(), TRUE),
    (4, 'Caribe Season 2024', '2024-03-01', '2024-12-15', NOW(), NOW(), TRUE),
    (4, 'Caribe Season 2025', '2025-03-01', '2025-12-15', NOW(), NOW(), TRUE),
    (5, 'Mountain League 2024', '2024-02-15', '2024-11-25', NOW(), NOW(), TRUE),
    (5, 'Mountain League 2025', '2025-02-15', '2025-11-25', NOW(), NOW(), TRUE),
    (6, 'Pacific Cup 2024', '2024-04-01', '2024-12-10', NOW(), NOW(), TRUE),
    (6, 'Pacific Cup 2025', '2025-04-01', '2025-12-10', NOW(), NOW(), TRUE),
    (7, 'Liga Argentina 2024', '2024-02-20', '2024-12-05', NOW(), NOW(), TRUE),
    (8, 'Torneo Rosario 2024', '2024-03-10', '2024-11-20', NOW(), NOW(), TRUE),
    (9, 'La Liga 2024', '2024-08-01', '2025-05-31', NOW(), NOW(), TRUE),
    (10, 'Copa Catalunya 2024', '2024-09-01', '2025-06-15', NOW(), NOW(), TRUE),
    (11, 'Brasileirão 2024', '2024-05-01', '2024-12-30', NOW(), NOW(), TRUE),
    (11, 'Brasileirão 2025', '2025-05-01', '2025-12-30', NOW(), NOW(), TRUE),
    (12, 'Liga MX Apertura 2024', '2024-07-15', '2024-12-22', NOW(), NOW(), TRUE),
    (12, 'Liga MX Clausura 2025', '2025-01-10', '2025-06-30', NOW(), NOW(), TRUE),
    (7, 'Liga Argentina 2025', '2025-02-20', '2025-12-05', NOW(), NOW(), TRUE),
    (8, 'Torneo Rosario 2025', '2025-03-10', '2025-12-10', NOW(), NOW(), TRUE),
    (9, 'La Liga 2025', '2025-08-01', '2026-05-31', NOW(), NOW(), TRUE),
    (10, 'Copa Catalunya 2025', '2025-09-01', '2026-06-15', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert teams - Expanded (28 teams total, ~2-3 per club)
INSERT INTO "Team" (name, gender_id, category_id, mascot, foundation, club_id, created_at, updated_at, active) VALUES
    -- Original teams (1-7)
    ('Aguilas First Division', 1, 1, 'Golden Eagle', '2010-03-15', 1, NOW(), NOW(), TRUE),
    ('Aguilas Youth Squad', 1, 2, 'Young Eagles', '2015-07-01', 1, NOW(), NOW(), TRUE),
    ('Aguilas Femenino', 2, 1, 'Golden Feathers', '2014-04-05', 1, NOW(), NOW(), TRUE),
    ('Condor Valle A', 1, 1, 'Mountain Condor', '2012-06-20', 2, NOW(), NOW(), TRUE),
    ('Condor Valle Juvenil', 1, 3, 'Rising Condor', '2018-01-10', 2, NOW(), NOW(), TRUE),
    ('Toro Norte Elite', 1, 1, 'Steel Bull', '2008-02-10', 3, NOW(), NOW(), TRUE),
    ('Toro Norte Femenino', 2, 1, 'Northern Stars', '2013-05-22', 3, NOW(), NOW(), TRUE),
    ('Pumas Caribe Primera', 1, 1, 'Caribbean Puma', '2015-05-12', 4, NOW(), NOW(), TRUE),
    ('Pumas Caribe Sub-20', 1, 3, 'Young Pumas', '2017-09-05', 4, NOW(), NOW(), TRUE),
    ('Pumas Femenino', 2, 1, 'Puma Queens', '2018-03-10', 4, NOW(), NOW(), TRUE),
    ('Leones Elite', 1, 1, 'Mountain Lion', '2011-08-30', 5, NOW(), NOW(), TRUE),
    ('Leones Reserva', 1, 2, 'Lion Cubs', '2013-11-12', 5, NOW(), NOW(), TRUE),
    ('Tiburones Pacífico A', 1, 1, 'Great White', '2009-11-22', 6, NOW(), NOW(), TRUE),
    ('Tiburones Femenino', 2, 1, 'Pacific Sharks', '2012-07-08', 6, NOW(), NOW(), TRUE),
    ('Dragones BA Primera', 1, 1, 'Fire Dragon', '2013-04-18', 7, NOW(), NOW(), TRUE),
    ('Dragones BA Juvenil', 1, 3, 'Dragon Youth', '2015-08-22', 7, NOW(), NOW(), TRUE),
    ('Halcones Rosario A', 1, 1, 'Swift Hawk', '2014-07-25', 8, NOW(), NOW(), TRUE),
    ('Halcones Femenino', 2, 1, 'Lady Hawks', '2016-05-30', 8, NOW(), NOW(), TRUE),
    ('Madrid Legends Primera', 1, 1, 'Royal Eagle', '2010-01-01', 9, NOW(), NOW(), TRUE),
    ('Madrid Legends Femenino', 2, 1, 'Queens of Madrid', '2011-06-20', 9, NOW(), NOW(), TRUE),
    ('Barcelona Unidos A', 1, 1, 'Barça Lion', '2011-09-15', 10, NOW(), NOW(), TRUE),
    ('Barcelona Unidos Juvenil', 1, 3, 'La Masia', '2012-10-05', 10, NOW(), NOW(), TRUE),
    ('Barcelona Unidos Femenino', 2, 1, 'Blaugrana Women', '2013-04-12', 10, NOW(), NOW(), TRUE),
    ('Jaguares Paulistas A', 1, 1, 'Onça Pintada', '2016-03-08', 11, NOW(), NOW(), TRUE),
    ('Jaguares Juvenil', 1, 3, 'Young Jaguars', '2017-11-20', 11, NOW(), NOW(), TRUE),
    ('Aztecas MX Primera', 1, 1, 'Warrior Eagle', '2017-06-14', 12, NOW(), NOW(), TRUE),
    ('Aztecas MX Femenino', 2, 1, 'Aztec Queens', '2018-09-09', 12, NOW(), NOW(), TRUE),
    ('Aztecas MX Sub-17', 1, 4, 'Future Warriors', '2019-02-15', 12, NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- ========================================
-- COLORS AND VENUES
-- ========================================

INSERT INTO "Color" (name) VALUES
    ('Gold'),
    ('Black'),
    ('White'),
    ('Blue'),
    ('Red'),
    ('Green'),
    ('Purple'),
    ('Orange'),
    ('Yellow'),
    ('Navy'),
    ('Silver')
ON CONFLICT DO NOTHING;

-- Team-color relationships - Expanded
INSERT INTO "TeamColor" (team_id, color_id) VALUES
    -- Original
    (1, 1), (1, 2), (2, 3), (3, 1), (3, 3), (4, 4), (4, 5),
    (5, 4), (6, 5), (6, 6), (7, 3), (7, 6),
    -- New teams
    (8, 9), (8, 2), (9, 9), (9, 3), (10, 7), (10, 3),
    (11, 6), (11, 9), (12, 6), (12, 2), (13, 4), (13, 10),
    (14, 4), (14, 3), (15, 5), (15, 2), (16, 4), (16, 5),
    (17, 4), (17, 1), (18, 7), (18, 3), (19, 3), (19, 1),
    (20, 7), (20, 5), (21, 4), (21, 5), (22, 4), (22, 9),
    (23, 4), (23, 5), (24, 6), (24, 9), (25, 6), (25, 2),
    (26, 5), (26, 6), (27, 5), (27, 3), (28, 5), (28, 9)
ON CONFLICT DO NOTHING;

-- Insert venues - Expanded (12 venues)
INSERT INTO "Venue" (email, city_id, foundation, name, phone, club_id) VALUES
    ('venue@aguilasdoradas.com', 1, '2010-03-15', 'Main Venue Aguilas', '+57044123456', 1),
    ('contacto@condorvalle.com', 4, '2012-06-20', 'Condor Arena', '+57044222333', 2),
    ('info@toronorte.com', 5, '2010-08-20', 'Toro Norte Sports Center', '+57044333444', 3),
    ('venue@pumascaribe.com', 6, '2015-05-12', 'Caribbean Stadium', '+57045444555', 4),
    ('estadio@leonesmontana.com', 1, '2011-08-30', 'Mountain Fortress', '+57045555666', 5),
    ('pacific@tiburones.com', 4, '2009-11-22', 'Pacific Arena', '+57045666777', 6),
    ('estadio@dragonesba.com', 2, '2013-04-18', 'Dragon Pit', '+5411222333', 7),
    ('venue@halconesrosario.com', 8, '2014-07-25', 'Halcones Stadium', '+5411333444', 8),
    ('estadio@madridlegends.com', 3, '2010-01-01', 'Santiago Bernabéu Legacy', '+34911222333', 9),
    ('venue@barcelonaunidos.com', 9, '2011-09-15', 'Camp Nou United', '+34933444555', 10),
    ('arena@jaguarespaulistas.com', 10, '2016-03-08', 'Morumbi Arena', '+55112233445', 11),
    ('estadio@aztecasmx.com', 11, '2017-06-14', 'Azteca Stadium', '+52555666777', 12)
ON CONFLICT DO NOTHING;

-- Insert stadiums - Expanded (12 stadiums)
INSERT INTO "Stadium" (area, surface, total_capacity, foundation, venue_id) VALUES
    (7500.50, 'Natural grass', 25000, '2010-04-01', 1),
    (6800.00, 'Hybrid grass', 18000, '2013-02-01', 2),
    (7200.00, 'Artificial turf', 16000, '2011-09-10', 3),
    (8100.00, 'Natural grass', 22000, '2015-06-15', 4),
    (7900.00, 'Hybrid grass', 20000, '2011-10-12', 5),
    (6500.00, 'Natural grass', 15000, '2009-12-20', 6),
    (8500.00, 'Hybrid grass', 30000, '2013-06-10', 7),
    (6900.00, 'Artificial turf', 17000, '2014-09-22', 8),
    (9200.00, 'Hybrid grass', 45000, '2010-03-15', 9),
    (9500.00, 'Natural grass', 50000, '2011-11-20', 10),
    (8800.00, 'Hybrid grass', 35000, '2016-05-05', 11),
    (10500.00, 'Natural grass', 55000, '2017-08-18', 12)
ON CONFLICT DO NOTHING;

-- ========================================
-- STAFF 
-- ========================================

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
    ('coach.toronorte.femenino@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Valeria', 'Nieto', 3, '+57303336789', '1991-08-02', '2023-05-25', 1, 7),
    ('coach.pumas@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Roberto', 'Martinez', 6, '+57310111222', '1980-03-20', '2023-01-15', 1, 8),
    ('physio.pumas@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Diana', 'Castillo', 6, '+57310222333', '1986-06-14', '2023-02-20', 3, 8),
    ('coach.leones@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Fernando', 'Rios', 1, '+57310333444', '1983-09-08', '2023-03-10', 1, 11),
    ('doctor.leones@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Patricia', 'Vargas', 1, '+57310444555', '1985-12-25', '2023-04-05', 2, 11),
    ('coach.tiburones@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Andres', 'Mora', 4, '+57310555666', '1978-05-30', '2023-02-28', 1, 13),
    ('fitness.tiburones@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Lucia', 'Perez', 4, '+57310666777', '1989-11-11', '2023-03-15', 8, 13),
    ('coach.dragones@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Gustavo', 'Fernandez', 2, '+5411777888', '1977-07-07', '2023-01-10', 1, 15),
    ('assistant.dragones@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Sandra', 'Lopez', 2, '+5411888999', '1988-02-18', '2023-02-14', 4, 15),
    ('coach.halcones@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Pablo', 'Gonzalez', 8, '+5411999000', '1982-04-22', '2023-03-01', 1, 17),
    ('physio.halcones@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Florencia', 'Ruiz', 8, '+5411000111', '1990-08-08', '2023-04-10', 3, 17),
    ('coach.madrid@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Miguel', 'Torres', 3, '+34911333444', '1975-10-10', '2023-01-05', 1, 19),
    ('analyst.madrid@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Isabel', 'Santos', 3, '+34911444555', '1987-12-12', '2023-02-08', 5, 19),
    ('coach.barcelona@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Josep', 'Vila', 9, '+34933555666', '1976-03-03', '2023-01-12', 1, 21),
    ('doctor.barcelona@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Montserrat', 'Pujol', 9, '+34933666777', '1984-07-20', '2023-02-15', 2, 21),
    ('coach.jaguares@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Carlos', 'Silva', 10, '+5511333444', '1979-11-15', '2023-03-20', 1, 24),
    ('physio.jaguares@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ana', 'Costa', 10, '+5511444555', '1986-05-05', '2023-04-12', 3, 24),
    ('coach.aztecas@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Juan', 'Ramirez', 11, '+52555777888', '1981-09-09', '2023-02-22', 1, 26),
    ('fitness.aztecas@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Rosa', 'Hernandez', 11, '+52555888999', '1988-01-01', '2023-03-18', 8, 26),
    ('gk.coach1@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Pedro', 'Gomez', 1, '+57311111222', '1984-06-15', '2023-05-01', 7, 1),
    ('nutritionist1@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Gabriela', 'Ortiz', 4, '+57311222333', '1991-03-22', '2023-06-10', 6, 4),
    ('assistant2@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Manuel', 'Beltran', 6, '+57311333444', '1989-08-17', '2023-07-15', 4, 9),
    ('analyst2@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Laura', 'Jimenez', 1, '+57311444555', '1992-12-01', '2023-08-20', 5, 12)
ON CONFLICT DO NOTHING;

-- ========================================
-- PLAYERS - EXPANDED (88 players total, ~3-4 per team)
-- ========================================

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
    ('isabela.nieto@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Isabela', 'Nieto', 3, '+57303332345', '1999-12-08', 1, '2', '169', 'Right', '60', 4, 7),
    ('jose.martinez@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Jose', 'Martinez', 6, '+57320111222', '1996-02-14', 1, '10', '178', 'Right', '73', 1, 8),
    ('luis.rodriguez@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Luis', 'Rodriguez', 6, '+57320222333', '1995-07-20', 1, '9', '181', 'Left', '76', 2, 8),
    ('carlos.herrera@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Carlos', 'Herrera', 6, '+57320333444', '1994-11-30', 1, '1', '187', 'Right', '82', 3, 8),
    ('miguel.torres@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Miguel', 'Torres', 7, '+57320444555', '1997-05-18', 1, '5', '180', 'Right', '75', 4, 8),
    ('pedro.santos@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Pedro', 'Santos', 6, '+57320555666', '2003-03-10', 1, '11', '175', 'Left', '68', 5, 9),
    ('juan.morales@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Juan', 'Morales', 6, '+57320666777', '2004-08-22', 1, '8', '177', 'Right', '71', 1, 9),
    ('david.castro@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'David', 'Castro', 7, '+57320777888', '2003-12-05', 1, '1', '183', 'Right', '78', 3, 9),
    ('sofia.ramirez@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Sofia', 'Ramirez', 6, '+57320888999', '1998-06-15', 1, '10', '167', 'Right', '58', 1, 10),
    ('diana.velasquez@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Diana', 'Velasquez', 7, '+57320999000', '1997-11-28', 1, '7', '165', 'Left', '56', 5, 10),
    ('carolina.mendez@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Carolina', 'Mendez', 6, '+57321000111', '1999-04-12', 1, '4', '169', 'Right', '59', 4, 10),
    ('alex.sanchez@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Alex', 'Sanchez', 1, '+57321111222', '1995-01-25', 1, '9', '185', 'Right', '80', 2, 11),
    ('raul.rivera@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Raul', 'Rivera', 1, '+57321222333', '1996-09-10', 1, '10', '179', 'Left', '74', 1, 11),
    ('oscar.lopez@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Oscar', 'Lopez', 5, '+57321333444', '1993-05-05', 1, '1', '189', 'Right', '84', 3, 11),
    ('andres.muñoz@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Andres', 'Muñoz', 1, '+57321444555', '1997-12-20', 1, '6', '182', 'Right', '77', 6, 11),
    ('javier.perez@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Javier', 'Perez', 1, '+57321555666', '2000-07-14', 1, '7', '176', 'Right', '70', 5, 12),
    ('pablo.gomez@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Pablo', 'Gomez', 5, '+57321666777', '2001-02-28', 1, '11', '174', 'Left', '69', 9, 12),
    ('felipe.ruiz@leonesmontana.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Felipe', 'Ruiz', 1, '+57321777888', '1999-10-16', 1, '1', '186', 'Right', '81', 3, 12),
    ('jorge.silva@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Jorge', 'Silva', 4, '+57321888999', '1994-04-08', 1, '9', '183', 'Right', '78', 10, 13),
    ('gabriel.ramos@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Gabriel', 'Ramos', 4, '+57321999000', '1995-08-19', 1, '10', '177', 'Left', '72', 1, 13),
    ('nelson.vargas@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Nelson', 'Vargas', 4, '+57322000111', '1992-12-03', 1, '1', '190', 'Right', '86', 3, 13),
    ('mario.diaz@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Mario', 'Diaz', 4, '+57322111222', '1996-06-22', 1, '4', '181', 'Right', '76', 4, 13),
    ('andrea.lopez@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Andrea', 'Lopez', 4, '+57322222333', '1997-03-15', 1, '9', '168', 'Right', '59', 2, 14),
    ('natalia.garcia@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Natalia', 'Garcia', 4, '+57322333444', '1998-09-30', 1, '10', '166', 'Left', '57', 1, 14),
    ('jessica.martinez@tiburonespac.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Jessica', 'Martinez', 4, '+57322444555', '1996-11-11', 1, '7', '170', 'Right', '60', 5, 14),
    ('matias.fernandez@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Matias', 'Fernandez', 2, '+5411111222', '1994-05-20', 1, '10', '180', 'Right', '75', 1, 15),
    ('lucas.gonzalez@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Lucas', 'Gonzalez', 2, '+5411222333', '1996-01-12', 1, '9', '184', 'Left', '79', 2, 15),
    ('franco.torres@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Franco', 'Torres', 2, '+5411333444', '1993-08-28', 1, '1', '188', 'Right', '83', 3, 15),
    ('ezequiel.rodriguez@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ezequiel', 'Rodriguez', 2, '+5411444555', '1997-04-16', 1, '5', '179', 'Right', '74', 6, 15),
    ('tomas.silva@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Tomas', 'Silva', 2, '+5411555666', '2002-06-10', 1, '11', '176', 'Right', '71', 9, 16),
    ('agustin.morales@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Agustin', 'Morales', 2, '+5411666777', '2003-11-25', 1, '7', '175', 'Left', '69', 5, 16),
    ('valentino.lopez@dragonesba.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Valentino', 'Lopez', 8, '+5411777888', '2004-03-08', 1, '1', '182', 'Right', '77', 3, 16),
    ('facu.martinez@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Facundo', 'Martinez', 8, '+5411888999', '1995-07-05', 1, '9', '182', 'Right', '77', 2, 17),
    ('nico.perez@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Nicolas', 'Perez', 8, '+5411999000', '1994-12-14', 1, '10', '178', 'Left', '73', 1, 17),
    ('mauro.garcia@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Mauro', 'Garcia', 8, '+5411000111', '1992-09-22', 1, '1', '189', 'Right', '85', 3, 17),
    ('ramiro.diaz@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ramiro', 'Diaz', 8, '+5411111222', '1996-05-30', 1, '6', '180', 'Right', '75', 6, 17),
    ('martina.suarez@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Martina', 'Suarez', 8, '+5411222333', '1997-02-18', 1, '10', '169', 'Right', '60', 1, 18),
    ('julieta.fernandez@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Julieta', 'Fernandez', 8, '+5411333444', '1998-08-07', 1, '9', '167', 'Left', '58', 2, 18),
    ('agustina.lopez@halconesrosario.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Agustina', 'Lopez', 8, '+5411444555', '1999-12-20', 1, '4', '170', 'Right', '61', 4, 18),
    ('sergio.ramos@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Sergio', 'Ramos', 3, '+34911555666', '1986-03-30', 1, '4', '184', 'Right', '82', 4, 19),
    ('karim.benzema@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Karim', 'Benzema', 3, '+34911666777', '1987-12-19', 1, '9', '185', 'Right', '81', 2, 19),
    ('luka.modric@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Luka', 'Modric', 3, '+34911777888', '1985-09-09', 1, '10', '172', 'Right', '66', 1, 19),
    ('thibaut.courtois@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Thibaut', 'Courtois', 3, '+34911888999', '1992-05-11', 1, '1', '199', 'Left', '96', 3, 19),
    ('alexia.putellas@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Alexia', 'Putellas', 3, '+34911999000', '1994-02-04', 1, '11', '169', 'Left', '58', 1, 20),
    ('aitana.bonmati@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Aitana', 'Bonmati', 3, '+34912000111', '1998-01-18', 1, '14', '166', 'Right', '56', 1, 20),
    ('jennifer.hermoso@madridlegends.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Jennifer', 'Hermoso', 3, '+34912111222', '1990-05-09', 1, '10', '173', 'Left', '61', 2, 20),
    ('pedri.gonzalez@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Pedri', 'Gonzalez', 9, '+34933777888', '2002-11-25', 1, '8', '174', 'Right', '60', 1, 21),
    ('gavi.paez@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Gavi', 'Paez', 9, '+34933888999', '2004-08-05', 1, '6', '173', 'Right', '69', 6, 21),
    ('robert.lewandowski@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Robert', 'Lewandowski', 9, '+34933999000', '1988-08-21', 1, '9', '185', 'Right', '81', 2, 21),
    ('marc.terstegen@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Marc', 'Ter Stegen', 9, '+34934000111', '1992-04-30', 1, '1', '187', 'Right', '85', 3, 21),
    ('ansu.fati@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Ansu', 'Fati', 9, '+34934111222', '2002-10-31', 1, '10', '178', 'Right', '66', 9, 22),
    ('lamine.yamal@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Lamine', 'Yamal', 9, '+34934222333', '2007-07-13', 1, '27', '180', 'Left', '73', 9, 22),
    ('fermin.lopez@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Fermin', 'Lopez', 9, '+34934333444', '2003-05-11', 1, '16', '176', 'Right', '71', 1, 22),
    ('caroline.graham@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Caroline', 'Graham', 9, '+34934444555', '1995-02-07', 1, '21', '169', 'Right', '58', 1, 23),
    ('fridolina.rolfo@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Fridolina', 'Rolfo', 9, '+34934555666', '1993-11-24', 1, '16', '175', 'Left', '63', 5, 23),
    ('salma.paralluelo@barcelonaunidos.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Salma', 'Paralluelo', 9, '+34934666777', '2003-11-13', 1, '7', '171', 'Right', '59', 9, 23),
    ('neymar.junior@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Neymar', 'Junior', 10, '+5511555666', '1992-02-05', 1, '11', '175', 'Right', '68', 9, 24),
    ('gabriel.barbosa@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Gabriel', 'Barbosa', 10, '+5511666777', '1996-08-30', 1, '9', '178', 'Left', '73', 2, 24),
    ('casemiro.silva@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Casemiro', 'Silva', 10, '+5511777888', '1992-02-23', 1, '5', '185', 'Right', '84', 6, 24),
    ('alisson.becker@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Alisson', 'Becker', 10, '+5511888999', '1992-10-02', 1, '1', '193', 'Right', '91', 3, 24),
    ('vinicius.junior@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Vinicius', 'Junior', 10, '+5511999000', '2000-07-12', 1, '7', '176', 'Right', '73', 9, 25),
    ('rodrygo.goes@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Rodrygo', 'Goes', 10, '+5512000111', '2001-01-09', 1, '21', '174', 'Right', '64', 9, 25),
    ('endrick.felipe@jaguarespaulistas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Endrick', 'Felipe', 10, '+5512111222', '2006-07-21', 1, '9', '173', 'Left', '71', 10, 25),
    ('raul.jimenez@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Raul', 'Jimenez', 11, '+52555888999', '1991-05-05', 1, '9', '191', 'Right', '91', 2, 26),
    ('hirving.lozano@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Hirving', 'Lozano', 11, '+52555999000', '1995-07-30', 1, '11', '178', 'Right', '70', 9, 26),
    ('guillermo.ochoa@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Guillermo', 'Ochoa', 11, '+52556000111', '1985-07-13', 1, '1', '185', 'Right', '76', 3, 26),
    ('andres.guardado@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Andres', 'Guardado', 11, '+52556111222', '1986-09-28', 1, '18', '169', 'Left', '65', 6, 26),
    ('stephany.mayor@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Stephany', 'Mayor', 11, '+52556222333', '1996-04-08', 1, '10', '165', 'Right', '58', 1, 27),
    ('katty.martinez@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Katty', 'Martinez', 11, '+52556333444', '1994-11-17', 1, '9', '168', 'Left', '60', 2, 27),
    ('scarlett.camberos@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Scarlett', 'Camberos', 11, '+52556444555', '2001-02-20', 1, '16', '172', 'Right', '62', 1, 27),
    ('santiago.munoz@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Santiago', 'Munoz', 11, '+52556555666', '2007-03-14', 1, '9', '174', 'Right', '68', 10, 28),
    ('cesar.huerta@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Cesar', 'Huerta', 11, '+52556666777', '2006-08-29', 1, '14', '172', 'Left', '66', 9, 28),
    ('israel.reyes@aztecasmx.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831831c08c8fa822809f74c720a9', 'Israel', 'Reyes', 11, '+52556777888', '2007-12-05', 1, '4', '178', 'Right', '72', 4, 28)
ON CONFLICT DO NOTHING;

-- Mark some players as inactive to create more realistic data (about 10-15% inactive)
UPDATE "Player" SET active = FALSE WHERE email IN (
    'oscar.montoya@condorvalle.com',  -- Team 4 - Injured
    'martin.guzman@toronorte.com',    -- Team 6 - In recovery
    'javier.perez@leonesmontana.com', -- Team 12 - Suspended
    'pablo.gomez@leonesmontana.com',  -- Team 12 - On loan
    'nelson.vargas@tiburonespac.com', -- Team 13 - Resting
    'lucas.gonzalez@dragonesba.com',  -- Team 15 - Injured
    'martin.suarez@halconesrosario.com', -- Team 18 - In recovery
    'karim.benzema@madridlegends.com',   -- Team 19 - Resting
    'lionel.messi@bcnunidos.com',        -- Team 21 - Suspended
    'andres.guardado@aztecasmx.com'      -- Team 26 - On loan
);

-- Update physical states for variety in reports (1=Available, 2=Injured, 3=In recovery, 4=Suspended, 5=Not available, 6=On loan, 7=Resting)
UPDATE "Player" SET physical_state_id = 2 WHERE email IN (
    'oscar.montoya@condorvalle.com',
    'lucas.gonzalez@dragonesba.com',
    'julio.castro@toronorte.com',
    'mario.diaz@tiburonespac.com'
);

UPDATE "Player" SET physical_state_id = 3 WHERE email IN (
    'martin.guzman@toronorte.com',
    'martin.suarez@halconesrosario.com',
    'felipe.ruiz@leonesmontana.com'
);

UPDATE "Player" SET physical_state_id = 4 WHERE email IN (
    'javier.perez@leonesmontana.com',
    'lionel.messi@bcnunidos.com'
);

UPDATE "Player" SET physical_state_id = 5 WHERE email IN (
    'sergio.cardenas@condorvalle.com'
);

UPDATE "Player" SET physical_state_id = 6 WHERE email IN (
    'pablo.gomez@leonesmontana.com',
    'andres.guardado@aztecasmx.com'
);

UPDATE "Player" SET physical_state_id = 7 WHERE email IN (
    'nelson.vargas@tiburonespac.com',
    'karim.benzema@madridlegends.com'
);

-- ========================================
-- PLANS AND SUBSCRIPTIONS
-- ========================================

INSERT INTO "Plan" (name, description, price) VALUES
    ('Basic Plan', 'Basic plan for small clubs', 50000.00),
    ('Professional Plan', 'Complete plan for professional clubs', 150000.00),
    ('Premium Plan', 'Premium plan with all functionalities', 300000.00),
    ('Enterprise Plan', 'Custom solution for large organizations', 500000.00)
ON CONFLICT DO NOTHING;

INSERT INTO "PlanBenefit" (plan_id, description) VALUES
    (1, 'Team management'),
    (1, 'Basic statistics'),
    (2, 'Advanced management'),
    (2, 'Detailed reports'),
    (2, 'Tactical analysis'),
    (3, 'Complete functionalities'),
    (3, 'Priority support'),
    (3, 'Integrations'),
    (4, 'Multi-club management'),
    (4, '24/7 Premium support'),
    (4, 'Custom integrations'),
    (4, 'Advanced analytics AI')
ON CONFLICT DO NOTHING;

INSERT INTO "Subscription" (plan_id, start_date, end_date, status_id) VALUES
    (2, '2024-01-01', '2024-12-31', 1),
    (3, '2025-08-01', '2025-10-28', 1),
    (1, '2025-04-01', '2025-07-31', 2),
    (2, '2025-09-01', '2025-11-15', 1),
    (3, '2024-03-01', '2024-12-31', 1),
    (2, '2024-02-15', '2024-11-30', 1),
    (3, '2024-01-10', '2024-12-20', 1),
    (4, '2024-01-01', '2025-12-31', 1)
ON CONFLICT DO NOTHING;

INSERT INTO "Roster" (name, email, password_hash, creation_date, last_access, club_id, subscription_id) VALUES
    ('Aguilas Admin', 'admin@aguilasdoradas.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '2024-01-01', '2024-01-01', 1, 1),
    ('Condor Manager', 'manager@condorvalle.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '2024-02-01', '2024-02-01', 2, 2),
    ('Toro Admin', 'admin@toronorte.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '2024-01-15', '2024-01-15', 3, 3),
    ('Pumas System', 'system@pumascaribe.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '2024-03-01', '2024-03-01', 4, 4)
ON CONFLICT DO NOTHING;

-- ========================================
-- PAYMENTS
-- ========================================

INSERT INTO "Payment" (payment_date, payment_method_id, description, amount, discount, currency_id, plan_id, roster_id) VALUES
    ('2024-01-01 09:30:00', 1, 'Monthly payment Professional Plan', 150000.00, 0, 1, 2, 1),
    ('2024-02-01 10:15:00', 2, 'Monthly payment Professional Plan with discount', 150000.00, 15000.00, 1, 2, 1),
    ('2024-03-01 14:30:00', 3, 'Basic Plan payment', 50000.00, 0, 1, 1, 1),
    ('2025-08-05 09:45:00', 1, 'Premium Plan quarterly payment', 300000.00, 0, 2, 3, 1),
    ('2025-09-10 11:20:00', 2, 'Professional Plan renewal', 150000.00, 10000.00, 1, 2, 1),
    ('2024-02-15 08:00:00', 1, 'Premium subscription', 300000.00, 20000.00, 1, 3, 2),
    ('2024-03-20 15:30:00', 4, 'Professional plan transfer', 150000.00, 0, 1, 2, 3),
    ('2024-04-10 12:00:00', 1, 'Enterprise annual payment', 500000.00, 50000.00, 1, 4, 4)
ON CONFLICT DO NOTHING;

-- ========================================
-- EVENTS AND MATCHES
-- ========================================

INSERT INTO "Event" (season_id, venue_id, name, description, date, created_at, updated_at, active) VALUES
    (1, 1, 'Preparatory Training', 'Training session to prepare for the next match', '2024-01-15', NOW(), NOW(), TRUE),
    (1, 1, 'Match vs Deportivo Cali', 'League match against Deportivo Cali', '2024-01-20', NOW(), NOW(), TRUE),
    (1, 1, 'Technical Meeting', 'Pre-match tactical analysis', '2024-01-18', NOW(), NOW(), TRUE),
    (3, 2, 'Valle Preseason Camp', 'High-altitude training microcycle', '2024-02-10', NOW(), NOW(), TRUE),
    (4, 2, 'Condor Strategy Workshop', 'Season planning workshop', '2025-07-20', NOW(), NOW(), TRUE),
    (5, 3, 'Toro Norte Fitness Test', 'Start of Apertura physical evaluations', '2024-01-20', NOW(), NOW(), TRUE),
    (1, 1, 'Legends Charity Match', 'Exhibition match in benefit of the academy', '2099-05-15', NOW(), NOW(), TRUE),
    (4, 2, 'Condor Valle Semifinal', 'Semi-final leg for Condor Valle campaign', '2025-09-25', NOW(), NOW(), TRUE),
    (4, 2, 'Condor Valle Final', 'Season finale appearance for Condor Valle', '2025-11-05', NOW(), NOW(), TRUE),
    (5, 3, 'Toro Norte Apertura Debut', 'Opening fixture for Toro Norte', '2024-03-12', NOW(), NOW(), TRUE),
    (1, 1, 'League Matchday 2', 'Second league fixture', '2024-02-03', NOW(), NOW(), TRUE),
    (1, 1, 'League Matchday 3', 'Third league fixture', '2024-02-17', NOW(), NOW(), TRUE),
    (1, 1, 'League Matchday 4', 'Fourth league fixture', '2024-03-02', NOW(), NOW(), TRUE),
    (1, 1, 'League Matchday 5', 'Fifth league fixture', '2024-03-16', NOW(), NOW(), TRUE),
    (1, 1, 'League Matchday 6', 'Sixth league fixture', '2024-03-30', NOW(), NOW(), TRUE),
    (3, 2, 'Valle Championship MD2', 'Second matchday Valle', '2024-03-05', NOW(), NOW(), TRUE),
    (3, 2, 'Valle Championship MD3', 'Third matchday Valle', '2024-03-19', NOW(), NOW(), TRUE),
    (3, 2, 'Valle Championship MD4', 'Fourth matchday Valle', '2024-04-02', NOW(), NOW(), TRUE),
    (5, 3, 'Apertura Matchday 2', 'Second fixture Apertura', '2024-02-05', NOW(), NOW(), TRUE),
    (5, 3, 'Apertura Matchday 3', 'Third fixture Apertura', '2024-02-19', NOW(), NOW(), TRUE),
    (5, 3, 'Apertura Matchday 4', 'Fourth fixture Apertura', '2024-03-05', NOW(), NOW(), TRUE),
    (6, 3, 'Clausura Opening Match', 'First match Clausura', '2024-07-08', NOW(), NOW(), TRUE),
    (6, 3, 'Clausura Matchday 2', 'Second match Clausura', '2024-07-22', NOW(), NOW(), TRUE),
    (7, 4, 'Caribe League MD1', 'First Caribe fixture', '2024-03-15', NOW(), NOW(), TRUE),
    (7, 4, 'Caribe League MD2', 'Second Caribe fixture', '2024-03-29', NOW(), NOW(), TRUE),
    (9, 5, 'Mountain Derby', 'Classic mountain derby', '2024-03-10', NOW(), NOW(), TRUE),
    (9, 5, 'Mountain League MD2', 'Second mountain fixture', '2024-03-24', NOW(), NOW(), TRUE),
    (11, 6, 'Pacific Cup Opening', 'Pacific Cup opener', '2024-04-15', NOW(), NOW(), TRUE),
    (11, 6, 'Pacific Derby', 'Classic Pacific derby', '2024-04-29', NOW(), NOW(), TRUE),
    (13, 7, 'Liga Argentina MD1', 'First Argentine fixture', '2024-03-05', NOW(), NOW(), TRUE),
    (13, 7, 'Liga Argentina MD2', 'Second Argentine fixture', '2024-03-19', NOW(), NOW(), TRUE),
    (14, 8, 'Rosario Derby', 'Classic Rosario derby', '2024-03-24', NOW(), NOW(), TRUE),
    (15, 9, 'El Clásico', 'Historic Spanish derby', '2024-10-15', NOW(), NOW(), TRUE),
    (16, 10, 'Barcelona Derby', 'Catalan derby', '2024-10-22', NOW(), NOW(), TRUE),
    (17, 11, 'Brasileirão MD1', 'First Brazilian fixture', '2024-05-15', NOW(), NOW(), TRUE),
    (17, 11, 'Brasileirão MD2', 'Second Brazilian fixture', '2024-05-29', NOW(), NOW(), TRUE),
    (19, 12, 'Liga MX Apertura MD1', 'First Liga MX match', '2024-07-22', NOW(), NOW(), TRUE),
    (19, 12, 'Liga MX Apertura MD2', 'Second Liga MX match', '2024-08-05', NOW(), NOW(), TRUE),
    (19, 12, 'Clásico Nacional', 'Mexican national classic', '2024-08-19', NOW(), NOW(), TRUE),
    (20, 12, 'Liga MX Clausura MD1', 'First Clausura match', '2025-01-17', NOW(), NOW(), TRUE),
    (10, 5, 'Mountain League MD10', 'Late-season clash at Mountain Fortress', '2025-10-04', NOW(), NOW(), TRUE),
    (12, 6, 'Pacific Cup MD12', 'Decisive Pacific Cup fixture', '2025-10-18', NOW(), NOW(), TRUE),
    (10, 5, 'Mountain League MD11', 'Penultimate Mountain League duel', '2025-11-02', NOW(), NOW(), TRUE),
    (12, 6, 'Pacific Cup MD13', 'Pacific Cup semifinal push', '2025-11-16', NOW(), NOW(), TRUE),
    (12, 6, 'Pacific Cup MD14', 'Final group stage night in Pacific Cup', '2025-12-07', NOW(), NOW(), TRUE),
    (2, 1, 'Liga Femenina MD10', 'Key fixture featuring Aguilas Femenino vs Pumas Femenino', '2025-10-09', NOW(), NOW(), TRUE),
    (4, 2, 'Valle Juvenil MD11', 'Condor Valle Juvenil hosts Leones Reserva in decisive clash', '2025-10-12', NOW(), NOW(), TRUE),
    (8, 4, 'Caribe Sub20 MD12', 'Pumas Caribe Sub-20 fight for top spot versus Aztecas Sub-17', '2025-10-26', NOW(), NOW(), TRUE),
    (12, 6, 'Pacific Cup Femenina MD12', 'Tiburones Femenino defend home waters against Madrid Legends', '2025-11-09', NOW(), NOW(), TRUE),
    (21, 7, 'Liga Argentina MD15', 'Dragones BA Primera duel Halcones Rosario A for playoff hopes', '2025-11-23', NOW(), NOW(), TRUE),
    (23, 9, 'La Liga 2025 Showcase', 'Madrid Legends receive Barcelona Unidos in penultimate round', '2025-12-01', NOW(), NOW(), TRUE),
    (24, 10, 'Copa Catalunya Juvenil MD9', 'Barcelona Unidos Juvenil face Dragones Juvenil in showcase', '2025-12-05', NOW(), NOW(), TRUE),
    (22, 8, 'Torneo Rosario Femenino Final', 'Halcones Femenino battle Barcelona Unidos Femenino for the crown', '2025-12-12', NOW(), NOW(), TRUE)
ON CONFLICT DO NOTHING;

-- Insert matches
INSERT INTO "Match" (id, matchday_id, start_time, end_time, date, stadium_id, event_id) VALUES
    (1, 1, '20:00:00', '22:00:00', '2024-01-20', 1, 2),
    (2, 1, '18:00:00', '20:00:00', '2099-05-15', 1, 7),
    (3, 2, '18:30:00', '20:30:00', '2025-09-25', 2, 8),
    (4, 3, '19:30:00', '21:30:00', '2025-11-05', 2, 9),
    (5, 2, '16:00:00', '18:00:00', '2024-03-12', 3, 10),
    (6, 2, '19:00:00', '21:00:00', '2024-02-03', 1, 11),
    (7, 3, '20:30:00', '22:30:00', '2024-02-17', 2, 12),
    (8, 4, '18:00:00', '20:00:00', '2024-03-02', 3, 13),
    (9, 5, '19:30:00', '21:30:00', '2024-03-16', 4, 14),
    (10, 6, '20:00:00', '22:00:00', '2024-03-30', 5, 15),
    (11, 2, '18:30:00', '20:30:00', '2024-03-05', 2, 16),
    (12, 3, '19:00:00', '21:00:00', '2024-03-19', 2, 17),
    (13, 4, '20:30:00', '22:30:00', '2024-04-02', 2, 18),
    (14, 2, '17:00:00', '19:00:00', '2024-02-05', 3, 19),
    (15, 3, '18:30:00', '20:30:00', '2024-02-19', 3, 20),
    (16, 1, '19:00:00', '21:00:00', '2024-03-15', 4, 24),
    (17, 2, '20:00:00', '22:00:00', '2024-03-29', 4, 25),
    (18, 1, '18:00:00', '20:00:00', '2024-05-15', 11, 35),
    (19, 2, '19:30:00', '21:30:00', '2024-05-29', 11, 36),
    (20, 1, '20:30:00', '22:30:00', '2024-07-22', 12, 37),
    (21, 7, '19:30:00', '21:20:00', '2025-10-04', 5, 41),
    (22, 7, '18:00:00', '20:00:00', '2025-10-18', 6, 42),
    (23, 8, '19:00:00', '21:00:00', '2025-11-02', 5, 43),
    (24, 8, '20:30:00', '22:30:00', '2025-11-16', 6, 44),
    (25, 9, '19:00:00', '21:00:00', '2025-12-07', 6, 45),
    (26, 7, '18:30:00', '20:30:00', '2025-10-09', 1, 46),
    (27, 7, '17:00:00', '19:00:00', '2025-10-12', 2, 47),
    (28, 8, '16:00:00', '18:00:00', '2025-10-26', 4, 48),
    (29, 8, '19:00:00', '21:00:00', '2025-11-09', 6, 49),
    (30, 8, '20:30:00', '22:30:00', '2025-11-23', 7, 50),
    (31, 9, '21:00:00', '23:00:00', '2025-12-01', 9, 51),
    (32, 9, '18:00:00', '20:00:00', '2025-12-05', 10, 52),
    (33, 10, '17:30:00', '19:30:00', '2025-12-12', 8, 53),
    -- Additional matches for schedule density testing (Team 1 - Aguilas First Division, Oct-Nov 2025)
    (34, 1, '19:00:00', '21:00:00', '2025-10-18', 1, 2),
    (35, 1, '20:00:00', '22:00:00', '2025-10-21', 1, 2),
    (36, 1, '18:30:00', '20:30:00', '2025-10-24', 1, 2),
    (37, 1, '19:30:00', '21:30:00', '2025-10-26', 1, 2),
    (38, 1, '20:30:00', '22:30:00', '2025-10-29', 1, 2),
    (39, 1, '19:00:00', '21:00:00', '2025-11-01', 1, 2),
    (40, 1, '18:00:00', '20:00:00', '2025-11-03', 1, 2),
    (41, 1, '20:00:00', '22:00:00', '2025-11-05', 1, 2),
    (42, 1, '19:30:00', '21:30:00', '2025-11-08', 1, 2),
    (43, 1, '18:30:00', '20:30:00', '2025-11-11', 1, 2),
    (44, 1, '20:00:00', '22:00:00', '2025-11-14', 1, 2),
    (45, 1, '19:00:00', '21:00:00', '2025-11-17', 1, 2),
    -- Additional matches for Team 4 (Condor Valle A, Oct-Nov 2025)
    (46, 2, '20:00:00', '22:00:00', '2025-10-19', 2, 8),
    (47, 2, '19:00:00', '21:00:00', '2025-10-23', 2, 8),
    (48, 2, '18:30:00', '20:30:00', '2025-10-27', 2, 8),
    (49, 2, '20:30:00', '22:30:00', '2025-10-30', 2, 8),
    (50, 2, '19:30:00', '21:30:00', '2025-11-02', 2, 8),
    (51, 2, '18:00:00', '20:00:00', '2025-11-06', 2, 8),
    (52, 2, '20:00:00', '22:00:00', '2025-11-09', 2, 8),
    (53, 2, '19:00:00', '21:00:00', '2025-11-12', 2, 8),
    (54, 2, '18:30:00', '20:30:00', '2025-11-16', 2, 8),
    (55, 2, '20:30:00', '22:30:00', '2025-11-19', 2, 8),
    -- Additional matches for Team 6 (Toro Norte Elite, Oct-Nov 2025)
    (56, 2, '19:30:00', '21:30:00', '2025-10-20', 3, 10),
    (57, 2, '20:00:00', '22:00:00', '2025-10-22', 3, 10),
    (58, 2, '18:00:00', '20:00:00', '2025-10-25', 3, 10),
    (59, 2, '19:00:00', '21:00:00', '2025-10-28', 3, 10),
    (60, 2, '20:30:00', '22:30:00', '2025-10-31', 3, 10),
    (61, 2, '18:30:00', '20:30:00', '2025-11-04', 3, 10),
    (62, 2, '19:30:00', '21:30:00', '2025-11-07', 3, 10),
    (63, 2, '20:00:00', '22:00:00', '2025-11-10', 3, 10),
    (64, 2, '18:00:00', '20:00:00', '2025-11-13', 3, 10),
    (65, 2, '19:00:00', '21:00:00', '2025-11-15', 3, 10),
    -- Additional matches for Team 8 (Leones Elite, Oct-Nov 2025)
    (66, 5, '20:00:00', '22:00:00', '2025-10-17', 4, 14),
    (67, 5, '19:00:00', '21:00:00', '2025-10-20', 4, 14),
    (68, 5, '18:30:00', '20:30:00', '2025-10-22', 4, 14),
    (69, 5, '20:30:00', '22:30:00', '2025-10-25', 4, 14),
    (70, 5, '19:30:00', '21:30:00', '2025-10-28', 4, 14),
    (71, 5, '18:00:00', '20:00:00', '2025-10-31', 4, 14),
    (72, 5, '20:00:00', '22:00:00', '2025-11-02', 4, 14),
    (73, 5, '19:00:00', '21:00:00', '2025-11-06', 4, 14),
    (74, 5, '18:30:00', '20:30:00', '2025-11-09', 4, 14),
    (75, 5, '20:30:00', '22:30:00', '2025-11-12', 4, 14),
    -- Additional matches for Team 11 (Leones Montana A, Oct-Nov 2025)
    (76, 6, '19:00:00', '21:00:00', '2025-10-19', 5, 15),
    (77, 6, '20:00:00', '22:00:00', '2025-10-23', 5, 15),
    (78, 6, '18:30:00', '20:30:00', '2025-10-26', 5, 15),
    (79, 6, '19:30:00', '21:30:00', '2025-10-29', 5, 15),
    (80, 6, '20:30:00', '22:30:00', '2025-11-01', 5, 15),
    (81, 6, '18:00:00', '20:00:00', '2025-11-05', 5, 15),
    (82, 6, '20:00:00', '22:00:00', '2025-11-08', 5, 15),
    (83, 6, '19:00:00', '21:00:00', '2025-11-11', 5, 15),
    (84, 6, '18:30:00', '20:30:00', '2025-11-15', 5, 15),
    (85, 6, '20:30:00', '22:30:00', '2025-11-18', 5, 15)
ON CONFLICT DO NOTHING;

-- Match Home Teams with realistic scores
INSERT INTO "MatchHomeTeam" (match_id, team_id, score) VALUES
    (1, 1, 2), (2, 1, 0), (3, 4, 1), (4, 4, 0), (5, 6, 3),
    (6, 1, 3), (7, 4, 2), (8, 6, 1), (9, 8, 2), (10, 11, 1),
    (11, 4, 3), (12, 4, 2), (13, 4, 4), (14, 6, 2), (15, 6, 1),
    (16, 8, 3), (17, 8, 1), (18, 24, 2), (19, 24, 3), (20, 26, 2),
    (21, 11, 3), (22, 13, 1), (23, 11, 2), (24, 13, 0), (25, 13, 1), (26, 3, 2), (27, 5, 1), (28, 9, 3), (29, 14, 0), (30, 15, 1), (31, 19, 2), (32, 22, 1), (33, 18, 2),
    -- Additional matches for Team 1 (Aguilas First Division)
    (34, 1, 2), (35, 1, 1), (36, 1, 3), (37, 1, 2), (38, 1, 1), (39, 1, 2), (40, 1, 0), (41, 1, 3), (42, 1, 2), (43, 1, 1), (44, 1, 2), (45, 1, 3),
    -- Additional matches for Team 4 (Condor Valle A)
    (46, 4, 1), (47, 4, 2), (48, 4, 1), (49, 4, 3), (50, 4, 2), (51, 4, 1), (52, 4, 2), (53, 4, 1), (54, 4, 3), (55, 4, 2),
    -- Additional matches for Team 6 (Toro Norte Elite)
    (56, 6, 2), (57, 6, 3), (58, 6, 1), (59, 6, 2), (60, 6, 1), (61, 6, 2), (62, 6, 3), (63, 6, 1), (64, 6, 2), (65, 6, 1),
    -- Additional matches for Team 8 (Leones Elite)
    (66, 8, 3), (67, 8, 2), (68, 8, 1), (69, 8, 2), (70, 8, 3), (71, 8, 1), (72, 8, 2), (73, 8, 3), (74, 8, 1), (75, 8, 2),
    -- Additional matches for Team 11 (Leones Montana A)
    (76, 11, 2), (77, 11, 1), (78, 11, 3), (79, 11, 2), (80, 11, 1), (81, 11, 2), (82, 11, 3), (83, 11, 1), (84, 11, 2), (85, 11, 3)
ON CONFLICT DO NOTHING;

INSERT INTO "MatchAwayTeam" (match_id, team_id, score) VALUES
    (1, 2, 1), (2, 2, 0), (3, 6, 1), (4, 1, 0), (5, 7, 2),
    (6, 4, 1), (7, 1, 2), (8, 1, 1), (9, 11, 2), (10, 13, 3),
    (11, 6, 2), (12, 8, 1), (13, 1, 1), (14, 7, 1), (15, 1, 2),
    (16, 11, 2), (17, 13, 1), (18, 25, 1), (19, 25, 2), (20, 27, 0),
    (21, 13, 0), (22, 6, 4), (23, 13, 0), (24, 26, 3), (25, 1, 5), (26, 10, 0), (27, 12, 1), (28, 28, 1), (29, 20, 2), (30, 17, 3), (31, 21, 2), (32, 16, 4), (33, 23, 2),
    -- Additional matches for Team 1 (Aguilas First Division)
    (34, 2, 1), (35, 4, 2), (36, 6, 1), (37, 2, 1), (38, 4, 2), (39, 6, 2), (40, 2, 1), (41, 4, 1), (42, 6, 1), (43, 2, 2), (44, 4, 1), (45, 6, 2),
    -- Additional matches for Team 4 (Condor Valle A)
    (46, 1, 2), (47, 6, 1), (48, 8, 2), (49, 1, 2), (50, 6, 1), (51, 8, 2), (52, 1, 1), (53, 6, 2), (54, 8, 2), (55, 1, 1),
    -- Additional matches for Team 6 (Toro Norte Elite)
    (56, 4, 1), (57, 8, 2), (58, 11, 2), (59, 4, 1), (60, 8, 2), (61, 11, 1), (62, 4, 2), (63, 8, 2), (64, 11, 1), (65, 4, 2),
    -- Additional matches for Team 8 (Leones Elite)
    (66, 6, 2), (67, 11, 1), (68, 4, 2), (69, 6, 1), (70, 11, 2), (71, 4, 2), (72, 6, 1), (73, 11, 2), (74, 4, 2), (75, 6, 1),
    -- Additional matches for Team 11 (Leones Montana A)
    (76, 8, 1), (77, 4, 2), (78, 6, 2), (79, 8, 1), (80, 4, 2), (81, 6, 1), (82, 8, 2), (83, 4, 2), (84, 6, 1), (85, 8, 2)
ON CONFLICT DO NOTHING;

-- Insert club participation in events
INSERT INTO "ClubEvent" (club_id, event_id) VALUES
    (1, 1), (1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (1, 7), (2, 8), (2, 9), (3, 10),
    (1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
    (2, 16), (2, 17), (2, 18),
    (3, 19), (3, 20), (3, 21), (3, 22), (3, 23),
    (4, 24), (4, 25),
    (5, 26), (5, 27),
    (6, 28), (6, 29),
    (7, 30), (7, 31),
    (8, 32),
    (9, 33),
    (10, 34),
    (11, 35), (11, 36),
    (12, 37), (12, 38), (12, 39), (12, 40),
    (5, 41), (6, 41), (6, 42), (3, 42), (5, 43),
    (6, 43), (6, 44), (12, 44), (6, 45), (1, 45),
    (1, 46), (4, 46),
    (2, 47), (5, 47),
    (4, 48), (12, 48),
    (6, 49), (9, 49),
    (7, 50), (8, 50),
    (9, 51), (10, 51),
    (10, 52), (7, 52),
    (8, 53), (10, 53)
ON CONFLICT DO NOTHING;

-- ========================================
-- NOTIFICATIONS 
-- ========================================

INSERT INTO "Notification" (message, status, send_date) VALUES
    ('Partido programado: Leones Elite recibe a Tiburones Pacifico A el 2025-10-04 a las 19:30.', 'SCHEDULED', '2025-09-30 09:00:00'),
    ('Partido programado: Tiburones Pacifico A visita a Leones Elite el 2025-10-04 a las 19:30.', 'SCHEDULED', '2025-09-30 09:05:00'),
    ('Partido programado: Tiburones Pacifico A recibe a Toro Norte Elite el 2025-10-18 a las 18:00.', 'SCHEDULED', '2025-10-14 09:00:00'),
    ('Partido programado: Toro Norte Elite visita a Tiburones Pacifico A el 2025-10-18 a las 18:00.', 'SCHEDULED', '2025-10-14 09:05:00'),
    ('Partido programado: Leones Elite recibe a Tiburones Pacifico A el 2025-11-02 a las 19:00.', 'SCHEDULED', '2025-10-29 09:00:00'),
    ('Partido programado: Tiburones Pacifico A visita a Leones Elite el 2025-11-02 a las 19:00.', 'SCHEDULED', '2025-10-29 09:05:00'),
    ('Partido programado: Tiburones Pacifico A recibe a Aztecas MX Primera el 2025-11-16 a las 20:30.', 'SCHEDULED', '2025-11-12 09:00:00'),
    ('Partido programado: Aztecas MX Primera visita a Tiburones Pacifico A el 2025-11-16 a las 20:30.', 'SCHEDULED', '2025-11-12 09:05:00'),
    ('Partido programado: Tiburones Pacifico A recibe a Aguilas First Division el 2025-12-07 a las 19:00.', 'SCHEDULED', '2025-12-03 09:00:00'),
    ('Partido programado: Aguilas First Division visita a Tiburones Pacifico A el 2025-12-07 a las 19:00.', 'SCHEDULED', '2025-12-03 09:05:00'),
    ('Partido programado: Aguilas Femenino recibe a Pumas Femenino el 2025-10-09 a las 18:30.', 'SCHEDULED', '2025-10-05 09:00:00'),
    ('Partido programado: Pumas Femenino visita a Aguilas Femenino el 2025-10-09 a las 18:30.', 'SCHEDULED', '2025-10-05 09:05:00'),
    ('Partido programado: Condor Valle Juvenil recibe a Leones Reserva el 2025-10-12 a las 17:00.', 'SCHEDULED', '2025-10-08 08:45:00'),
    ('Partido programado: Leones Reserva visita a Condor Valle Juvenil el 2025-10-12 a las 17:00.', 'SCHEDULED', '2025-10-08 08:50:00'),
    ('Partido programado: Pumas Caribe Sub-20 recibe a Aztecas MX Sub-17 el 2025-10-26 a las 16:00.', 'SCHEDULED', '2025-10-22 09:00:00'),
    ('Partido programado: Aztecas MX Sub-17 visita a Pumas Caribe Sub-20 el 2025-10-26 a las 16:00.', 'SCHEDULED', '2025-10-22 09:05:00'),
    ('Partido programado: Tiburones Femenino recibe a Madrid Legends Femenino el 2025-11-09 a las 19:00.', 'SCHEDULED', '2025-11-05 09:00:00'),
    ('Partido programado: Madrid Legends Femenino visita a Tiburones Femenino el 2025-11-09 a las 19:00.', 'SCHEDULED', '2025-11-05 09:05:00'),
    ('Partido programado: Dragones BA Primera recibe a Halcones Rosario A el 2025-11-23 a las 20:30.', 'SCHEDULED', '2025-11-19 08:30:00'),
    ('Partido programado: Halcones Rosario A visita a Dragones BA Primera el 2025-11-23 a las 20:30.', 'SCHEDULED', '2025-11-19 08:35:00'),
    ('Partido programado: Madrid Legends Primera recibe a Barcelona Unidos A el 2025-12-01 a las 21:00.', 'SCHEDULED', '2025-11-27 09:00:00'),
    ('Partido programado: Barcelona Unidos A visita a Madrid Legends Primera el 2025-12-01 a las 21:00.', 'SCHEDULED', '2025-11-27 09:05:00'),
    ('Partido programado: Barcelona Unidos Juvenil recibe a Dragones Juvenil el 2025-12-05 a las 18:00.', 'SCHEDULED', '2025-12-01 09:00:00'),
    ('Partido programado: Dragones Juvenil visita a Barcelona Unidos Juvenil el 2025-12-05 a las 18:00.', 'SCHEDULED', '2025-12-01 09:05:00'),
    ('Partido programado: Halcones Femenino recibe a Barcelona Unidos Femenino el 2025-12-12 a las 17:30.', 'SCHEDULED', '2025-12-08 09:00:00'),
    ('Partido programado: Barcelona Unidos Femenino visita a Halcones Femenino el 2025-12-12 a las 17:30.', 'SCHEDULED', '2025-12-08 09:05:00')
ON CONFLICT DO NOTHING;

INSERT INTO "NotificationClubEvent" (notification_id, club_event_id) VALUES
    (1, 41), (2, 42), (3, 43), (4, 44), (5, 45), (6, 46),
    (7, 47), (8, 48), (9, 49), (10, 50),
    (11, 51), (12, 52), (13, 53), (14, 54), (15, 55), (16, 56),
    (17, 57), (18, 58), (19, 59), (20, 60), (21, 61), (22, 62),
    (23, 63), (24, 64), (25, 65), (26, 66)
ON CONFLICT DO NOTHING;

-- ========================================
-- STREAKS 
-- ========================================

INSERT INTO "Streak" (team_id, start_date, end_date) VALUES
    (1, '2024-01-01', null),
    (4, '2024-08-01', '2024-09-20'),
    (6, '2024-10-01', null),
    (8, '2024-03-01', null),
    (11, '2024-02-15', '2024-04-10'),
    (15, '2024-03-05', null),
    (19, '2024-10-01', null),
    (21, '2024-09-15', null),
    (24, '2024-05-15', null),
    (26, '2024-07-22', null)
ON CONFLICT DO NOTHING;
