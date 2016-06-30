angular.module('robot.home.mock', [
    'ngMockE2E',
    'robot.common.mocksData'
])

    .run(['$httpBackend', 'mocksData', function ($httpBackend, mocksData) {
        var data = [
            //{
            //    "name": "机器人管理",
            //    "icon": "arrows-alt",
            //    "classify": [
            //        {
            //            "classifyName": "小区配置管理",
            //            "classifyUrl": "/home/district",
            //            "classifyId": "1",
            //            "menuList": [
            //                {
            //                    "classifyName": "机器人配置管理",
            //                    "classifyUrl": "/home",
            //                    "classifyId": "1"
            //                }
            //            ]
            //        }, {
            //            "classifyName": "方案管理",
            //            "classifyUrl": "/home",
            //            "classifyId": "1"
            //        }, {
            //            "classifyName": "机器人配置管理",
            //            "classifyUrl": "/home",
            //            "classifyId": "1"
            //        }
            //    ]
            //}, {
            //    "name": "信息管理",
            //    "icon": "commenting-o",
            //    "classify": [
            //        {
            //            "classifyName": "机器人状态",
            //            "classifyUrl": "/home/wuye/propertyCompany",
            //            "classifyId": "1"
            //        }, {
            //            "classifyName": "视频及图片",
            //            "classifyUrl": "/home/video",
            //            "classifyId": "1",
            //            "menuList": [
            //                {
            //                    "classifyName": "图片",
            //                    "classifyUrl": "/home/picture",
            //                    "classifyId": "1",
            //                }
            //            ]
            //        }, {
            //            "classifyName": "报警信息",
            //            "classifyUrl": "/home/alarmInfo",
            //            "classifyId": "1"
            //        }
            //    ]
            //},
            {
                "name": "用户及角色管理",
                "icon": "user",
                "classify": [
                    {
                        "classifyName": "用户管理",
                        "classifyUrl": "/home/user",
                        "classifyId": "1"
                    }, {
                        "classifyName": "角色管理",
                        "classifyUrl": "/home/role",
                        "classifyId": "1"
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
    }])