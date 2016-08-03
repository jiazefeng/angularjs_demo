angular.module('robot.menu.mock',[
  	'ngMockE2E',
  	'robot.common.mocksData'
])
	.run(['$httpBackend', 'mocksData', function($httpBackend, mocksData) {
		var data = {
			totalItems:110,
			currentPage:1,
			districtList:[
				{
					"name":"花园小区",
					"id":"1"
				},{
					"name":"幸福小区",
					"id":"2"
				},{
					"name":"北京小区",
					"id":"3"
				},{
					"name":"未来小区",
					"id":"4"
				}
			],
			contList:[
				{
					"userName":"王大",
					"job":"花园小区物管",
					"village":"花园小区",
					"role":"超级管理员",
					"mobile":"15210521111",
					"id":"1"
				},{
					"userName":"王二",
					"job":"北京小区物管",
					"village":"北京小区",
					"role":"机器人专业管理员",
					"mobile":"15210521111",
					"id":"2"
				},{
					"userName":"王三",
					"job":"未来小区物管",
					"village":"未来小区",
					"role":"物业专业管理员",
					"mobile":"15210521111",
					"id":"3"
				},{
					"userName":"王四",
					"job":"智慧小区物管",
					"village":"智慧小区",
					"role":"普通管理员",
					"mobile":"15210521111",
					"id":"4"
				}
			]
		}
		var result = mocksData.resetData(data);
		$httpBackend.whenGET('/user/getAdminInfo').respond(result);

		$httpBackend.whenGET('/function/searFunctionList').passThrough();

		var data2 = {

		}

		var result2 = mocksData.resetData(data2);
		$httpBackend.whenGET(/\/demo\/detele(\s\S)?/).respond(result2);
	}])
