var app = angular.module('test', ['ui.bootstrap']);

app.controller('MainCtrl', function($scope, $timeout) {
    
})

.directive('popoverAutoclose', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var timeoutHandle;
      
      scope.$watch('tt_isOpen', function (isOpen) {
        $timeout.cancel(timeoutHandle);
        console.log(isOpen);
        if (isOpen) {
          timeoutHandle = $timeout(function () {
            scope.tt_isOpen = false;
          }, +attrs.popoverAutoclose || 2000);
        }
      });
    }
  }
});