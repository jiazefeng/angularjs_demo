angular.module('robot.editRanchingInfo.mock',[
  	'ngMockE2E',
  	'robot.common.mocksData'
])
	.run(['$httpBackend', 'mocksData', function($httpBackend, mocksData) {
		var data = {
			villageList:[
				{
					"villageName":"花园小区1",
					"id":"1"
				},{
					"villageName":"幸福花园小区",
					"id":"2"
				},{
					"villageName":"北京西二旗小区",
					"id":"3"
				},{
					"villageName":"未来小区",
					"id":"4"
				}
			],
			roleList:[
				{
					"roleName":"超级管理员",
					"id":"1"
				},{
					"roleName":"机器人专业管理员",
					"id":"2"
				},{
					"roleName":"物业专业管理员",
					"id":"3"
				},{
					"roleName":"普通管理员",
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
		$httpBackend.whenGET(/\/ranchingInfo\/searchRanchingInfById(\s\S)?/).passThrough();
		$httpBackend.whenPOST('/ranchingInfo/editRanchingInfo').passThrough();
		$httpBackend.whenGET('/file/upload').passThrough();
	}])