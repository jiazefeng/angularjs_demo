angular.module('robot.app.config', [
    'ui.router'
])

//contants
    .constant('ApiBaseUrl', 'http://localhost:8088/')
// .constant('ApiBaseUrl', 'http://lifeowner.robot.cn/')
//.constant('AppDefaultRootUrl', '/home/index')
    .constant('AppDefaultRootUrl', '/userLogin')
    .constant('HTTP_COMMON_ERROR_MESSAGE', '服务器请求返回错误!')

//configs
    .config(['$urlRouterProvider', 'AppDefaultRootUrl', function ($urlRouterProvider, AppDefaultRootUrl) {
        $urlRouterProvider.otherwise(AppDefaultRootUrl);
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }])

