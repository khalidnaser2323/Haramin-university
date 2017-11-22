/**
 * Created by Khalid on 11/1/2017.
 */
app.controller('targetsCtrl', function ($log, $scope, $rootScope, $location, user) {

    console.log("Welcome to targetsCtrl");
    $scope.selectedStrategicGoalIndex = 0;
    $scope.selectedSecondaryGoalIndex = 0;
    $scope.showSecondaryGoalsColumn = false;
    $scope.strategicGoalModel = '';
    $scope.secondaryGoalModel = '';
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            //debugger;
            $scope.strategicGoals = goals;
            $scope.selectedStrategicGoal = goals[$scope.selectedStrategicGoalIndex];

        });
    };
    $scope.renderGoals();
    $scope.onStrategicGoalSelected = function (selectedGoal, index) {
        $scope.selectedStrategicGoalIndex = index;
        $scope.selectedStrategicGoal = selectedGoal;
        $scope.showSecondaryGoalsColumn = true;
        $scope.strategicGoalModel = selectedGoal.name;
        $scope.secondaryGoalModel = '';
    };
    $scope.addStrategicGoal = function (valid) {
        if (valid) {
            user.addGoal($scope.strategicGoalModel).then(function (resolved) {
                debugger;
                $scope.strategicGoalModel = '';
                $scope.secondaryGoalModel = '';
                $scope.renderGoals();
            });
        }

    };
    $scope.deleteStrategicGoal = function () {
        //waiting backend implementation
        user.deleteGoal($scope.selectedStrategicGoal._id).then(function (resloved) {
            $scope.showSecondaryGoalsColumn = false;
            $scope.renderGoals();
        });
        $scope.strategicGoalModel = '';
        $scope.secondaryGoalModel = '';
    };
    $scope.addSecondaryGoal = function (valid) {
        if (valid) {
            var timestampString = new Date().getTime() + '';
            var goalObject = angular.copy($scope.selectedStrategicGoal);
            goalObject.subgoals[timestampString] = {"name": $scope.secondaryGoalModel};
            user.updateGoal(goalObject).then(function (resolved) {
                debugger;
                $scope.strategicGoalModel = '';
                $scope.secondaryGoalModel = '';
                $scope.renderGoals();
            });
        }
    };
    $scope.onSecondaryGoalSelected = function (key, index, value) {
        $scope.selectedSecondaryGoalIndex = index;
        $scope.secondaryGoalModel = value.name;
        $scope.selectedSecondaryObjectKey = key;
    };
    $scope.deleteSecondaryGoal = function () {
        if ($scope.selectedSecondaryObjectKey) {
            var goalObject = angular.copy($scope.selectedStrategicGoal);
            delete goalObject.subgoals[$scope.selectedSecondaryObjectKey];
            debugger;
            user.updateGoal(goalObject).then(function (resolved) {
                debugger;
                $scope.strategicGoalModel = '';
                $scope.secondaryGoalModel = '';
                $scope.renderGoals();
            });
        }

    };
    $scope.editSecondaryGoal = function (valid) {
        if (valid) {
            if ($scope.selectedSecondaryObjectKey) {
                var goalObject = angular.copy($scope.selectedStrategicGoal);
                goalObject.subgoals[$scope.selectedSecondaryObjectKey].name = $scope.secondaryGoalModel;
                debugger;
                user.updateGoal(goalObject).then(function (resolved) {
                    debugger;
                    $scope.strategicGoalModel = '';
                    $scope.secondaryGoalModel = '';
                    $scope.renderGoals();
                });
            }
        }
    };
    $scope.editStrategicGoal = function (valid) {
        if (valid) {
            var goalObject = angular.copy($scope.selectedStrategicGoal);
            goalObject.name = $scope.strategicGoalModel;
            debugger;
            user.updateGoal(goalObject).then(function (resolved) {
                debugger;
                $scope.strategicGoalModel = '';
                $scope.secondaryGoalModel = '';
                $scope.renderGoals();
            });
        }

    };
});