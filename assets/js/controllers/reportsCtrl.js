app.controller('reportsCtrl', function ($log, $scope, $rootScope, $location, user) {
    $log.debug("Reports view");
    $scope.entitiesModel = {};
    $scope.filterationModel = {
        "entities": {"$elemMatch": {"l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined}},
        "goals": {"$elemMatch": {"l1": undefined, "l2": undefined}}
    };

    $scope.updateFilterationModel = function () {
        $scope.filterationModel.entities.$elemMatch.l1 = angular.isDefined($scope.selectedFirstLevelObject) ? $scope.selectedFirstLevelObject._id : undefined;
        $scope.filterationModel.entities.$elemMatch.l2 = $scope.entitiesModel.secondLevel == '' ? undefined : $scope.entitiesModel.secondLevel;
        $scope.filterationModel.entities.$elemMatch.l3 = $scope.entitiesModel.thirdLevel == '' ? undefined : $scope.entitiesModel.thirdLevel;
        $scope.filterationModel.entities.$elemMatch.l4 = $scope.entitiesModel.fourthLevel == '' ? undefined : $scope.entitiesModel.fourthLevel;
        $scope.filterationModel.goals.$elemMatch.l1 = angular.isDefined($scope.selectedStrategicGoal) ? $scope.selectedStrategicGoal._id : undefined;
        $scope.filterationModel.goals.$elemMatch.l2 = $scope.goalsModel.secondaryGoal == '' ? undefined : $scope.goalsModel.secondaryGoal;

        $log.debug("new filter object");
        $log.debug($scope.filterationModel);
    };
    $scope.renderEntities = function () {
        user.getEntities().then(function (entities) {
            $scope.associations = entities;
        });
    };
    $scope.renderEntities();
    $scope.onAssociationSelected = function (entityLevel) {

        switch (entityLevel) {
            case 'level1':
                $scope.selectedFirstLevelObject = $scope.associations[parseInt($scope.entitiesModel.firstLevel)];
                $scope.entitiesModel.secondLevel = '';
                $scope.entitiesModel.thirdLevel = '';
                $scope.entitiesModel.fourthLevel = '';
                if($scope.entitiesModel.firstLevel ===""){
                    $scope.disableSecondLevel = true;
                    $scope.disablethirdLevel = true;
                    $scope.disableFourthLevel = true;
                }
                else{
                    $scope.disableSecondLevel = false;
                }

                break;
            case 'level2':
                $scope.selectedSecondLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel];
                $scope.entitiesModel.thirdLevel = '';
                $scope.entitiesModel.fourthLevel = '';
                if($scope.entitiesModel.secondLevel ===""){
                    $scope.disablethirdLevel = true;
                    $scope.disableFourthLevel = true;
                }
                else{
                    $scope.disablethirdLevel = false;
                }
                break;
            case 'level3':
                $scope.selectedThirdLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel].children[$scope.entitiesModel.thirdLevel];
                $scope.entitiesModel.fourthLevel = '';
                if($scope.entitiesModel.thirdLevel ===""){
                    $scope.disableFourthLevel = true;
                }
                else{
                    $scope.disableFourthLevel = false;
                }
                break;
            case 'level4':
                $scope.fourthLevelKey = $scope.entitiesModel.fourthLevel;
                break;
        }
        // $scope.updateFilterationModel();
        // $scope.renderPrograms($scope.filterationModel);

    };

});