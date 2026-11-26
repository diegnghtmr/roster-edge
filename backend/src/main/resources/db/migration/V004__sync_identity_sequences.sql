-- Also callable after a controlled explicit-ID import, before serving writes.
CREATE FUNCTION sync_roster_identity_sequences() RETURNS integer
LANGUAGE plpgsql AS $$
DECLARE
    entry record;
    highest_id bigint;
    last_id bigint;
    called boolean;
    adjusted integer := 0;
BEGIN
    FOR entry IN
        SELECT t.oid::regclass AS owning_table, s.oid::regclass AS sequence_name
        FROM pg_class t
        JOIN pg_namespace n ON n.oid = t.relnamespace
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attname = 'id' AND NOT a.attisdropped
        JOIN pg_depend d ON d.refobjid = t.oid AND d.refobjsubid = a.attnum
          AND d.classid = 'pg_class'::regclass AND d.refclassid = 'pg_class'::regclass
          AND d.deptype IN ('a', 'i')
        JOIN pg_class s ON s.oid = d.objid AND s.relkind = 'S'
        WHERE n.nspname = current_schema() AND t.relkind = 'r'
        ORDER BY t.oid
    LOOP
        -- Prevent concurrent table inserts from advancing a sequence between read and restart.
        EXECUTE format('LOCK TABLE %s IN SHARE ROW EXCLUSIVE MODE', entry.owning_table);
        -- No ONLY: the User sequence is shared with its inherited Player and Staff tables.
        EXECUTE format('SELECT max(id) FROM %s', entry.owning_table) INTO highest_id;
        IF highest_id IS NULL THEN
            CONTINUE;
        END IF;
        EXECUTE format('SELECT last_value, is_called FROM %s', entry.sequence_name) INTO last_id, called;
        IF highest_id > last_id OR (highest_id = last_id AND NOT called) THEN
            EXECUTE format('ALTER SEQUENCE %s RESTART WITH %s', entry.sequence_name, highest_id + 1);
            adjusted := adjusted + 1;
        END IF;
    END LOOP;
    RETURN adjusted;
END;
$$;

SELECT sync_roster_identity_sequences();
