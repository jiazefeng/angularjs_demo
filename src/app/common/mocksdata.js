angular.module('robot.common.mocksData', [])

.factory('mocksData', [function() {
    return {
        resetData: function(data) {
            var result = {
                code: 0
            };
            result.data = data;
            result.msg = "";
            return result;
        }
    };
}])