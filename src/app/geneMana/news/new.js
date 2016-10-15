angular.module('robot.newInfo', [
    'robot.newInfo.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.newInfo', {
            url: '/newInfo',
            bookname: '',
            parentsname: '新闻管理',
            views: {
                'content': {
                    controller: 'newController',
                    templateUrl: 'geneMana/news/new.tpl.html',
                    resolve: {
                        userData: ['$http', function ($http) {
                            return $http.get('/news/searchNewsInfoList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('newController', ['$scope', '$http', 'userData','$modal',
        function ($scope, $http, userData,$modal) {
            $scope.data = userData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页


            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/user/searchUserByItem', params).success(function (result) {
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
                    scope:$scope
                });
                $scope.confirm = function(){
                    $http.delete('/user/deleteUserInfo/' + data.uId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.userInfoList.splice(index, 1);
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
        }])

