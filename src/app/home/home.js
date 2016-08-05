angular.module('robot.home', [
    'ngAnimate',
    'ui.router',
    'robot.home.mock',
    'mgcrea.ngStrap.dropdown',
    'mgcrea.ngStrap.popover'
])
    //注释
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home', {
            abstract: true,
            url: '/home',
            cache: false,
            controller: 'homeController',
            templateUrl: 'home/home.tpl.html',
            resolve: {
                resolvedData: ['$http', function ($http) {
                    return $http.get('/type/typeList');
                }],
                userInfo: ['$http', function ($http) {
                    return $http.get('/user/getUserInfo');
                }],
            }
        })
    }])
    .controller('homeController', ['$rootScope', '$scope', '$http', 'resolvedData', '$state', 'userInfo',
        function ($rootScope, $scope, $http, resolvedData, $state, userInfo) {

            $scope.userInfo = userInfo.data;
            $scope.nowParentname = $state.current.parentsname;
            $scope.nowstatename = $state.current.bookname;
            $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
                $scope.nowstatename = $state.current.bookname;
                $scope.nowParentname = $state.current.parentsname;
            })

            $scope.data = resolvedData.data;

            $scope.changeMenu = function (menuName) {
                $scope.menuName = menuName;
            };
            $scope.changeChildMenu = function (childMenu) {
                $scope.childMenu = childMenu;
            };


            var myDate = new Date();
            $scope.data.date = myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日';

            $scope.oneAtATime = true;
            $scope.selectType = function (curType) {
                $scope.curType = curType;
            };
            $scope.changeType = function (name) {
                if (name == '机器人管理') {
                    $state.go('home.manage');
                }

            }
        }])


    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.index', {
            url: '/index',
            bookname: '欢迎页',
            parentsname: '首页',
            views: {
                'content': {
                    controller: 'indexController',
                    // templateUrl: 'home/wuye/wuye.tpl.html'
                    template: '<h4>欢迎您来到管理系统！</h4>'
                }
            }
        })
    }])
    .controller('indexController', ['$scope', '$http', function ($scope, $http) {

    }])


