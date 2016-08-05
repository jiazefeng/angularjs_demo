angular.module('robot.role.mock',[
  	'ngMockE2E',
  	'robot.common.mocksData'
])
	.run(['$httpBackend', 'mocksData', function($httpBackend, mocksData) {
		var data = {
			totalItems:110,
			currentPage:1,
			roleList:[
				{
					"name":"超级管理员",
					"state":"启用",
					"id":"1"
				},{
					"name":"机器人专业管理员",
					"state":"停用",
					"id":"2"
				},{
					"name":"物业专业管理员",
					"state":"启用",
					"id":"3"
				},{
					"name":"普通管理员",
					"state":"启用",
					"id":"4"
				}
			]
		}
		var result = mocksData.resetData(data);
		$httpBackend.whenGET('/role/getRoleList').respond(result);
		$httpBackend.whenGET('/role/searchRoleList').passThrough();

		var data2 = {

		}

		var result2 = mocksData.resetData(data2);
		$httpBackend.whenGET(/\/demo\/detele(\s\S)?/).respond(result2);
	}])
