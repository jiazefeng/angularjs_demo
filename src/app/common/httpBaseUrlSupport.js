angular.module('robot.common.httpBaseUrlSupport', [
    'robot.app.config'
])

.config(['$provide', 'ApiBaseUrl', function($provide,ApiBaseUrl){
	function combineUrl(baseUrl,url){
		while(url.indexOf('/')===0) url=url.substring(1);
		return baseUrl+url;
	}

	$provide.decorator('$http',['$delegate', function($delegate) {
        var $http = $delegate;
 
	    var wrapper = function () {
	      	return $http.apply($http, arguments);
	    };
	 
	    Object.keys($http).filter(function (key) {
	      	return (typeof $http[key] === 'function');
	    }).forEach(function (key) {
	      	wrapper[key] = function () {
	      		var url=arguments[0];
	      		if(url.match('.tpl.html')||url.indexOf('http://')===0||url.indexOf('https://')===0){
	        		return $http[key].apply($http, arguments);
	      		}
	      		else{
	      			url=combineUrl(ApiBaseUrl,url);
	      			arguments[0]=url;
	        		return $http[key].apply($http, arguments);
	      		}
	      	};
	    });
	 
	    return wrapper;
    }]);
}])