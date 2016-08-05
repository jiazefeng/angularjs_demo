angular.module('robot.editMenu', [
    'robot.editMenu.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.editMenu', {
            url: '/menu/editMenu/:mId',
            bookname: '编辑管理',
            parentsname: '菜单管理',
            views: {
                'content': {
                    controller: 'editFunctionController',
                    templateUrl: 'authorize/menu/edit/edit.tpl.html',
                    resolve: {
                        functionInfoData: ['$http', '$stateParams', function ($http,$stateParams) {
                            return $http.get('/function/searchFunctionById/'+$stateParams.mId)
                        }]
                    },
                },

            }
        });
    }])
    .controller('editFunctionController', ['$scope', '$http', '$modal', '$state','functionInfoData',
        function ($scope, $http, $modal, $state,functionInfoData) {
            $scope.data = functionInfoData.data;

            //所属菜单赋值
            for (var i = 0; i < $scope.data.functionList.length; i++) {
                if ($scope.data.functionList[i].mId == $scope.data.functionInfo.mParentId) {
                    $scope.data.menu = $scope.data.functionList[i];
                }
            };

            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    var params = {
                        mId:$scope.data.functionInfo.mId,
                        mName: $scope.data.functionInfo.mName,
                        mUrl: $scope.data.functionInfo.mUrl,
                        mIfNavigationNode: $scope.data.functionInfo.mIfNavigationNode,
                        mLayer: $scope.data.functionInfo.mLayer,
                        mOrder: $scope.data.functionInfo.mOrder,
                        mParentId: $scope.data.menu ? $scope.data.menu.mId : ''
                    }
                    httpFunction('/function/editFunction', params);
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

