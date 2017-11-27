/**
 * Created by Khalid on 11/2/2017.
 */

app.controller('createProgramCtrl', function ($log, $scope, $rootScope, $location, user, $timeout) {

    console.log("Welcome to ProgramCtrl");
    $scope.goalsModel = {};
    $scope.entitiesModel = {};
    $scope.programForm = {};
    $scope.userFilterEntitiesModel = {};
    $scope.filterationModel = {
        "entities": {"$elemMatch": {"l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined}},
        "goals": {"$elemMatch": {"l1": undefined, "l2": undefined}}
    };
    $scope.userFilterationModel = {
        "entityl1": undefined,
        "entityl2": undefined,
        "entityl3": undefined,
        "entityl4": undefined
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
            $scope.selectableEntities = entities;
            //$scope.selectableEntitiesSecondLevel = entities

            $scope.ets = [];

            for (var el1i in entities) {
                var el1 = entities[el1i];
                for (var el2i in el1.children) {
                    var el2 = el1.children[el2i];
                    for (var el3i in el2.children) {
                        var el3 = el2.children[el3i];
                        if (Object.keys(el3.children).length === 0) {
                            continue;
                        }
                        var el4 = {};
                        $scope.ets.push({el1: el1, el2: el2, el3: el3, eli2: el2i, eli3: el3i, el4: el4});
                        for (var el4i in el3.children) {
                            el4[el4i] = el3.children[el4i];
                        }
                    }
                }
            }
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
        $scope.updateFilterationModel();
        $scope.renderPrograms($scope.filterationModel);

    };
    $scope.renderGoals = function () {
        user.getGoals().then(function (goals) {
            //debugger;
            $scope.strategicGoals = goals;


        });
    };
    $scope.renderGoals();
    $scope.onStrategicGoalSelected = function () {
        debugger;
        $scope.selectedStrategicGoal = $scope.strategicGoals[$scope.goalsModel.strategicGoal];
        $scope.goalsModel.secondaryGoal = '';
        if($scope.goalsModel.strategicGoal === ""){
            $scope.disableSecondaryGoal = true;
        }
        else{
            $scope.disableSecondaryGoal = false;
        }
        $scope.updateFilterationModel();
        $scope.renderPrograms($scope.filterationModel);
    };
    $scope.onSecondaryGoalSelected = function () {
        $scope.selectedSecondaryObjectKey = $scope.selectedStrategicGoal[$scope.goalsModel.secondaryGoal];
        $scope.updateFilterationModel();
        $scope.renderPrograms($scope.filterationModel);
    };
    $scope.renderPrograms = function (filter) {
        user.getPrograms(filter).then(function (resolved) {
            $timeout(function () {
                //debugger;
                $scope.programs = resolved;
                $scope.$apply();
            });


        });
    };
    $scope.renderPrograms();
    $scope.onProgramClicked = function (program) {
        $log.debug("Clicked program");
        $log.debug(program);
        $scope.selectedProgram = program;
        $scope.setProgramForm($scope.selectedProgram);

    };
    $scope.setProgramForm = function (selectedProgram) {
        $scope.programForm._id = selectedProgram._id;
        $scope.programForm.name = selectedProgram.name;
        $scope.programForm.manager = selectedProgram.manager;
        $scope.programForm.active = selectedProgram.active ? "true" : "false";
        $scope.programForm.approxCost = selectedProgram.approxCost;
        $scope.programForm.datePlannedStart = new Date(selectedProgram.datePlannedStart);
        $scope.programForm.datePlannedEnd = new Date(selectedProgram.datePlannedEnd);
        $scope.programForm.dateActualStart = new Date(selectedProgram.dateActualStart);
        $scope.programForm.dateActualEnd = new Date(selectedProgram.dateActualEnd);
        internalTeamSelect.val(selectedProgram.teamInt).trigger('change');
        externalTeamSelect.val(selectedProgram.teamExt).trigger('change');
        $scope.programForm.description = selectedProgram.description;
        $scope.programForm.strategies = selectedProgram.strategies;
        $scope.programForm.stages = selectedProgram.stages;
        //$scope.programForm.entities = selectedProgram.entities;
        $scope.programForm.entities = [];
        $scope.programForm.goals = [];
        for (var x in selectedProgram.entities) {
            $scope.programForm.entities[x] = selectedProgram.entities[x].l1 + "." + selectedProgram.entities[x].l2 + "." + selectedProgram.entities[x].l3 + "." + selectedProgram.entities[x].l4;
        }
        for (var y in selectedProgram.goals) {
            $scope.programForm.goals[y] = selectedProgram.goals[y].l1 + "." + selectedProgram.goals[y].l2;
        }


    };
    $scope.renderUsers = function (filter) {
        user.getUsers(filter).then(function (resolved) {
            $timeout(function () {
                //debugger;
                $scope.users = resolved;
                $scope.$apply();
            });


        });
    };
    $scope.renderUsers();
    $scope.updateUserFiltrationModel = function () {
        $scope.userFilterationModel.entityl1 = angular.isDefined($scope.selectedFirstLevelEntity) ? $scope.selectedFirstLevelEntity._id : undefined;
        $scope.userFilterationModel.entityl2 = $scope.userFilterEntitiesModel.secondLevel == '' ? undefined : $scope.userFilterEntitiesModel.secondLevel;
        $scope.userFilterationModel.entityl3 = $scope.userFilterEntitiesModel.thirdLevel == '' ? undefined : $scope.userFilterEntitiesModel.thirdLevel;
        $scope.userFilterationModel.entityl4 = $scope.userFilterEntitiesModel.fourthLevel == '' ? undefined : $scope.userFilterEntitiesModel.fourthLevel;
    };
    $scope.filterUsers = function (level) {
        switch (level) {
            case 'level1':
                $scope.selectedFirstLevelEntity = $scope.associations[parseInt($scope.userFilterEntitiesModel.firstLevel)];
                $scope.userFilterEntitiesModel.secondLevel = '';
                $scope.userFilterEntitiesModel.thirdLevel = '';
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if($scope.userFilterEntitiesModel.firstLevel === ""){
                    $scope.disableSecondLevelEntity = true;
                    $scope.disableThirdLevelEntity = true;
                    $scope.disableFourthLevelEntity = true;
                }
                else{
                    $scope.disableSecondLevelEntity = false;
                }
                break;
            case 'level2':
                $scope.selectedSecondLevelEntity = $scope.selectedFirstLevelEntity.children[$scope.userFilterEntitiesModel.secondLevel];
                $scope.userFilterEntitiesModel.thirdLevel = '';
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if($scope.userFilterEntitiesModel.secondLevel === ""){
                    $scope.disableThirdLevelEntity = true;
                    $scope.disableFourthLevelEntity = true;
                }
                else{
                    $scope.disableThirdLevelEntity = false;
                }
                break;
            case 'level3':
                $scope.selectedThirdLevelEntity = $scope.selectedFirstLevelEntity.children[$scope.userFilterEntitiesModel.secondLevel].children[$scope.userFilterEntitiesModel.thirdLevel];
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if($scope.userFilterEntitiesModel.thirdLevel === ""){
                    $scope.disableFourthLevelEntity = true;
                }
                else{
                    $scope.disableFourthLevelEntity = false;
                }
                break;
            case 'level4':
                //$scope.fourthLevelKey = $scope.userFilterEntitiesModel.fourthLevel;
                break;
        }
        $scope.updateUserFiltrationModel();
        $scope.renderUsers($scope.userFilterationModel);

    };


    $scope.deleteProgram = function () {
        user.deleteProgram($scope.selectedProgram._id).then(function (resolved) {
            $scope.programForm = {};
            $scope.renderPrograms();
        });
    };
    $scope.createNewProgram = function (newProgramForm, valid, form) {
        //$scope.newProgramForm.$setSubmitted();
        if (valid) {
            var submittedForm = angular.copy(newProgramForm);
            submittedForm._id = new Date().getTime() + '';
            submittedForm.manager = newProgramForm.manager ? newProgramForm.manager : "";
            submittedForm.approxCost = newProgramForm.approxCost? newProgramForm.approxCost : 0;
            submittedForm.datePlannedStart = $rootScope.formatDate(newProgramForm.datePlannedStart);
            submittedForm.datePlannedEnd = $rootScope.formatDate(newProgramForm.datePlannedEnd);
            submittedForm.dateActualStart = $rootScope.formatDate(newProgramForm.dateActualStart);
            submittedForm.dateActualEnd = $rootScope.formatDate(newProgramForm.dateActualEnd);
            submittedForm.active = newProgramForm.active === "true";
            submittedForm.entities = [];
            for (var index in newProgramForm.entities) {
                var arr = newProgramForm.entities[index].split('.');
                var entityObject = {"l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined};
                submittedForm.entities.push(entityObject);
                submittedForm.entities[index].l1 = arr[0];
                submittedForm.entities[index].l2 = arr[1];
                submittedForm.entities[index].l3 = arr[2];
                submittedForm.entities[index].l4 = arr[3];
            }
            submittedForm.goals = [];
            for (var index2 in newProgramForm.goals) {
                var arr2 = newProgramForm.goals[index2].split('.');
                var goalObject = {"l1": undefined, "l2": undefined};
                submittedForm.goals.push(goalObject);
                submittedForm.goals[index2].l1 = arr2[0];
                submittedForm.goals[index2].l2 = arr2[1];
            }
            submittedForm.description = newProgramForm.description ? newProgramForm.description : "";
            submittedForm.strategies = newProgramForm.strategies ? newProgramForm.strategies : "";
            submittedForm.stages = newProgramForm.stages ? newProgramForm.stages : "";
            submittedForm.teamInt = newProgramForm.teamInt ? newProgramForm.teamInt : [];
            submittedForm.teamExt = newProgramForm.teamExt ? newProgramForm.teamExt : [];
            $log.debug("Submit program form");
            $log.debug(submittedForm);
            user.addProgram(submittedForm).then(function (resolved) {
                $scope.renderPrograms();
            });
        }
        else {
            window.alert("من فضلك تأكد من إكمال البيانات المطلوبة");
        }
    };

    $scope.editProgram = function (programForm, valid) {
        if (valid) {
            var submittedForm = angular.copy(programForm);
            submittedForm.manager = newProgramForm.manager ? newProgramForm.manager : "";
            submittedForm.approxCost = newProgramForm.approxCost? newProgramForm.approxCost : 0;
            submittedForm.datePlannedStart = $rootScope.formatDate(programForm.datePlannedStart);
            submittedForm.datePlannedEnd = $rootScope.formatDate(programForm.datePlannedEnd);
            submittedForm.dateActualStart = $rootScope.formatDate(programForm.dateActualStart);
            submittedForm.dateActualEnd = $rootScope.formatDate(programForm.dateActualEnd);
            submittedForm.active = programForm.active === "true";
            submittedForm.entities = [];
            for (var index in programForm.entities) {
                var arr = programForm.entities[index].split('.');
                var entityObject = {"l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined};
                submittedForm.entities.push(entityObject);
                submittedForm.entities[index].l1 = arr[0];
                submittedForm.entities[index].l2 = arr[1];
                submittedForm.entities[index].l3 = arr[2];
                submittedForm.entities[index].l4 = arr[3];
            }
            submittedForm.goals = [];
            for (var index2 in programForm.goals) {
                var arr2 = programForm.goals[index2].split('.');
                var goalObject = {"l1": undefined, "l2": undefined};
                submittedForm.goals.push(goalObject);
                submittedForm.goals[index2].l1 = arr2[0];
                submittedForm.goals[index2].l2 = arr2[1];
            }
            submittedForm.description = programForm.description ? programForm.description : "";
            submittedForm.strategies = programForm.strategies ? programForm.strategies : "";
            submittedForm.stages = programForm.stages ? programForm.stages : "";
            submittedForm.teamInt = newProgramForm.teamInt ? newProgramForm.teamInt : [];
            submittedForm.teamExt = newProgramForm.teamExt ? newProgramForm.teamExt : [];

            $log.debug("Submit program form");
            $log.debug(submittedForm);
            user.editProgram(submittedForm).then(function (resolved) {
                $scope.renderPrograms();
            });
        }
        else {
            window.alert("من فضلك تأكد من إكمال البيانات المطلوبة");
        }
    };


    var internalTeamSelect = $("#sel1");
    internalTeamSelect.select2();
    internalTeamSelect.change(function () {
        $scope.programForm.teamInt = internalTeamSelect.val();
    });
    var externalTeamSelect = $("#sel2");
    externalTeamSelect.select2();
    externalTeamSelect.change(function () {
        $scope.programForm.teamExt = externalTeamSelect.val();
    });

});