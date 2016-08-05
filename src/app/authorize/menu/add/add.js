angular.module('robot.addMenu', [
    'robot.addMenu.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.addMenu', {
            url: '/addMenu',
            bookname: '添加管理',
            parentsname: '菜单管理',
            views: {
                'content': {
                    controller: 'addFunctionController',
                    templateUrl: 'authorize/menu/add/add.tpl.html',
                    resolve: {
                        functionData: ['$http', '$stateParams', function ($http) {
                            return $http.get('/function/searFunction')
                        }]
                    },
                },

            }
        });
    }])
    .controller('addFunctionController', ['$scope', '$http', 'functionData', '$modal', '$state',
        function ($scope, $http, functionData, $modal, $state) {
            $scope.data = functionData.data;
            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    var params = {
                        mName: $scope.data.name,
                        mUrl: $scope.data.url,
                        mIfNavigationNode: $scope.data.IfNode,
                        mLayer: $scope.data.layer,
                        mOrder: $scope.data.order,
                        mParentId: $scope.data.menu ? $scope.data.menu.mId : ''
                    }
                    httpFunction('/function/addFunction', params);
                    return true;
                } else {
                    errorHint('请正确填写所有信息!!!');
                    return false;
                }
            };

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

            var successHint = function (message, method) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false,
                    onHide: method
                });
            };

            var httpFunction = function (url, params) {
                $http.post(url, params)
                    .success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            successHint(result.success, back);
                        }
                    })
                    .error(function (msg) {
                        errorHint('网络异常，请稍后重试!!!');
                        return false;
                    });
            };
            var back = function () {
                $state.go("home.menu");
            };
        }]);

