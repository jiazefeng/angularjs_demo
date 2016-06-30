angular.module('robot.role', [
    'robot.role.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.role', {
            url: '/role',
            bookname: '用户及角色管理',
            parentsname: '角色管理',
            views: {
                'content': {
                    controller: 'roleController',
                    templateUrl: 'role/role.tpl.html',
                    resolve: {
                        roleData:['$http', function ($http) {
                            return $http.get('/role/getRoleList');
                        }]
                    },
                },
            }
        });
    }])

    .controller('roleController',['$scope', '$http','roleData',
        function ($scope, $http, roleData) {
            $scope.currentPage=1;
            $scope.totalItems = 110;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页
            $scope.roles = roleData.data;
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

        }]);
    //.controller('roleController', ['$scope', '$http',
    //    function ($scope, $http) {
    //        $http.get('/role/getRoleList')
    //            .success(function (resp) {
    //                alert(resp);
    //                $scope.roles = resp;
    //            })
    //            .error(function (msg) {
    //                alert($scope.msg = msg);
    //            });
    //
    //        $scope.roles = [];
    //        $scope.msg = "";
    //
    //    }])
//.controller('roleController', ['$scope', '$http',
//    function ($scope, $http) {
//        $scope.currentPage=1;
//        $scope.totalItems =110;
//        $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页
//
//        $scope.roles = [];
//        $scope.msg='';
//        var params = {
//              //需要提交的参数
//        };
//        $http.post('/role/getRoleList',params)
//
//            .success(function (data) {
//                $scope.roles = data;
//                alert($scope.roles);
//            })
//            .error(function (msg) {
//                alert($scope.msg=msg);
//            })
//            ;
//
//        $scope.commitCont = function (form) {
//            if ($scope.data.district) {
//                var params = {
//                    "districtId": $scope.data.district.id,
//                    "user": $scope.data.user
//                }
//                console.log(params);
//            } else {
//                alert('请选择小区');
//            }
//
//        };
//        $scope.addUser = function (curType) {
//            $scope.classifyUrl = "/user/addUser";
//        };
//        //删除数据
//        $scope.delete = function (data, index) {
//            if (confirm("确定要删除吗?")) {
//                $http.get('/demo/detele/' + data.id).success(function (result) {
//                    $scope.data.contList.splice(index, 1);
//                }).error(function (msg) {
//                    alert('接口报错');
//                });
//            }
//        };
//
//    }]);
