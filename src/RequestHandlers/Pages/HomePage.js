(
    function() {
        const request = require('../../request');
        const path = require("path");

        request.setupPageRequest("GET", "", serve_homepage);

        function serve_homepage(res) {
            res.header("Content-Security-Policy", "script-src 'self' 'unsafe-inline'").sendFile(path.join(__dirname, "page_html/home/home.html"));
        }
    }
)()