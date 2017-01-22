angular.module('robot.feed', [
    'robot.feed.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.feed', {
            url: '/feed',
            bookname: '饲料列表',
            parentsname: '物资管理',
            views: {
                'content': {
                    controller: 'feedController',
                    templateUrl: 'MaterialsManager/feedManager/feed.tpl.html',
                    resolve: {
                        feedListData: ['$http', function ($http) {
                            return $http.get('/feed/getFeedInfoList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('feedController', ['$scope', '$http', 'feedListData', '$modal','$uibModal',
        function ($scope, $http, feedListData, $modal,$uibModal) {
            $scope.data = feedListData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/feed/getFeedInfoList', params).success(function (result) {
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
                    $http.get('/feed/deleteFeed/' + data.feedId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.feedInfoList.splice(index, 1);
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

            //添加/修改物资
            $scope.openModal = function (size, id, index) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'MaterialsManager/feedManager/addOrUpdateFeed.tpl.html',
                    size: size,
                    controller: 'addFeedModalInstanceCtrl',
                    resolve: {
                        feedData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/feed/searchFeedById/' + id);
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


    .controller('addFeedModalInstanceCtrl', ['$modal', '$scope', '$uibModalInstance', '$http', 'feedData', '$state', 'dataList', 'ApiBaseUrl', '$timeout',
        function ($modal, $scope, $uibModalInstance, $http, feedData, $state, dataList, ApiBaseUrl, $timeout) {
            $scope.data = feedData.data;

            $scope.modalTitle = "添加饲料";
            if ($scope.data.feedInfo) {
                $scope.modalTitle = "编辑饲料";
            }
            ;

            $scope.commitForm = function (myForm) {
                if (myForm.$valid) {
                    if ($scope.data.feedInfo.feedId) {
                        //编辑
                        var updateparams = {
                            feedId: $scope.data.feedInfo.feedId,
                            feedName: $scope.data.feedInfo.feedName,
                            describe: $scope.data.feedInfo.feedDescribe,
                            type: $scope.data.feedInfo.feedType
                        }
                        $http.post('/feed/editFeed', updateparams)
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
                                            dataList.data.feedInfoList = result.feedInfoList;
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
                            feedName: $scope.data.feedInfo.feedName,
                            describe: $scope.data.feedInfo.feedDescribe,
                            type: $scope.data.feedInfo.feedType
                        }
                        $http.post('/feed/addFeed', params)
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
                                            dataList.data.feedInfoList = result.feedInfoList;
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