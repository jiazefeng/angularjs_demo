angular.module('maxrocky.framework.directives.finishRender',[
])

.directive('onFinishRenderFilters', ['$timeout',function ($timeout) {
	return {
		restrict: 'A',
		link: function(scope,element,attr) {
			if (scope.$last === true) {
				$timeout(function() {
				//根据controller的关系是选择$emit或者$broadcast
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	};
}])