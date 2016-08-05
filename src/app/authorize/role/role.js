angular.module('robot.role', [
    'robot.role.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.role', {
            url: '/role',
            bookname: '角色管理',
            parentsname: '授权管理',
            views: {
                'content': {
                    controller: 'roleController',
                    templateUrl: 'authorize/role/role.tpl.html',
                    resolve: {
                        roleData: ['$http', function ($http) {
                            return $http.get('/role/searchRoleList');
                        }]
                    },
                },
            }
        });
    }])

    .controller('roleController', ['$scope', '$http', 'roleData',
        function ($scope, $http, roleData) {
            $scope.data = roleData.data;
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
        }]);
