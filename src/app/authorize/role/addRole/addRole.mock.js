angular.module('robot.addRole.mock',[
  	'ngMockE2E',
  	'robot.common.mocksData'
])
	.run(['$httpBackend', 'mocksData', function($httpBackend, mocksData) {
		var data = {
			totalItems:110,
			currentPage:1,
			roleList:{
				"name":"机器人管理",
				"id":"1",
				"menuList":[
					{
						"menuName":"小区配置管理",
						"menuId":"1"
					},{
						"menuName":"路径规划管理",
						"menuId":"2"
					},{
						"menuName":"方案管理",
						"menuId":"3"
					},{
						"menuName":"机器人控制管理",
						"menuId":"4"
					}
				]
			}
		}
		var result = mocksData.resetData(data);
		$httpBackend.whenGET('/function/searchFunctionMenu').passThrough();
		$httpBackend.whenPOST('/role/addRole').passThrough();
		var data2 = {

		}

		var result2 = mocksData.resetData(data2);
		$httpBackend.whenGET(/\/demo\/detele(\s\S)?/).respond(result2);
	}])
