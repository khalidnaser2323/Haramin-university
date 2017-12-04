/**
 * Created by Khalid on 10/21/2017.
 */
app.controller('homeScreenController', function ($log, $scope, $rootScope, $location, connector) {

    console.log("Welcome to home screen");

    //connector.send(null, 'posts', 'GET').then(function (resolved) {
    //    console.log("Resolved to controller");
    //    console.log(resolved);
    //});
$scope.editEnabled = false;
$scope.enableEdit = function(){
    $scope.editEnabled = true;
};
$scope.disableEdit = function(){
    $scope.editEnabled = false;
};
});