angular.module('maxrocky.framework.directives.position',[
])

.directive('mrPosition',['$parse', '$filter', function($parse, $filter){

	return {
		restrict:'C',
		scope:{
			left:"="
		},
		link: function(left, element, attrs){
			var index = attrs.index;
			// element.css('left',-8*index+'px');
		} 
	};
}])