angular.module('robot.userLogin', [
    'robot.userLogin.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('userLogin', {
            url: '/userLogin',
            controller: 'loginController',
            templateUrl: 'login/login.tpl.html',
            resolve: {
                listData: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.get('/login/loginByItem')
                }]
            }
        });
    }])
    .controller('loginController', ['$modal', '$scope', '$http', '$state', 'CurrentUserService',
        function ($modal, $scope, $http, $state, CurrentUserService) {
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
            $scope.commitCont = function (form) {
                if ($scope.userName == null) {
                    errorHint("请填写用户名");
                    return false;
                }
                if ($scope.pwd == null) {
                    errorHint("请填写密码");
                    return false;
                }
                var params = {
                    'userName': $scope.userName,
                    'pwd': $scope.pwd
                };

                CurrentUserService.login(params).then(function (res) {
                    if (res) {
                        //if (res.data.userInfo.ifadmin) {
                        //    $state.go("home.user");
                        //}else{
                        //    $state.go("home.index");
                        //}
                        if (res.data.success) {
                            $state.go("home.index");
                        } else {
                            errorHint(res.data.error);
                        }

                    }

                }, function () {
                    errorHint("登陆失败");
                });
            }

        }
    ])


