
(
    function () {

        // list to store all the request objects
        let registered_api_requests = [];
        let registered_page_requests = [];

        // method to register a request
        function setupAPIRequest(type, ext_url, api_version, callback, file_upload = false, ...params) {
            const reg = {
                type: type,
                total_url: '/api/v' + api_version + '/' + ext_url,
                callback: callback,
                file_upload: file_upload,
                params: params
            };
            registered_api_requests.push(reg);
        }

        function setupPageRequest(type, ext_url, callback, ...params) {
            const reg = {
                type: type,
                total_url: '/' + ext_url,
                callback: callback,
                params: params
            };
            registered_page_requests.push(reg);
        }

        // export data
        module.exports.setupAPIRequest = setupAPIRequest;
        module.exports.setupPageRequest = setupPageRequest;
        module.exports.getRegisteredAPIRequests = function () {
            return registered_api_requests;
        }
        module.exports.getRegisteredPageRequests = function () {
            return registered_page_requests;
        }
        module.exports.getRegisteredRequests = function () {
            return registered_api_requests.concat(registered_page_requests);
        }

    }()
);
