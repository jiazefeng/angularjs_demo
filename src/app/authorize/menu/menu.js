angular.module('robot.menu', [
    'robot.menu.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.menu', {
            url: '/menu',
            bookname: '',
            parentsname: '菜单管理',
            views: {
                'content': {
                    controller: 'menuController',
                    templateUrl: 'authorize/menu/menu.tpl.html',
                    resolve: {
                        functionData: ['$http', function ($http) {
                            return $http.get('/function/searFunctionList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('menuController', ['$scope', '$http', 'functionData','$modal',
        function ($scope, $http, functionData,$modal) {
            $scope.data = functionData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            //分页、条件查询
            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/function/searFunctionListByItem', params).success(function (result) {
                    $scope.data = result;
                }).error(function (msg) {
                    errorHint('网络异常，请稍后重试!!!');
                });

            };

            //删除数据
            $scope.delete = function (id, index) {
                var confirmModal = $modal({
                    title: '系统提示',
                    content: '确定要删除吗？',
                    template: 'home/confirmModal.tpl.html',
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false,
                    scope:$scope
                });
                $scope.confirm = function(){
                    $http.get('/function/deleteFunction/' + id).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.menuList.splice(index, 1);
                        }
                    }).error(function (msg) {
                        errorHint('网络异常，请稍后重试!!!');
                    });
                    confirmModal.$promise.then(confirmModal.hide);
                };
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


        }])

