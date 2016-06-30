angular.module('maxrocky.framework.servers.bookmarks', [])


.factory('mrBookMarksService', ['mrMathService',
    function(mrMathService) {
        var bookMarks = {};
        bookMarks.pushNewState=function($rootScope,toState){
            var mmm = mrMathService.contains($rootScope.bookMarks,toState);
            if (!mmm) {//判断toState.name是否在 $rootScope.bookMarks数组里面
                // $rootScope.bookMarks.push('/home'+toState.url);
                $rootScope.bookMarks.push(toState);
            }
        }
        return bookMarks;
    }
])