angular.module('robot.addRole', [
    'robot.addRole.mock',
    'ui.router'
])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.addRole', {
            url: '/role/addRole',
            bookname: '添加角色',
            parentsname: '角色管理',
            views: {
                'content': {
                    controller: 'addRoleController',
                    templateUrl: 'authorize/role/addRole/addRole.tpl.html',
                    resolve: {
                        functionData: ['$http', function ($http) {
                            return $http.get('/function/searchFunctionMenu')
                        }]
                    },
                },
            }
        });
    }])
    .controller('addRoleController', ['$scope', '$http', 'functionData', '$state', '$modal',
        function ($scope, $http, functionData, $state, $modal) {
            $scope.data = functionData.data;
            $scope.data.state = 1;
            var back = function () {
                $state.go("home.role");
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


            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    var authorityId = [];
                    for (var k = 0; k < $scope.data.menuList.length; k++) {
                        var menus = $scope.data.menuList[k];
                        var isIn = true;
                        for (var i = 0; i < menus.allSubmenuList.length; i++) {
                            if (menus.allSubmenuList[i].menu) {
                                authorityId.push({id: menus.allSubmenuList[i].mId});
                                if (isIn) {
                                    authorityId.push({id: menus.mId});
                                    isIn = false;
                                }
                            }
                        }
                    }
                    ;
                    if (authorityId.length <= 0) {
                        errorHint("请选择角色所拥有的权限");
                        return false;
                    }
                    console.log(authorityId);
                    var params = {
                        rName: $scope.data.name,
                        rState: $scope.data.state,
                        functionMenus: authorityId
                    }
                    httpFunction('/role/addRole', params);
                    return true;
                } else {
                    errorHint('您填写的信息不完整!!!');
                    return false;
                }

            };
            //全选、全不选
            $scope.allCheck = function (mainMenu) {
                if (mainMenu.allChecked) {
                    for (var i = 0; i < mainMenu.allSubmenuList.length; i++) {
                        mainMenu.allSubmenuList[i].menu = true;
                    }
                } else {
                    for (var i = 0; i < mainMenu.allSubmenuList.length; i++) {
                        mainMenu.allSubmenuList[i].menu = false;
                    }
                }
            };
            $scope.check = function (subMenu, mainMenu) {
                var checkedNum = 0;
                if (subMenu.menu) {
                    for (var i = 0; i < mainMenu.allSubmenuList.length; i++) {
                        if (mainMenu.allSubmenuList.menu) {
                            checkedNum++;
                            if (checkedNum == mainMenu.allSubmenuList.length) {
                                roleData.allChecked = true;
                            }
                        } else {
                            mainMenu.allChecked = false;
                            return;
                        }
                    }
                } else {
                    mainMenu.allChecked = false;
                }
            };

        }])

