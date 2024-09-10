//app.controllers

app.controller("ctrlmain", function ($scope) {
  $scope.ctrl = "main";
});
app.controller(
  "ctrlhome",
  function (
    $scope,
    $rootScope,
    $resource,
    $http,
    $httpParamSerializerJQLike,
    $cookies,
    $location,
    restFactory,
    listFactory,
    popupFactory
  ) {
    /* user manage */

    // function isLogged(){
    // console.log('function isLogged');
    if (typeof $cookies.get("user") == "undefined") {
      $rootScope.isLogged = false;
      $rootScope.user = 1;
    } else {
      $rootScope.isLogged = true;
      var user = $cookies.get("user");
      $rootScope.name = user.name;
      $rootScope.user = user.id;
    }
    // };

    // isLogged();

    //to do a service to retrieve the user id
    $scope.$parent.ctrl = "home";
    /* params to display such or such list */
    $scope.type = "verb";
    $scope.version = "1";

    /* inner var of display item in list */
    $scope.items = [];
    $scope.response = "";
    $scope.question = "";
    $scope.solution = "";

    /* show hide var */
    $scope.showHiddenItems = false;
    $scope.isEmpty = true;
    $scope.isGo = false;
    $scope.isGoVisible = true;
    $scope.isVerbnl = false;

    /* popupFactory instance */
    $scope.popup = popupFactory;
    $scope.popup.hidePopupForm();

    /*logout*/

    $scope.logout = function () {
      var d = { logout: "1" };

      //url:http://localhost/translate/login/

      $http({
        method: "POST",
        url: "https://serotonine.alwaysdata.net/translator/login/",
        data: $httpParamSerializerJQLike(d),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .success(function (response) {
          console.log(response);
          document.location.reload(true);
          // isLogged();
        })
        .error(function (data, status) {});
    }; //end logout

    /* on submit button go */
    $scope.displayList = function () {
      var options = {
        _date: $scope.date,
        _showhide: $scope.showHiddenItems,
      };

      //console.log()

      list = restFactory
        .getList(1, $scope.type, JSON.stringify(options))
        .$promise.then(function (list) {
          //split hide items
          for (var i = 0, lg = list.length; i < lg; i++) {
            if (list[i].showhide === "0") {
              list.splice(i, 1), lg--;
            }
          }
          //size of the input
          $scope.type == "zin"
            ? ($scope.inputsize = 50)
            : ($scope.inputsize = 20);

          $scope.isGo = true;

          /* LIST */

          /* version 1 is fr => nl version 2 is nl => fr */
          $scope.version == "1" && $scope.type == "verb"
            ? ($scope.isVerbnl = true)
            : ($scope.isVerbnl = false);

          /* Array of words which will be displayed in template */
          $scope.items = [];

          if ($scope.nbItems > list.length) {
            $scope.nbItems = list.length;
          }

          for (var i = 0; i < $scope.nbItems; i++) {
            lg = list.length;

            //get a random number from the list length
            var index = utils.getRandomIndex(lg);

            // POPULATE $scope.items
            $scope.items[i] = {};
            $scope.items[i].index = i;
            $scope.items[i].id = list[index].id;
            $scope.items[i].fr = list[index].fr;
            $scope.items[i].nl = list[index].nl;
            $scope.items[i].showhide = list[index].showhide;

            //verb or name version
            if ($scope.version == "1") {
              $scope.items[i].question = list[index].fr;

              if ($scope.isVerbnl == true) {
                $scope.items[i].perf = list[index].perf;
                $scope.items[i].imperf = list[index].imperf;
                $scope.items[i].solution = {
                  s: list[index].nl,
                  perf: list[index].perfectum,
                  imperf: list[index].imperfectum,
                };
              } else {
                $scope.items[i].solution = { s: list[index].nl };
              }
            } else if ($scope.version == "2") {
              $scope.items[i].question = list[index].nl;
              $scope.items[i].solution = { s: list[index].fr };
            }

            list.splice(index, 1);
          }

          $scope.isEmpty = false;
        }); //end getList
    }; //end displayList

    $scope.showresponse = function (id) {
      var solution = document.getElementById(id);
      angular.element(solution).toggleClass("hidden");
    };

    $scope.repeatList = function () {
      if ($scope.isGo) {
        var solutions = document.getElementsByClassName("solution"),
          pictos = document.getElementsByClassName("pictos");

        for (var i = 0, lg = solutions.length; i < lg; i++) {
          solutions[i].value = "";
        }
        for (var i = 0, lg = pictos.length; i < lg; i++) {
          pictos[i].className = "pictos wrong";
        }

        var n = $scope.items;

        utils.mix(n);
      }
    };

    /* SHOWHIDE */

    $scope.showhideItem = function (item) {
      var hideItem = restFactory
        .showhideItem($scope.user, $scope.type, item.id, "hide")
        .$promise.then(function (hideItem) {
          // console.log(hideItem.response);

          var index = $scope.items.indexOf(item);
          $scope.items.splice(index, 1);
        });
    };

    /*DELETE */

    $scope.deleteItem = function (item) {
      var confirmed = window.confirm(
        "do you really want to remove " +
          item.question +
          " from your " +
          $scope.type +
          "s ?"
      );

      if (confirmed == true) {
        var delItem = restFactory
          .deleteItem(1, $scope.type, item.id)
          .$promise.then(function (delItem) {
            var index = $scope.items.indexOf(item);
            $scope.items.splice(index, 1);
          });
      }
    }; //end delete
  }
); //end ctrlhome
