angular.module('robot.userInfo', [
    'robot.userInfo.mock',
    'ui.router'
])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home.user', {
      	url: '/user',
      	bookname:'用户及角色管理',
      	parentsname:'用户管理',
    		views:{
    			'content':{
    				controller: 'userController',
    				templateUrl: 'authorize/user/user.tpl.html',
            resolve:{
              userData:['$http',function($http){
                return $http.get('/user/getAdminInfo')
              }]
            }, 
    		},
		  }
  });
}])
    .controller('userController', ['$scope', '$http','userData',
        function($scope, $http,userData) {
            $scope.data = userData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页
            $scope.commitCont = function(form){
                if($scope.data.district){
                    var params = {
                        "districtId":$scope.data.district.id,
                        "user":$scope.data.user
                    }
                    console.log(params);
                }else{
                    alert('请选择小区');
                }

            };
            $scope.addUser = function(curType){
                $scope.classifyUrl = "/user/addUser";
            };
            //删除数据
            $scope.delete = function(data,index){
                if(confirm("确定要删除吗?")){
                    $http.get('/demo/detele/'+data.id).success(function(result){
                        $scope.data.contList.splice(index,1);
                    }).error(function(msg) {
                        alert('接口报错');
                    });
                }
            };

        }])

