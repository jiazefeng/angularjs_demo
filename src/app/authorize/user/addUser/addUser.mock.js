angular.module('robot.addUser.mock',[
  	'ngMockE2E',
  	'robot.common.mocksData'
])
	.run(['$httpBackend', 'mocksData', function($httpBackend, mocksData) {
		var data = {
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
			role:[
				{
					"name":"超级管理员",
					"id":"1"
				},{
					"name":"机器人专业管理员",
					"id":"2"
				},{
					"name":"物业专业管理员",
					"id":"3"
				},{
					"name":"普通管理员",
					"id":"4"
				}
			],
			contList:[
				{
					"userName":"阿斯顿",
					'role':"",
					"pwd":"",
					'img':"",
					'sex':"",
					'birthday':"",
					'mobile':"",
					'village':"",
					'post':"物管"
				}
			]
		}
		var result = mocksData.resetData(data);
		$httpBackend.whenGET('/role/searchRoleInfo').passThrough();
		$httpBackend.whenPOST('/user/addUser').passThrough();
		var data2 = {

		}

		var result2 = mocksData.resetData(data2);
		$httpBackend.whenGET(/\/demo\/detele(\s\S)?/).respond(result2);
	}])
