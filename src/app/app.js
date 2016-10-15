angular.module('robotSupervise.app', [
    'ui.router',
    'ui.bootstrap',
    'maxrocky.framework',
    'robot.app.config',
    'robot.templates',
    'robot.common',
    'robot.home',
    'mgcrea.ngStrap.modal',
    'robot.userLogin',
    'robot.authorize',
    'robot.farm',
    'robot.geneMana'
])

    .run(['$rootScope', 'CurrentUserService', '$httpBackend', 'mrBookMarksService', 'Session', '$state', '$http', '$filter', '$timeout', '$modal',
        function ($rootScope, CurrentUserService, $httpBackend, mrBookMarksService, Session, $state, $http, $filter, $timeout, $modal) {
            $rootScope.bookMarks = [];
            $rootScope.$on('tokenBug', function (event, mass) {
                CurrentUserService.tokenBug(event, mass);
            });

            $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
                var isHasAuthority = false;
                var authorityList = ["/home/index", "/home/reviseUser"];
                console.log(Session.userInfoData);
                if (Session.userInfoData) isHasAuthority = hasAuthority(Session.userInfoData);
                if ((toState.name == 'userLogin') || isHasAuthority) return;

                if ($rootScope.$$allowChangeScope) {
                    $rootScope.$$allowChangeScope = false;
                    mrBookMarksService.pushNewState($rootScope, toState);
                    return;
                }

                // 如果是进入登录界面则允许
                function isInAuthorityList(authorityList, toUrl) {
                    var s = String.fromCharCode(2);
                    var r = new RegExp(s + toUrl + s);
                    return (r.test(s + authorityList.join(s) + s));
                }

                //获取权限列表的url
                var toUrl;

                function hasAuthority(data) {
                    var reg = /^(\/\w+){2}/;
                    for (var i = 0; i < data.menuList.length; i++) {
                        if(data.menuList[i].allSubmenuList){
                            for (var j = 0; j < data.menuList[i].allSubmenuList.length; j++) {
                                var childMenu = data.menuList[i].allSubmenuList[j];
                                authorityList.push(reg.exec(childMenu.mUrl)[0]);
                                //if (childMenu.threeMenuList) {
                                //    for (var k = 0; k < childMenu.threeMenuList.length; k++) {
                                //        authorityList.push(childMenu.threeMenuList[k].runscript.match(reg)[0]);
                                //    }
                                //}
                            }
                        }
                    }
                    ;
                    //获取目标页面的url
                    toUrl = '/home/' + toState.url.split("/")[1];
                    return isInAuthorityList(authorityList, toUrl);
                }

                var skip = function () {
                    $state.go("userLogin", {}, {location: 'replace'});//跳转到登录界面
                };
                var successHint = function (message, method) {
                    $modal({
                        title: '系统提示',
                        content: message,
                        show: true,
                        animation: 'am-fade-and-scale',
                        placement: 'center',
                        backdrop: false,
                        onHide: method
                    });
                };

                $http.get('/user/getRoleAndUserByTokenId').then(
                    function (res) {
                        var validTime = parseInt($filter('date')(new Date(), 'yyyyMMdd')) + 2;
                        Session.create(res.data, validTime);
                        if (!hasAuthority(res.data)) {
                            successHint('您的权限不足', skip);
                            return;
                        } else {
                            $rootScope.$$allowChangeScope = true;
                            $state.go(toState.name, toParams, {location: 'replace'});
                        }
                    }
                ), function (data) {
                    successHint('用户未登录', skip);
                };
                console.log(1);
                evt.preventDefault();
            });
        }
    ])

    .controller('AppController', ['$window', '$state',
        function ($window, $state) {

        }
    ])