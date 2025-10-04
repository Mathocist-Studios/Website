(
    function () {
        const fs = require("fs");

        const log_levels = [
            "DEBUG",
            "INFO",
            "WARN",
            "ERROR",
            "FATAL"
        ];

        let orig_stdout = process.stdout.write.bind(process.stdout);
        let orig_stderr = process.stderr.write.bind(process.stderr);

        let log_file_folder = "";
        let is_logging = false;
        let debug_level = 0;
        let format = "";
        let check_interval = 0;
        let keep_days = 30; // keep logs for 30 days

        let interval_id = null;

        function init(target_folder, log_check_time_interval=(17 ** 4), db_lev=0, f="[%d][%l] %s\n") {
            process.stdout.write = log_callback;
            process.stderr.write = error_callback;
            log_file_folder = target_folder;
            is_logging = true;
            debug_level = db_lev;
            format = f;
            check_interval = log_check_time_interval;
            fs.mkdirSync(log_file_folder, { recursive: true });
            interval_id = setInterval(check_log_files, check_interval);
        }

        function close() {
            is_logging = false;
            process.stdout.write = orig_stdout;
            process.stderr.write = orig_stderr;
            clearInterval(interval_id);
        }

        function log_callback (chunk, encoding, callback) {
            if (!is_logging || !(typeof chunk === 'string') || debug_level > 0) {
                return orig_stdout(chunk, encoding, callback);
            }
            let output = chunk.replace(/\n/g, "");
            let date = new Date();

            let file_out = format;
            file_out = file_out.replace("%d", date.toISOString().split('T')[0]);
            file_out = file_out.replace("%l", "DEBUG");
            file_out = file_out.replace("%s", output);

            fs.appendFile(log_file_folder + "/" + date.toISOString().split('T')[0] + ".log", file_out, {encoding: "utf-8"}, (err) => {
                if (err) {
                    process.stdout.write = orig_stdout;
                    process.stderr.write = orig_stderr;
                    console.error(err);
                }
            });

            return orig_stdout(chunk, encoding, callback);
        }

        function error_callback (chunk, encoding, callback) {
            if (!is_logging || !(typeof chunk === 'string')) {
                return orig_stderr(chunk, encoding, callback);
            }
            let output = chunk.replace(/\n/g, "");
            let date = new Date();

            let file_out = format;
            file_out = file_out.replace("%d", date.toISOString().split('T')[0]);
            file_out = file_out.replace("%l", "ERROR");
            file_out = file_out.replace("%s", output);

            fs.appendFile(log_file_folder + "/" + date.toISOString().split('T')[0] + ".log", file_out, {encoding: "utf-8"}, (err) => {
                if (err) {
                    process.stdout.write = orig_stdout;
                    process.stderr.write = orig_stderr;
                    console.error(err);
                }
            });

            return orig_stderr(chunk, encoding, callback);
        }

        function push_log(message, level=0, encoding="utf-8") {
            if (!is_logging || !(typeof message === 'string') || (typeof level === 'number' && level < debug_level)) {
                return;
            }

            if (typeof level === 'number') {
                level = log_levels[level];
            }

            let file_out = format;
            let date = new Date();
            file_out = file_out.replace("%d", date.toISOString().split('T')[0]);
            file_out = file_out.replace("%l", level);
            file_out = file_out.replace("%s", message);

            fs.appendFile(log_file_folder + "/" + date.toISOString().split('T')[0] + ".log", file_out, {encoding: encoding}, (err) => {
                if (err) {
                    process.stdout.write = orig_stdout;
                    process.stderr.write = orig_stderr;
                    console.error(err);
                }
            });
        }

        function check_log_files() {
            let files = fs.readdirSync(log_file_folder);
            for (let i = 0; i < files.length; i++) {
                let date_str = files[i].split('.')[0];
                let date = new Date(date_str);
                if (date < new Date(Date.now() - keep_days * 24 * 60 * 60 * 1000)) {
                    fs.unlinkSync(log_file_folder + "/" + files[i]);
                }
            }
        }

        module.exports.init = init;
        module.exports.push_log = push_log;
        module.exports.close = close;
        module.exports.log_levels = log_levels;
        module.exports.log_file_folder = log_file_folder;
        module.exports.format = format;

    }()
);