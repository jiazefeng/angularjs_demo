angular.module('robot.userLogin.mock',[
  	'ngMockE2E',
  	'robot.common.mocksData'
])
.run(['$httpBackend', 'mocksData', function($httpBackend, mocksData) {
	var data = {
		totalItems:110,
		currentPage:1
	}
	var result = mocksData.resetData(data);  
		$httpBackend.whenGET('/login/loginByItem').respond(result);
		$httpBackend.whenPOST('/login/login').passThrough();
		$httpBackend.whenGET('/user/getRoleAndUserByTokenId').passThrough();
}])
