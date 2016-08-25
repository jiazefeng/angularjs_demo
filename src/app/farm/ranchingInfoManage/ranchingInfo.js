angular.module('robot.ranchingInfo', [
    'robot.ranchingInfo.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.ranchingInfo', {
            url: '/ranchingInfo',
            bookname: '畜牧管理',
            parentsname: '农场管理',
            cache: 'false',
            views: {
                'content': {
                    controller: 'ranchingInfoController',
                    templateUrl: 'farm/ranchingInfoManage/ranchingInfo.tpl.html',
                    resolve: {
                        ranchingInfoData: ['$http', function ($http) {
                            return $http.get("/ranchingInfo/searchRanchingInfoList");
                        }],
                        ranchingTypeData: ['$http', '$stateParams', function ($http) {
                            return $http.get('/ranchingType/searchRanchingType')
                        }]
                    },
                },
            }
        })
        ;
    }])
    .controller('ranchingInfoController', ['$modal', '$scope', '$http', 'ranchingInfoData', 'Session', 'ranchingTypeData',
        function ($modal, $scope, $http, ranchingInfoData, Session, ranchingTypeData) {
            $scope.data = ranchingInfoData.data;
            $scope.data.ranchingTypeList = ranchingTypeData.data.ranchingTypeList
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

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
            $scope.empty = function () {
                $scope.data.number = "";
                $scope.data.name = "";
                $scope.data.ranchingType = "";
            }
            $scope.commitCont = function (form) {
                var params = {
                    index: $scope.data.page,
                    number: $scope.data.number,
                    name: $scope.data.name,
                    ranchingTypeId: $scope.data.ranchingType ? $scope.data.ranchingType.id : ""
                }
                $http.post('/ranchingInfo/searchRanchingInfoByItem', params).success(function (result) {
                    $scope.data.ranchingInfoList = result.ranchingInfoList;
                    $scope.data.count = result.count;
                }).error(function (msg) {
                    errorHint('网络异常，请稍后重试!!!');
                });

            };
            $scope.addUser = function (curType) {
                $scope.classifyUrl = "/user/addUser";
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
                    $http.delete('/ranchingInfo/deleteRanchingInfo/' + data.id).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.ranchingInfoList.splice(index, 1);
                        }
                    }).error(function (msg) {
                        errorHint('网络异常，请稍后重试!!!');
                    });
                    confirmModal.$promise.then(confirmModal.hide);
                };
            };

        }])

