angular.module('robot.common.login', [])

.service('Session', [function() {
    this.userInfoData = null;
    this.validTime = null;
    this.create = function(userInfoData, validTime) {
        this.userInfoData = userInfoData;
        this.validTime = validTime;
    };
    this.destroy = function() {
        this.userInfoData = null;
        this.validTime = null;
    };
    return this;
}])



.factory('CurrentUserService', ['$modal','$http', 'Session', '$filter','$timeout','$state','$rootScope',
  function($modal,$http, Session, $filter,$timeout,$state,$rootScope) {

    var currentUser = {};

    currentUser.login = function(credentials) {
        return $http.post('/login/login', credentials)
          .then(function(res) {
              if(res.data.error){
                  $modal({
                      title: '系统提示',
                      content:res.data.error,
                      show: true,
                      animation: 'am-fade-and-scale',
                      placement: 'center',
                      backdrop: false
                  });
                  return false;
              }else {
                  var validTime = parseInt($filter('date')(new Date(), 'yyyyMMdd')) + 2;
                  Session.create(res.data, validTime);
                  return res;
              }

          },
          function(data) {
              $modal({
                  title: '系统提示',
                  content: '登录失败',
                  show: true,
                  animation: 'am-fade-and-scale',
                  placement: 'center',
                  backdrop: false
              });
          });
    };
    currentUser.tokenBug = function(event, mass) {
        if ($state.current.name != "userLogin") {
            if ($rootScope.tokenBugThenFn) {
                $timeout.cancel($rootScope.tokenBugThenFn);
            }
            $rootScope.tokenBugThenFn = $timeout(function() {
                $modal({
                    title: '系统提示',
                    content: mass,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false
                });
                $rootScope.tokenBugThenFn = null;
            }, 50);
        }
    };    
    currentUser.userSession = function() {
        return Session;
    };
    currentUser.destroyUserSession = function() {
        Session.destroy();
        return Session;
    };
    currentUser.contains = function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    };

    return currentUser;
}])