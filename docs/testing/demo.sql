-- Local/demo only. Run after Flyway, against a disposable database or schema.
\set ON_ERROR_STOP on
BEGIN;
DO $demo$
DECLARE
    local_club bigint; other_club bigint;
    local_season bigint; other_season bigint;
    local_event bigint; other_event bigint;
    gender bigint; category bigint; venue bigint; stadium bigint; round_id bigint;
    mirador bigint; palmas bigint; ceiba bigint; nogal bigint; other_home bigint; other_away bigint;
    local_plan bigint; other_plan bigint; local_sub bigint; other_sub bigint;
    card bigint; transfer bigint; currency bigint; local_account bigint; other_account bigint;
    fixture_id bigint; fixture record; today date := CURRENT_DATE;
    -- PBKDF2 hash of the public, synthetic demo password documented in README.md.
    demo_hash constant text := 'pbkdf2-sha256$600000$Um9zdGVyRWRnZS1kZW1vIQ$0h3ytpZEuJwxbhqP6oPEnnFbMUcEZCqMIRHylARvxyk';
BEGIN
    LOCK TABLE "Club" IN SHARE ROW EXCLUSIVE MODE;
    IF EXISTS (SELECT 1 FROM "Club") OR EXISTS (SELECT 1 FROM "Roster") THEN
        RAISE EXCEPTION 'Demo import requires an empty club and roster catalog';
    END IF;

    INSERT INTO "Club" (name, foundation) VALUES ('Guadua Athletic', '2013-03-20') RETURNING id INTO local_club;
    INSERT INTO "Club" (name, foundation) VALUES ('Sierra Athletic', '2016-06-08') RETURNING id INTO other_club;
    INSERT INTO "TeamGender" (name) VALUES ('Mixto') RETURNING id INTO gender;
    INSERT INTO "TeamCategory" (name) VALUES ('Senior') RETURNING id INTO category;
    INSERT INTO "StaffRole" (name) VALUES ('Entrenador'), ('Fisioterapeuta');
    INSERT INTO "Team" (name, mascot, foundation, club_id, gender_id, category_id)
        VALUES ('Mirador FC', 'Cóndor', '2014-02-09', local_club, gender, category) RETURNING id INTO mirador;
    INSERT INTO "Team" (name, mascot, foundation, club_id, gender_id, category_id)
        VALUES ('Las Palmas SC', 'Tucán', '2016-08-11', local_club, gender, category) RETURNING id INTO palmas;
    INSERT INTO "Team" (name, mascot, foundation, club_id, gender_id, category_id)
        VALUES ('Ceiba United', 'Ocelote', '2017-05-16', local_club, gender, category) RETURNING id INTO ceiba;
    INSERT INTO "Team" (name, mascot, foundation, club_id, gender_id, category_id)
        VALUES ('Nogal Deportivo', 'Zorro', '2018-07-09', local_club, gender, category) RETURNING id INTO nogal;
    INSERT INTO "Team" (name, foundation, club_id, gender_id, category_id)
        VALUES ('Sierra Norte', '2019-08-11', other_club, gender, category) RETURNING id INTO other_home;
    INSERT INTO "Team" (name, foundation, club_id, gender_id, category_id)
        VALUES ('Sierra Sur', '2019-10-12', other_club, gender, category) RETURNING id INTO other_away;
    INSERT INTO "Streak" (start_date, end_date, team_id) VALUES
        (today - 8, NULL, mirador), (today - 18, today - 6, palmas), (today - 4, NULL, ceiba);

    INSERT INTO "Venue" (name, email, phone, foundation, club_id)
        VALUES ('Parque Guadua', 'venue@example.invalid', '0000000', '2009-05-15', local_club) RETURNING id INTO venue;
    INSERT INTO "Stadium" (area, surface, total_capacity, foundation, venue_id)
        VALUES (1260, 'Césped natural', 4200, '2009-10-25', venue) RETURNING id INTO stadium;
    INSERT INTO "Matchday" (name) VALUES ('Jornada de liga') RETURNING id INTO round_id;
    INSERT INTO "Season" (club_id, name, start_date, end_date)
        VALUES (local_club, 'Liga Guadua', today - 40, today + 60) RETURNING id INTO local_season;
    INSERT INTO "Season" (club_id, name, start_date, end_date)
        VALUES (other_club, 'Liga Sierra', today - 40, today + 60) RETURNING id INTO other_season;
    INSERT INTO "Event" (season_id, venue_id, name, date)
        VALUES (local_season, venue, 'Liga Guadua · Jornada', today + 5) RETURNING id INTO local_event;
    INSERT INTO "Event" (season_id, name, date)
        VALUES (other_season, 'Liga Sierra · Jornada', today + 7) RETURNING id INTO other_event;

    FOR fixture IN SELECT * FROM (VALUES
        (local_event, mirador, palmas, -12, 3, 1), (local_event, ceiba, nogal, -11, 2, 0),
        (local_event, mirador, ceiba, -7, 2, 2), (local_event, nogal, palmas, -6, 1, 0),
        (local_event, mirador, nogal, 4, NULL, NULL), (local_event, ceiba, palmas, 7, NULL, NULL),
        (other_event, other_home, other_away, 5, NULL, NULL)
    ) AS schedule(event_id, home_id, away_id, offset_days, home_score, away_score)
    LOOP
        INSERT INTO "Match" (event_id, matchday_id, stadium_id, date, start_time, end_time)
            VALUES (fixture.event_id, round_id, CASE WHEN fixture.event_id = local_event THEN stadium END,
                    today + fixture.offset_days, '10:00', '12:00') RETURNING id INTO fixture_id;
        INSERT INTO "MatchHomeTeam" (match_id, team_id) VALUES (fixture_id, fixture.home_id);
        INSERT INTO "MatchAwayTeam" (match_id, team_id) VALUES (fixture_id, fixture.away_id);
        IF fixture.home_score IS NOT NULL THEN
            INSERT INTO "MatchResult" (match_id, home_team_id, away_team_id, home_score, away_score)
                VALUES (fixture_id, fixture.home_id, fixture.away_id, fixture.home_score, fixture.away_score);
        END IF;
    END LOOP;

    INSERT INTO "Currency" (name, symbol) VALUES ('Peso colombiano', 'COP') RETURNING id INTO currency;
    INSERT INTO "Plan" (name, price) VALUES ('Plan Temporada', 100000) RETURNING id INTO local_plan;
    INSERT INTO "Plan" (name, price) VALUES ('Plan Sierra', 700000) RETURNING id INTO other_plan;
    INSERT INTO "PaymentMethod" (name) VALUES ('Tarjeta') RETURNING id INTO card;
    INSERT INTO "PaymentMethod" (name) VALUES ('Transferencia') RETURNING id INTO transfer;
    INSERT INTO "Subscription" (plan_id, start_date, end_date)
        VALUES (local_plan, today - 20, today + 20) RETURNING id INTO local_sub;
    INSERT INTO "Subscription" (plan_id, start_date, end_date)
        VALUES (other_plan, today - 20, today + 20) RETURNING id INTO other_sub;
    INSERT INTO "Roster" (name, email, password_hash, club_id, subscription_id)
        VALUES ('Marina Demo', 'roster@example.invalid', demo_hash, local_club, local_sub) RETURNING id INTO local_account;
    INSERT INTO "Roster" (name, email, password_hash, club_id, subscription_id)
        VALUES ('Sierra Demo', 'sierra@example.invalid', demo_hash, other_club, other_sub) RETURNING id INTO other_account;
    INSERT INTO "Payment" (roster_id, plan_id, payment_method_id, currency_id, payment_date, amount, discount) VALUES
        (local_account, local_plan, card, currency, today - 5, 100000, 10000),
        (local_account, local_plan, transfer, currency, today - 4, 50000, 0),
        (other_account, other_plan, card, currency, today - 3, 700000, 0);
END
$demo$;
COMMIT;
