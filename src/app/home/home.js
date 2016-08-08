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
    .controller('homeController', ['$modal','$rootScope', '$scope', '$http', '$state', 'Session', '$uibModal', '$filter','$location',
        function ($modal,$rootScope, $scope, $http, $state, Session, $uibModal, $filter,$location) {

            $scope.userInfo = Session.userInfoData.userInfo;
            $scope.nowParentname = $state.current.parentsname;
            $scope.nowstatename = $state.current.bookname;
            $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
                $scope.nowstatename = $state.current.bookname;
                $scope.nowParentname = $state.current.parentsname;
            })

            $scope.data = Session.userInfoData;
            $scope.showIndex = $rootScope.isIndex;

            $scope.changeMenu = function (menuName) {
                $scope.menuName = menuName;
            };
            $scope.changeChildMenu = function (childMenu) {
                $scope.childMenu = childMenu;
            };


            var myDate = new Date();
            $scope.data.date = myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日';


            var errorHint = function (message) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false
                });
            };


            //退出系统
            $scope.logout = function () {
                $http.get('/user/logout/')
                    .success(function (result) {
                        $state.go("userLogin");
                    }).error(function (msg) {
                        errorHint("网络异常，请稍后重试!!!");
                    });
            };

            $scope.goTo = function (id) {
                $state.go("home.reviseUser",{'userId':id})
            };

             //修改密码
            var modalInstance;
            $scope.openPWDModal = function (size) {
                modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'home/updatePwd.tpl.html',
                    size: size,
                    controller: 'UpdatePwdCtrl'
                });
            };

            //返回首页
            $scope.goBack = function () {
                $state.go('home.index',{},{location: 'replace'});
            };

            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                $('#menu3').metisMenu({
                    doubleTapToGo: true
                });
            });
        }])


    .controller('UpdatePwdCtrl', ['$modal','$scope', '$uibModalInstance', '$http',
        function ($modal,$scope, $uibModalInstance, $http) {

            var errorHint = function (message) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false
                });
            };

            $scope.commitUpdatePwd = function (isValid) {
                if (isValid) {
                    if ($scope.newPwd != $scope.newPwd2) {
                        errorHint("两次密码不一致!!!");
                        return false;
                    }
                    var params = {
                        uPwd: $scope.pwd,
                        newPwd: $scope.newPwd
                    }
                    $http.post('/user/updateUserPwd', params)
                        .success(function (result) {
                            if (result.error) {
                                errorHint(result.error);
                                return false;
                            }
                            if (result.success) {
                                $modal({
                                    title: '系统提示',
                                    content: result.success,
                                    show: true,
                                    animation: 'am-fade-and-scale',
                                    placement: 'center',
                                    backdrop: false,
                                    onHide: function(){
                                        $uibModalInstance.close();
                                    }
                                });
                            }
                        })
                        .error(function () {
                            errorHint("网络异常，请稍后重试!!!");
                        });
                    return true;
                } else {
                    errorHint("请正确填写所有信息!!!");
                    return false;
                }

            };

            $scope.ok = function (isValid) {
                $scope.commitUpdatePwd(isValid)
                //if ($scope.commitUpdatePwd(isValid)) {
                //    //$uibModalInstance.close();
                //}
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
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


