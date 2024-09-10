/*//////////////////////////////////////// M A N A G E ////////////////////////////////////////*/

	/* Manage controller CRUD words */

	app.controller('ctrlmanage', function($scope,$rootScope, $resource, $q, $timeout, restFactory, popupFactory, listFactory){

					//todo global scope
					$scope.user=1;
					$scope.type="verb";
					$scope.$parent.ctrl ="manage";

					//popupFactory instance ,
					$scope.popup = popupFactory;
					$scope.rest = restFactory;
					$scope.popup.hidePopupForm();

			/*	$scope.showUpdateForm=false;
				$scope.showCreateForm=false;
				$scope.hideUpdateForm=function(){ $scope.showUpdateForm=false;};
				$scope.hideCreateForm=function(){ $scope.showCreateForm=false;}; */


				$scope.getMaxId= function(lg, list){
					var tab = [];
					for(var i =0; i<lg; i++){  if ( list[i].id != null ) tab.push(list[i].id); }
					return Math.max.apply( Math, tab );
				}


			var getList = function () {

			var list = restFactory.getList($scope.user,$scope.type).$promise.then(function(list){
				//size of the input
			$scope.type =="zin"? $scope.inputsize =50:$scope.inputsize = 20;

				$scope.items= list;
				$scope.lg = list.length;

			});


			}//end getList

			getList();

			$scope.changeType= function(t) { $scope.type=t; }

			$scope.$watch(function () { return $scope.type }, function (n) {

					getList();
					//console.log($scope.items);



});

			//watch create response changes in order to insert new item in the list (without reload)
			//see popup factory > create
		$scope.$watch(function () { return restFactory.response }, function (n,o) {

		if (typeof n==="string" && n!=="Item already saved") {
			$scope.items.unshift($scope.popup.item);
			$scope.popup.item={};
			}

});

		$scope.showhideItem= function(item){

					//var index = $scope.items.indexOf(item);
					//convert into number
					item.showhide = item.showhide * 1;

					item.showhide = !item.showhide;

					var hideItem = restFactory.showhideItem (
									item.user,
									$scope.type,
									item.id,
									item.showhide===false?"hide":"show"
									);
				/*.$promise.then(function(hideItem){


						if(removeFromList){
							//var index = $scope.items.indexOf(item);
							//$scope.items.splice(index,1);
						}


					});*/

				}



	/* DELETE */

	$scope.deleteItem = function(item){
		//console.log(item)
		var index = $scope.items.indexOf(item);
		$scope.items.splice(index,1);
		restFactory.deleteItem($scope.user, $scope.type, item.id);

	}//end delete


	});//end ctrlmanage
