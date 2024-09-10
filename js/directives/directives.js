/* params list to display */

app.directive('ngDropType', function(){

	return {
		restrict:'E',
		templateUrl:'partials/directives/_droptype.html',
	}

});

app.directive('ngDropLg', function(){

	return {
		restrict:'E',
		templateUrl:'partials/directives/_droplg.html',
	}

});

app.directive('ngInputNbitems', function(){

	return {
		restrict:'E',
		templateUrl:'partials/directives/_inputNbitems.html',
	}

});


/* eval response input to display wrong or ok */

app.directive('ngResponse',function(){

	return {

	 restrict:'A',
	 link: function(scope, elm, attrs) {

	 	var pictos =angular.element(elm).parent().next().children(),
	 	isOk=false;

	 	scope.$watch(attrs.ngModel, function (value) {
			if( value == attrs.solution ){
				if(pictos){ isOk=!isOk ; angular.element(pictos).removeClass('wrong').addClass('ok');}
			}
			else {
				if(isOk){ angular.element(pictos).removeClass('ok').addClass('wrong');isOk=!isOk ; }
			}

		});//end scope.$watch

	 }//end link

	 }//end return

});

/*
* TODO REPLACE BY CREATEUPDATEPOPUP
* switch form according the created type - name -verb - zin
* used in manage.html
*/

app.directive('ngCreatePopup',function(){

	return {

	 restrict:'E',

 templateUrl:'partials/directives/_createpopup.html',

	link: function(scope, elm, attrs) {

		console.log(scope)

	}


	 }//end return

});

/*
* if on create or update
* switch form according the created type - name -verb - zin
* used in home.html and manage.html
*/

app.directive('ngCreateUpdatePopup',function(){

	return {

	 restrict:'E',

 templateUrl:'partials/directives/_popup-create-update.html',

	link: function(scope, elm, attrs) {
		scope.$watch("popup.addToList", function(popup){
			if(popup.fr && popup.nl){scope.items.push(popup); }
			 })



		 }


	 }//end return

});


/* CUSTOM FROM http://stackoverflow.com/questions/25219493/angular-bootstrap-popover-hide-after-few-seconds/25219771#25219771*/

app.directive('popoverAutoclose', function ($timeout) {
      return {
        restrict: 'A',
        priority: -1000,
        link: function (scope, element, attrs) {
          var timeoutHandle;

          scope.$watch('tt_isOpen', function (isOpen) {
            $timeout.cancel(timeoutHandle);
            //console.log('popoverAutoclose : ' + scope.tt_isOpen);


            if (isOpen) {
              timeoutHandle = $timeout(function () {
                scope.tt_isOpen = false;
              }, +attrs.popoverAutoclose || 2000);
            }
          });
        }
      }
}),

  /* END CUSTOM MODULE */


  app.directive("scrollToTop", function(){

  	return{

  		restrict:'E',
  		template:'<a href="#" class="scrollToTop"><i class="fa fa-arrow-circle-up fa-4x"></i></a>',
  		link:function(scope, el, attrs){

  			$(document).ready(function(){

  				$(window).scroll(function(){
					if ($(this).scrollTop() > 100) { $('.scrollToTop').fadeIn(); }
					else { $('.scrollToTop').fadeOut(); }
				});

				//Click event to scroll to top
				$('.scrollToTop').click(function(){
					$('html, body').animate({scrollTop : 0 },500);
					return false;
				});

			});//end document ready


  	}
  }

  }); //scrollToTop


 // app.directive("login", function(){
 //
 //  	return{
 //
 //  		restrict:'E',
 // 		templateUrl:"partials/directives/_login.html",
 // 		controller:function($scope){
 // 			$scope.inscription = false;
 // 			console.log("login ctrl");
 // 		}
 //
 // 
 //
 //
 //
 //  	}
 //  });//login
