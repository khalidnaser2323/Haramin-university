/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('createTaskCtrl', function ($log, $scope, $rootScope, $location) {

    console.log("Welcome to task screen");
    $scope.tasks = [
        {
            "title": "مهمة 1",
            "description": "أعضاء الفريق في كلا من شركة نهج وكلية المسجد النبوي الشريف"
        },
        {
            "title": "مهمة2",
            "description": "اجتماع آخر"
        },
        {
            "title": "مهمة 3",
            "description": "اجتماع آخر"
        }
    ];
    $scope.persons = [
        {
            title: "فرد1"
        }, {
            title: "فرد2"
        }, {
            title: "فرد3"
        }
    ];
    $scope.deleteTask = function () {

        $scope.tasks.splice($scope.selectedPersonalTaskIndex, 1);
    };
    $scope.addTask = function () {


    };
});