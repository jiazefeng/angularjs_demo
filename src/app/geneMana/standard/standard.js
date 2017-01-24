angular.module('robot.standard', [
    'robot.standard.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.standard', {
            url: '/standard',
            bookname: '标准规范',
            parentsname: '综合管理',
            views: {
                'content': {
                    controller: 'standardController',
                    templateUrl: 'geneMana/standard/standard.tpl.html',
                    resolve: {
                        standardListData: ['$http', function ($http) {
                            return $http.get('/standard/searchStandardList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('standardController', ['$scope', '$http', 'standardListData', '$modal', '$uibModal',
        function ($scope, $http, standardListData, $modal, $uibModal) {
            $scope.data = standardListData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/standard/searchStandardListByItem', params).success(function (result) {
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
                    $http.get('/standard/deleteStandard/' + data.standardId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.standardEntities.splice(index, 1);
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
                    templateUrl: 'geneMana/standard/addOrUpdateStandard.tpl.html',
                    size: size,
                    controller: 'addStandardModalInstanceCtrl',
                    resolve: {
                        standardData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/standard/searchStandardById/' + id);
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


    .controller('addStandardModalInstanceCtrl', ['$modal', '$scope', '$uibModalInstance', '$http', 'standardData', '$state', 'dataList', 'ApiBaseUrl', '$timeout',
        function ($modal, $scope, $uibModalInstance, $http, standardData, $state, dataList, ApiBaseUrl, $timeout) {
            $scope.data = standardData.data;

            $scope.modalTitle = "添加信息";
            if ($scope.data.standardInfo) {
                $scope.modalTitle = "编辑信息";
            }
            ;

            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    if ($scope.data.standardInfo.standardId) {
                        //编辑
                        var updateparams = {
                            standardId: $scope.data.standardInfo.standardId,
                            standardNum: $scope.data.standardInfo.standardNum,
                            standardTitle: $scope.data.standardInfo.standardTitle,
                            standardUrl: $scope.data.standardInfo.standardUrl,
                            standardDate: $scope.data.standardInfo.standardDate
                        }
                        $http.post('/standard/editStandard', updateparams)
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
                                            dataList.data.standardEntities = result.standardEntities;
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
                            standardNum: $scope.data.standardInfo.standardNum,
                            standardTitle: $scope.data.standardInfo.standardTitle,
                            standardUrl: $scope.data.standardInfo.standardUrl,
                            standardDate: $scope.data.standardInfo.standardDate
                        }
                        $http.post('/standard/addStandard', params)
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
                                            dataList.data.standardEntities = result.standardEntities;
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