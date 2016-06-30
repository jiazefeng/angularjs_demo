angular.module('robot.common.httpMockBaseUrlSupport', [
    'ngMockE2E',
    'robot.app.config'
])

.config(['$provide', 'ApiBaseUrl', function($provide,ApiBaseUrl){
	function combineUrl(baseUrl,url){
		while(baseUrl.lastIndexOf('/')===baseUrl.length-1) baseUrl=baseUrl.substring(0,baseUrl.length-1);
		return baseUrl+url;
	}

	$provide.decorator('$httpBackend', ['$delegate',function($delegate) {
        var $httpBackend = $delegate;
 		var when=$httpBackend.when;
	    $httpBackend.when=function(){
	    	var url=arguments[1];
      		if(typeof url ==='string' && url.indexOf('http://')!==0 && url.indexOf('https://')!==0 && (url.indexOf('.tpl.html')===-1||url.indexOf('.tpl.html')!==url.length-9)){
      			url=combineUrl(ApiBaseUrl,url);
      			arguments[1]=url;
	      		return when.apply($httpBackend, arguments);
      		}
      		else if(url instanceof RegExp && url.source.indexOf('http:\\/\\/')!==0){
      			url=new RegExp(combineUrl(ApiBaseUrl,url.source));
      			arguments[1]=url;
	      		return when.apply($httpBackend, arguments);
      		}
      		else{
      			return when.apply($httpBackend, arguments);
      		}
	    }
	 
	    return $httpBackend;
    }]);
}])