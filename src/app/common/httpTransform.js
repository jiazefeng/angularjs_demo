angular.module('robot.common.httpTransform', [
    'robot.app.config'
])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('commonResponseParser');
}])

.factory('commonResponseParser', ['$rootScope','$q', 'HTTP_COMMON_ERROR_MESSAGE',
 function($rootScope,$q, HTTP_COMMON_ERROR_MESSAGE) {
    return {
        response: function(response) {
            if (!!response.config.url.match('.tpl.html'))
                return response;
            if (response.data && response.data.code === 0) {
                response.data = response.data.data;
                return response;
            } else if (response.data.msg) {
                   $rootScope.$broadcast('tokenBug', [response.data.msg]);
                return $q.reject({
                    data: response.data.msg,
                    status: response.status,
                    headers: response.headers
                });
            } else {
                return $q.reject(response);
            }
        },
        responseError: function(rejection) {
            return $q.reject(HTTP_COMMON_ERROR_MESSAGE);
        }
    };
}])