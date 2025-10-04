(
    function() {
        const request = require('../../request');
        const path = require("path");

        request.setupPageRequest("GET", "our_game", serve_gamepage);

        function serve_gamepage(res) {
            res.header("Content-Security-Policy", "script-src 'self' 'unsafe-inline'").sendFile(path.join(__dirname, "page_html/our_game/our_game.html"));
        }
    }
)()