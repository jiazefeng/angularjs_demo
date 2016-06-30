angular.module('robot.addRole', [
    'robot.addRole.mock',
    'ui.router'
])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home.addRole', {
      	url: '/addRole',
      	bookname:'用户及角色管理',
      	parentsname:'添加角色',
    		views:{
    			'content':{
    				controller: 'addRoleController',
    				templateUrl: 'role/addRole/addRole.tpl.html',
            resolve:{
              addRoleData:['$http',function($http){
                return $http.get('/role/addRole')
              }]
            }, 
    		},
		  }
  });
}])
    .controller('addRoleController', ['$scope', '$http','addRoleData',
        function($scope, $http,addRoleData) {
            $scope.data = addRoleData.data;
        }])

