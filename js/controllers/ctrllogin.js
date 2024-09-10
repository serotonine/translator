/*//////////////////////////////////////// M A N A G E ////////////////////////////////////////*/

/* Manage controller CRUD words */

app.controller("ctrllogin", function ($scope, $routeParams) {
  $scope.inscription = false;
  $scope.errors = {
    1: "your name or your email is invalid",
    2: "invalid password",
    3: "Activation is not done",
  };
  if (typeof $routeParams.error !== "undefined") {
    $scope.error = $scope.errors[$routeParams.error];
  }
}); //end ctrllogin
