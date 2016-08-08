angular.module('robot.home.mock', [
    'ngMockE2E',
    'robot.common.mocksData'
])

    .run(['$httpBackend', 'mocksData', function ($httpBackend, mocksData) {
        var data = [
            {
                "menuName": "授权管理",
                "icon": "arrows-alt",
                "childMenuList": [
                    {
                        "menuName": "菜单管理",
                        "runscript": "/home/menu",
                        "menuId": "1"
                    },{
                        "menuName": "用户管理",
                        "runscript": "/home/user",
                        "menuId": "1"
                    }, {
                        "menuName": "角色管理",
                        "runscript": "/home/role",
                        "menuId": "1"
                    }
                ]
            }
        ];
        var result = mocksData.resetData(data);
        $httpBackend.whenGET('/type/typeList').respond(result);
        var userData = {
            userName: "Admin",
            userId: "1",
        }
        var result1 = mocksData.resetData(userData);
        $httpBackend.whenGET('/user/getUserInfo').respond(result1);


        $httpBackend.whenGET(/\/user\/logout(\s\S)?/).passThrough();
        $httpBackend.whenPOST('/user/updateUserPwd').passThrough();
    }])