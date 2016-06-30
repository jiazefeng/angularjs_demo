angular.module('maxrocky.framework.servers.math', [])


.factory('mrMathService', [
    function() {
        var math = {};
  
        math.contains = function(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        return math;
    }
])