(
    function() {
        const request = require('../../request');
        const path = require("path");

        request.setupPageRequest("GET", "downloads", serve_downloadspage);

        function serve_downloadspage(res) {
            res.header("Content-Security-Policy", "script-src 'self' 'unsafe-inline'").sendFile(path.join(__dirname, "page_html/downloads/downloads.html"));
        }
    }
)()