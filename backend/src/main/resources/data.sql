-- Initial data for development and testing
-- Passwords are hashed with SHA-256
-- Default password for all users is: password123

INSERT INTO users (username, email, password, full_name, role, status) VALUES
    ('admin', 'admin@rosteredge.com', 'IjZAgcfl7p92ldGxad68LJZdL17lhWy46abIr9Mc2qw=', 'System Administrator', 'ADMIN', 'ACTIVE'),
    ('coach1', 'coach@rosteredge.com', 'IjZAgcfl7p92ldGxad68LJZdL17lhWy46abIr9Mc2qw=', 'John Coach', 'COACH', 'ACTIVE'),
    ('player1', 'player1@rosteredge.com', 'IjZAgcfl7p92ldGxad68LJZdL17lhWy46abIr9Mc2qw=', 'Mike Johnson', 'PLAYER', 'ACTIVE'),
    ('viewer1', 'viewer@rosteredge.com', 'IjZAgcfl7p92ldGxad68LJZdL17lhWy46abIr9Mc2qw=', 'Jane Viewer', 'VIEWER', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Insert sample teams
INSERT INTO teams (name, sport, description, founded_year) VALUES
    ('Thunder Hawks', 'Basketball', 'Professional basketball team', 2020),
    ('Lightning Bolts', 'Soccer', 'Premier league soccer team', 2018),
    ('Storm Warriors', 'Baseball', 'Championship baseball team', 2019)
ON CONFLICT DO NOTHING;

-- Insert sample players
INSERT INTO players (first_name, last_name, jersey_number, position, date_of_birth, nationality, team_id) VALUES
    ('Michael', 'Jordan', 23, 'Shooting Guard', '1990-02-17', 'USA', 1),
    ('LeBron', 'James', 6, 'Small Forward', '1992-12-30', 'USA', 1),
    ('Lionel', 'Messi', 10, 'Forward', '1987-06-24', 'Argentina', 2),
    ('Cristiano', 'Ronaldo', 7, 'Forward', '1985-02-05', 'Portugal', 2),
    ('Mike', 'Trout', 27, 'Center Field', '1991-08-07', 'USA', 3)
ON CONFLICT DO NOTHING;

-- Insert sample matches
INSERT INTO matches (home_team_id, away_team_id, match_date, home_score, away_score, status, venue) VALUES
    (1, 2, '2024-08-10 19:00:00', 0, 0, 'SCHEDULED', 'Thunder Arena'),
    (2, 3, '2024-08-15 20:00:00', 0, 0, 'SCHEDULED', 'Lightning Stadium'),
    (1, 3, '2024-08-20 18:30:00', 0, 0, 'SCHEDULED', 'Thunder Arena')
ON CONFLICT DO NOTHING;
