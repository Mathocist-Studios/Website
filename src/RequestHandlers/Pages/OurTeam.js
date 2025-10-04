(
    function() {
        const request = require('../../request');
        const path = require("path");

        request.setupPageRequest("GET", "our_team", serve_teampage);

        function serve_teampage(res) {
            res.header("Content-Security-Policy", "script-src 'self' 'unsafe-inline'").sendFile(path.join(__dirname, "page_html/our_team/our_team.html"));
        }
    }
)()