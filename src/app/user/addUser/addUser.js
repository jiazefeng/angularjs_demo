angular.module('robot.addUser', [
    'robot.addUser.mock',
    'ui.router'
])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('home.addUser', {
        url: '/addUser',
        bookname:'用户及角色管理',
        parentsname:'添加用户',
        views:{
            'content':{
                controller: 'addUserController',
                templateUrl: 'user/addUser/addUser.tpl.html',
                resolve:{
                    addUserData:['$http','$stateParams',function($http){
                        return $http.get('/user/addUser')
                    }]
                },
            },

        }
    });
}])
.controller('addUserController', ['$scope', '$http','addUserData',
    function($scope, $http,addUserData) {
        $scope.data = addUserData.data;
        $scope.data.contList.sex = "保密";
    //时间
    $scope.dateOptions = {
      maxDate: new Date(new Date().getTime() + 24*60*60*1000*365),
      minDate: new Date(new Date().getTime()),
      startingDay: 1,
    };
    $scope.open = function(type) {
        $scope.popup.opened = true;
    };
    $scope.popup = {
      opened: false
    };

}])

