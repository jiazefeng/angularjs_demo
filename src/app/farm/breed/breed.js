angular.module('robot.breed', [
    'robot.breed.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.breed', {
            url: '/breed',
            bookname: '繁殖管理',
            parentsname: '牛群管理',
            views: {
                'content': {
                    controller: 'breedController',
                    templateUrl: 'farm/breed/breed.tpl.html',
                    resolve: {
                        breedListData: ['$http', function ($http) {
                            return $http.get('/breed/searBreedList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('breedController', ['$scope', '$http', 'breedListData', '$modal', '$uibModal',
        function ($scope, $http, breedListData, $modal, $uibModal) {
            $scope.data = breedListData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/breed/searBreedListByItem', params).success(function (result) {
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
                    $http.get('/breed/deleteBreed/' + data.breedId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.breedInfoList.splice(index, 1);
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
                    templateUrl: 'farm/breed/addOrUpdateBreed.tpl.html',
                    size: size,
                    controller: 'addBreedModalInstanceCtrl',
                    resolve: {
                        breedData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/breed/searchBreedById/' + id);
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


    .controller('addBreedModalInstanceCtrl', ['$modal', '$scope', '$uibModalInstance', '$http', 'breedData', '$state', 'dataList', 'ApiBaseUrl', '$timeout',
        function ($modal, $scope, $uibModalInstance, $http, breedData, $state, dataList, ApiBaseUrl, $timeout) {
            $scope.data = breedData.data;

            $scope.modalTitle = "添加信息";
            if ($scope.data.breedInfo) {
                $scope.modalTitle = "编辑信息";
            }
            ;

            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    if ($scope.data.breedInfo.breedId) {
                        //编辑
                        var updateparams = {
                            breedId: $scope.data.breedInfo.breedId,
                            breedNum: $scope.data.breedInfo.breedNum,
                            breedHomeNum: $scope.data.breedInfo.breedHomeNum,
                            breedType: $scope.data.breedInfo.breedType
                        }
                        $http.post('/breed/editBreed', updateparams)
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
                                            dataList.data.breedInfoList = result.breedInfoList;
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
                            breedNum: $scope.data.breedInfo.breedNum,
                            breedHomeNum: $scope.data.breedInfo.breedHomeNum,
                            breedType: $scope.data.breedInfo.breedType
                        }
                        $http.post('/breed/addBreed', params)
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
                                            dataList.data.breedInfoList = result.breedInfoList;
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