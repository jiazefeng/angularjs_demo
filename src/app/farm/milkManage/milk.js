angular.module('robot.milk', [
    'robot.milk.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.milk', {
            url: '/milk',
            bookname: '产奶管理列表',
            parentsname: '牛群管理',
            views: {
                'content': {
                    controller: 'milkController',
                    templateUrl: 'farm/milkManage/milk.tpl.html',
                    resolve: {
                        milkListData: ['$http', function ($http) {
                            return $http.get('/milk/getMilkInfoList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('milkController', ['$scope', '$http', 'milkListData', '$modal', '$uibModal',
        function ($scope, $http, milkListData, $modal, $uibModal) {
            $scope.data = milkListData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/milk/getMilkInfoListByItem', params).success(function (result) {
                    $scope.data = result;
                }).error(function (msg) {
                    errorHint('网络异常，请稍后重试!!!');
                });
            };

            //删除数据
            $scope.delete = function (data, index) {
                var confirmModal = $modal({
                    title: '系统提示',
                    content: '确定要删除吗？',
                    template: 'home/confirmModal.tpl.html',
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false,
                    scope: $scope
                });
                $scope.confirm = function () {
                    $http.get('/milk/deleteMilkInfo/' + data.milkId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.milkInfoList.splice(index, 1);
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

            //添加/修改信息
            $scope.openModal = function (size, id, index) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'farm/milkManage/addOrUpdateMilk.tpl.html',
                    size: size,
                    controller: 'addMilkModalInstanceCtrl',
                    resolve: {
                        milkData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/milk/getMilkInfoById/' + id);
                        }],
                        dataList: ['$http', '$stateParams', function ($http, $stateParams) {
                            var oldData = {
                                data: $scope.data,
                                index: index
                            }
                            return oldData;
                        }]
                    }

                });
            }
        }])


    .controller('addMilkModalInstanceCtrl', ['$modal', '$scope', '$uibModalInstance', '$http', 'milkData', '$state', 'dataList', 'ApiBaseUrl', '$timeout',
        function ($modal, $scope, $uibModalInstance, $http, milkData, $state, dataList, ApiBaseUrl, $timeout) {
            $scope.data = milkData.data;

            $scope.modalTitle = "添加信息";
            if ($scope.data.milkInfo) {
                $scope.modalTitle = "编辑信息";
            }
            ;

            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    if ($scope.data.milkInfo.milkId) {
                        //编辑
                        var updateparams = {
                            milkId: $scope.data.milkInfo.milkId,
                            individualRegistration: $scope.data.milkInfo.individualRegistration,
                            groupRegistration: $scope.data.milkInfo.groupRegistration
                        }
                        $http.post('/milk/editMilkInfo', updateparams)
                            .success(function (result) {
                                if (result.error) {
                                    Tips(result.error);
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
                                        onHide: function () {
                                            dataList.data.milkInfoList = result.milkInfoList;
                                            $uibModalInstance.close();
                                        }
                                    });
                                    // return true;
                                }
                            })
                            .error(function (msg) {
                                Tips("网络异常,请稍后重试!!!");
                            });
                    } else {
                        //添加
                        var params = {
                            individualRegistration: $scope.data.milkInfo.individualRegistration,
                            groupRegistration: $scope.data.milkInfo.groupRegistration
                        }
                        $http.post('/milk/addMilkInfo', params)
                            .success(function (result) {
                                if (result.error) {
                                    Tips(result.error);
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
                                        onHide: function () {
                                            dataList.data.milkInfoList = result.milkInfoList;
                                            dataList.data.count = result.count;
                                            $uibModalInstance.close();
                                        }
                                    });
                                }
                            })
                            .error(function (msg) {
                                Tips("网络异常,请稍后重试!!!");
                                //$uibModalInstance.close();
                            });
                    }
                    //return true;
                } else {
                    Tips("请填写所有信息!!!");
                    return false;
                }

            };

            var Tips = function (message) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false
                });
            };


            $scope.ok = function (myForm) {
                //$uibModalInstance.close();
                $scope.commitForm(myForm);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }])