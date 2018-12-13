var Api = (function() {
    var protocol = location.protocol;
    var host     = location.hostname ;
    var port     = location.port;
    var apiPath = (port === '4567') ? ':4567/api/'   : '/api/';
    var baseUrl = (protocol == 'file:') ? '//localhost:4567/api/' : protocol + '//' + host + apiPath;

    /**
     * PJ一覧取得API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function projects(request) {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'projects/',
            dataType: 'html',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

    /**
     * 入力API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function input(request) {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'input/',
            dataType: 'json',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

    return {
        projects: projects,
        input   : input
    };
})();