(
    function() {
        const request = require('../../request');
        const path = require("path");

        request.setupPageRequest("GET", "contact", serve_contactpage);

        function serve_contactpage(res) {
            res.header("Content-Security-Policy", "script-src 'self' 'unsafe-inline'").sendFile(path.join(__dirname, "page_html/contact/contact.html"));
        }
    }
)()