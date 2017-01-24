/**
 * Created by Administrator on 2017/1/23 0023.
 */
angular.module('robot.ill', [
    'robot.ill.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.ill', {
            url: '/ill',
            bookname: '常见疾病列表',
            parentsname: '疾病管理',
            views: {
                'content': {
                    controller: 'illController',
                    templateUrl: 'ill/commonIll/ill.tpl.html',
                    resolve: {
                        illListData: ['$http', function ($http) {
                            return $http.get('/ill/getIllInfoList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('illController', ['$scope', '$http', 'illListData', '$modal', '$uibModal',
        function ($scope, $http, illListData, $modal, $uibModal) {
            $scope.data = illListData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/ill/getIllInfoListByItem', params).success(function (result) {
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
                    $http.get('/ill/deleteIllInfo/' + data.illId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.illInfoList.splice(index, 1);
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
                    templateUrl: 'ill/commonIll/addOrUpdateIll.tpl.html',
                    size: size,
                    controller: 'addIllModalInstanceCtrl',
                    resolve: {
                        illData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/ill/getIllInfoById/' + id);
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


    .controller('addIllModalInstanceCtrl', ['$modal', '$scope', '$uibModalInstance', '$http', 'illData', '$state', 'dataList', 'ApiBaseUrl', '$timeout',
        function ($modal, $scope, $uibModalInstance, $http, illData, $state, dataList, ApiBaseUrl, $timeout) {
            $scope.data = illData.data;

            $scope.modalTitle = "添加信息";
            if ($scope.data.illInfo) {
                $scope.modalTitle = "编辑信息";
            }
            ;

            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    if ($scope.data.illInfo.illId) {
                        //编辑
                        var updateparams = {
                            illId: $scope.data.illInfo.illId,
                            illName:$scope.data.illInfo.illName,
                            illYW:$scope.data.illInfo.illYW,
                            illZZ:$scope.data.illInfo.illZZ
                        }
                        $http.post('/ill/editIllInfo', updateparams)
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
                                            dataList.data.illInfoList = result.illInfoList;
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
                            illName: $scope.data.illInfo.illName,
                            illYW:$scope.data.illInfo.illYW,
                            illZZ:$scope.data.illInfo.illZZ
                        }
                        $http.post('/ill/addIllInfo', params)
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
                                            dataList.data.illInfoList = result.illInfoList;
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