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
                    templateUrl: 'menu/menu.tpl.html',
                    resolve: {
                        functionData: ['$http', function ($http) {
                            return $http.get('/function/searFunctionList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('menuController', ['$scope', '$http', 'functionData',
        function ($scope, $http, functionData) {
            $scope.data = functionData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页
            $scope.commitCont = function (form) {
                if ($scope.data.district) {
                    var params = {
                        "districtId": $scope.data.district.id,
                        "user": $scope.data.user
                    }
                    console.log(params);
                } else {
                    alert('请选择小区');
                }

            };
            $scope.addUser = function (curType) {
                $scope.classifyUrl = "/user/addUser";
            };
//删除数据
            $scope.delete = function (data, index) {
                if (confirm("确定要删除吗?")) {
                    $http.get('/demo/detele/' + data.id).success(function (result) {
                        $scope.data.contList.splice(index, 1);
                    }).error(function (msg) {
                        alert('接口报错');
                    });
                }
            };

        }])

