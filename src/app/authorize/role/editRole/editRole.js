angular.module('robot.editRole', [
    'robot.editRole.mock',
    'ui.router'
])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.editRole', {
            url: '/role/editRole/:roleId',
            bookname: '编辑角色',
            parentsname: '角色管理',
            views: {
                'content': {
                    controller: 'editRoleController',
                    templateUrl: 'authorize/role/editRole/editRole.tpl.html',
                    resolve: {
                        editRoleData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/role/searchRoleInfoByRoleId/' + $stateParams.roleId);
                        }]
                    },
                },
            }
        });
    }])
    .controller('editRoleController', ['$modal', '$scope', '$http', 'editRoleData', '$state',
        function ($modal, $scope, $http, editRoleData, $state) {
            $scope.data = editRoleData.data;

            $scope.back = function () {
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
                            successHint(result.success, $scope.back);
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
                        if( menus.allSubmenuList){
                            for (var i = 0; i < menus.allSubmenuList.length; i++) {
                                if (menus.allSubmenuList[i].menu) {
                                    authorityId.push({id: menus.allSubmenuList[i].mId});
                                }
                            }
                        }
                        if (isIn) {
                            authorityId.push({id: menus.mId});
                            isIn = false;
                        }
                    }
                    ;
                    if (authorityId.length <= 0) {
                        errorHint("请选择角色所拥有的权限");
                        return false;
                    }
                    console.log(authorityId);
                    var params = {
                        rId:$scope.data.roleInfo.rId,
                        rName: $scope.data.roleInfo.rName,
                        rState: $scope.data.roleInfo.rState,
                        functionMenus: authorityId
                    }
                    httpFunction('/role/editRoleInfo', params);
                    return true;
                } else {
                    errorHint('您填写的信息不完整!!!');
                    return false;
                }

            };
            //全选、全不选
            $scope.allCheck = function (mainMenu) {
                if (mainMenu.allChecked) {
                    if(mainMenu.allSubmenuList){
                        for (var i = 0; i < mainMenu.allSubmenuList.length; i++) {
                            mainMenu.allSubmenuList[i].menu = true;
                        }
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
                    if(mainMenu.allSubmenuList){
                        for (var i = 0; i < mainMenu.allSubmenuList.length; i++) {
                            if (mainMenu.allSubmenuList[i].menu) {
                                checkedNum++;
                                if (checkedNum == mainMenu.allSubmenuList.length) {
                                    mainMenu.allChecked = true;
                                }
                            } else {
                                mainMenu.allChecked = false;
                                return;
                            }
                        }
                    }
                } else {
                    mainMenu.allChecked = false;
                }
            };


            //权限赋值
            for (var j = 0; j < $scope.data.menuList.length; j++) {
                if($scope.data.menuList[j].allSubmenuList){
                    for (var n = 0; n < $scope.data.menuList[j].allSubmenuList.length; n++) {
                        var childMenu = $scope.data.menuList[j].allSubmenuList[n];
                        var checkedNum1 = 0;
                        $.each($scope.data.roleFunctionList, function (n, value) {
                            if (value.funcId == childMenu.mId) {
                                childMenu.menu = true;
                                $scope.check(childMenu, $scope.data.menuList[j]);
                                checkedNum1++;
                                if (checkedNum1 == $scope.data.menuList[j].allSubmenuList.length) {
                                    $scope.data.menuList[j].allChecked = true;
                                }
                            }
                            ;
                        });
                    }
                }

            }
            ;

        }])

