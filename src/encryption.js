// Quick safety library
(
    function() {
        const crypto = require("crypto");
        const uuid = require('uuid');

        // sha hash function
        function sha256hash (text) {
            const hash = crypto.createHash('sha256');
            return hash.update(text).digest('hex');
        }

        // generate new uuid
        function uuidv4() {
            return uuid.v4();
        }

        // checks if item is already in table
        // returns true if item is not in the table (valid section)
        async function validate_section(item, database, table, item_column) {
            try {
                const sql = `SELECT * FROM ${table} WHERE ${item_column} = ?;`;
                const params = [item];
                const data = await database.query(sql, params);
                return !(data.length === 0); // Returns true if item is not in the table
            } catch (err) {
                console.log(err);
                return false;
            }
        }

        // Double protection against sql injection attacks (on top of stringify performed in sql query)
        function check_sql_protection(text) {
            let blacklist = [
                "--", ";", "/*", "*/", "@@", "@", "char", "nchar", "varchar", "nvarchar", "alter", "begin", "cast", "create", "cursor", "declare",
                "delete", "drop", "end", "exec", "execute", "fetch", "insert", "kill", "open", "select", "sys", "sysobjects", "syscolumns", "table"
            ];
            for (let item of blacklist) {
                if (text.includes(item)) {
                    return true;
                }
            }
            return false;
        }

        async function check_session_expired(user_id, app_key, database) {
            // returns true if session is expired, that is key_add_time is more than 1 day old
            let sql = "SELECT key_add_time FROM public.clients WHERE user_id = ? AND app_key = ?;";
            let params = [user_id, app_key];
            let err, data = await database.query(sql, params);
            if (err) {
                return true;
            }

            if (data.length === 0) {
                return true; // if no data is returned, consider session expired
            }
            if (data[0].key_add_time === undefined || data[0].key_add_time === null) {
                return true; // if key_add_time is not set, consider session expired
            }

            let key_add_time = new Date(data[0].key_add_time);
            let current_time = new Date();
            let diff = Math.abs(current_time - key_add_time);
            let diff_hours = Math.ceil(diff / (1000 * 60 * 60));
            return diff_hours > 24;
        }

        module.exports.uuidv4 = uuidv4;
        module.exports.validate_section = validate_section;
        module.exports.sha256hash = sha256hash;
        module.exports.check_sql_protection = check_sql_protection;
        module.exports.check_session_expired = check_session_expired;
    }()
);