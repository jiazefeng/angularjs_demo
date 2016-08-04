angular.module('robotSupervise.app', [
    'ui.router',
    'ui.bootstrap',
    'maxrocky.framework',
    'robot.app.config',
    'robot.templates',
    'robot.common',
    'robot.home',
    'robot.userManage',
    'robot.roleManage',
    'robot.menuManage',
    'mgcrea.ngStrap.modal',
    'robot.userLogin'
])

.run(['$rootScope', '$httpBackend','mrBookMarksService',
    function($rootScope, $httpBackend,mrBookMarksService) {
        $rootScope.bookMarks = [];
        $rootScope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
            mrBookMarksService.pushNewState($rootScope,toState);
        })
    }
])

.controller('AppController', ['$window','$state', 
	function($window, $state) {
            
	}
])