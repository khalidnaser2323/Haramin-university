/**
 * Created by Khalid on 11/2/2017.
 */
app.controller('createProjectCtrl', function ($log, $scope, $rootScope, $location, user, $timeout) {

    console.log("Welcome to project screen");
    $scope.goalsModel = {};
    $scope.entitiesModel = {};
    $scope.projectObject = {};
    $scope.projectObject.stages = [];
    $scope.userFilterEntitiesModel = {};
    $scope.filterationModel = {
        "entities": { "$elemMatch": { "l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined } },
        "goals": { "$elemMatch": { "l1": undefined, "l2": undefined } }
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
        });
    };
    $scope.renderEntities();
    $scope.onAssociationSelected = function (entityLevel) {
        switch (entityLevel) {
            case 'level1':
                debugger;
                $scope.selectedFirstLevelObject = $scope.associations[parseInt($scope.entitiesModel.firstLevel)];
                $scope.entitiesModel.secondLevel = '';
                $scope.entitiesModel.thirdLevel = '';
                $scope.entitiesModel.fourthLevel = '';
                if ($scope.entitiesModel.firstLevel === "") {
                    $scope.disableSecondLevel = true;
                    $scope.disablethirdLevel = true;
                    $scope.disableFourthLevel = true;
                }
                else {
                    $scope.disableSecondLevel = false;
                }

                break;
            case 'level2':
                $scope.selectedSecondLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel];
                $scope.entitiesModel.thirdLevel = '';
                $scope.entitiesModel.fourthLevel = '';
                if ($scope.entitiesModel.secondLevel === "") {
                    $scope.disablethirdLevel = true;
                    $scope.disableFourthLevel = true;
                }
                else {
                    $scope.disablethirdLevel = false;
                }
                break;
            case 'level3':
                $scope.selectedThirdLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel].children[$scope.entitiesModel.thirdLevel];
                $scope.entitiesModel.fourthLevel = '';
                if ($scope.entitiesModel.thirdLevel === "") {
                    $scope.disableFourthLevel = true;
                }
                else {
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
        $scope.selectedStrategicGoal = $scope.strategicGoals[$scope.goalsModel.strategicGoal];
        $scope.goalsModel.secondaryGoal = '';
        if ($scope.goalsModel.strategicGoal === "") {
            $scope.disableSecondaryGoal = true;
        }
        else {
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

    $scope.renderProjects = function (filtrationProgram) {

        user.getProjects(filtrationProgram).then(function (projects) {
            $timeout(function () {
                $scope.projects = projects;
                $scope.$apply();
            });

        });
    };
    $scope.renderProjects();
    $scope.filterProjects = function () {
        if ($scope.programId != undefined) {
            if ($scope.programId === "") {
                $scope.renderProjects();
            }
            else {
                var object = { "program": $scope.programId }
                $scope.renderProjects(object);
            }
        }

    };
    $scope.setProjectObject = function (object) {
        $scope.projectObject._id = object._id;
        $scope.projectObject.name = object.name;
        $scope.projectObject.program = object.program;
        $scope.projectObject.manager = object.manager;
        $scope.projectObject.active = object.active ? "true" : "false";
        $scope.projectObject.approxCost = object.approxCost;
        $scope.projectObject.datePlannedStart = new Date(object.datePlannedStart);
        $scope.projectObject.datePlannedEnd = new Date(object.datePlannedEnd);
        $scope.projectObject.dateActualStart = new Date(object.dateActualStart);
        $scope.projectObject.dateActualEnd = new Date(object.dateActualEnd);
        internalTeamSelect.val(object.teamInt).trigger('change');
        externalTeamSelect.val(object.teamExt).trigger('change');
        $scope.projectObject.description = object.description;
        $scope.projectObject.outputs = object.outputs[0];
        $scope.projectObject.stages = object.stages;

    };
    $scope.onProjectClicked = function (project) {
        $scope.selectedProject = project;
        $log.debug("Clicked project");
        $log.debug(project);
        $scope.setProjectObject($scope.selectedProject);

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
                if ($scope.userFilterEntitiesModel.firstLevel === "") {
                    $scope.disableSecondLevelEntity = true;
                    $scope.disableThirdLevelEntity = true;
                    $scope.disableFourthLevelEntity = true;
                }
                else {
                    $scope.disableSecondLevelEntity = false;
                }
                break;
            case 'level2':
                $scope.selectedSecondLevelEntity = $scope.selectedFirstLevelEntity.children[$scope.userFilterEntitiesModel.secondLevel];
                $scope.userFilterEntitiesModel.thirdLevel = '';
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if ($scope.userFilterEntitiesModel.secondLevel === "") {
                    $scope.disableThirdLevelEntity = true;
                    $scope.disableFourthLevelEntity = true;
                }
                else {
                    $scope.disableThirdLevelEntity = false;
                }
                break;
            case 'level3':
                $scope.selectedThirdLevelEntity = $scope.selectedFirstLevelEntity.children[$scope.userFilterEntitiesModel.secondLevel].children[$scope.userFilterEntitiesModel.thirdLevel];
                $scope.userFilterEntitiesModel.fourthLevel = '';
                if ($scope.userFilterEntitiesModel.thirdLevel === "") {
                    $scope.disableFourthLevelEntity = true;
                }
                else {
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


    $scope.deleteProject = function () {
        user.deleteProject($scope.selectedProject._id).then(function (resolved) {
            $scope.projectObject = {};
            delete $scope.selectedProject;
            internalTeamSelect.val([]).trigger('change');
            externalTeamSelect.val([]).trigger('change');
            $scope.filterProjects();
        });
    };
    $scope.addNewProject = function (newProjectObject, valid, form) {
        $scope.projectObject = {};
        $scope.projectObject.stages = [];
        $scope.projectObject.outputs = [];
        delete $scope.selectedProject;
        delete $scope.selectedProjectStage;
        internalTeamSelect.val([]).trigger('change');
        externalTeamSelect.val([]).trigger('change');
        $scope.indicatorName = "";
        $scope.goalValue = "";
        $scope.actualValue = "";
        $scope.stageName = "";
        $scope.outputName = "";
        // if (valid) {
        //     var submittedForm = angular.copy(newProjectObject);
        //     submittedForm._id = new Date().getTime() + '';
        //     submittedForm.manager = newProjectObject.manager ? newProjectObject.manager : "";
        //     submittedForm.approxCost = newProjectObject.approxCost ? newProjectObject.approxCost : 0;
        //     submittedForm.teamInt = newProjectObject.teamInt ? newProjectObject.teamInt : [];
        //     submittedForm.teamExt = newProjectObject.teamExt ? newProjectObject.teamExt : [];
        //     submittedForm.description = newProjectObject.description ? newProjectObject.description : "";
        //     submittedForm.stages = newProjectObject.stages ? newProjectObject.stages : [];
        //     submittedForm.datePlannedStart = $rootScope.formatDate(newProjectObject.datePlannedStart);
        //     submittedForm.datePlannedEnd = $rootScope.formatDate(newProjectObject.datePlannedEnd);
        //     submittedForm.dateActualStart = $rootScope.formatDate(newProjectObject.dateActualStart);
        //     submittedForm.dateActualEnd = $rootScope.formatDate(newProjectObject.dateActualEnd);
        //     submittedForm.active = newProjectObject.active === "true";
        //     submittedForm.outputs = [];
        //     submittedForm.outputs[0] = newProjectObject.outputs ? newProjectObject.outputs : "";
        //     $log.debug("Submit program form");
        //     $log.debug(submittedForm);
        //     user.addProject(submittedForm).then(function (resolved) {
        //         $scope.renderProjects();
        //     });
        // }
        // else {
        //     window.alert("من فضلك تأكد من إكمال البيانات المطلوبة");
        // }
    };

    $scope.editProject = function (projectObject, valid) {
        if (valid) {
            if ($scope.selectedProject == undefined) {
                var submittedForm = angular.copy(projectObject);
                submittedForm._id = new Date().getTime() + '';
                submittedForm.manager = projectObject.manager ? projectObject.manager : "";
                submittedForm.approxCost = projectObject.approxCost ? projectObject.approxCost : 0;
                submittedForm.teamInt = projectObject.teamInt ? projectObject.teamInt : [];
                submittedForm.teamExt = projectObject.teamExt ? projectObject.teamExt : [];
                submittedForm.description = projectObject.description ? projectObject.description : "";
                submittedForm.stages = projectObject.stages ? projectObject.stages : [];
                submittedForm.datePlannedStart = $rootScope.formatDate(projectObject.datePlannedStart);
                submittedForm.datePlannedEnd = $rootScope.formatDate(projectObject.datePlannedEnd);
                submittedForm.dateActualStart = $rootScope.formatDate(projectObject.dateActualStart);
                submittedForm.dateActualEnd = $rootScope.formatDate(projectObject.dateActualEnd);
                submittedForm.active = projectObject.active === "true";
                submittedForm.outputs = [];
                submittedForm.outputs[0] = projectObject.outputs ? projectObject.outputs : "";
                $log.debug("Submit program form");
                $log.debug(submittedForm);
                user.addProject(submittedForm).then(function (resolved) {
                    $scope.filterProjects();
                });
            }
            else {
                var submittedForm = angular.copy(projectObject);
                submittedForm.manager = projectObject.manager ? projectObject.manager : "";
                submittedForm.approxCost = projectObject.approxCost ? projectObject.approxCost : 0;
                submittedForm.teamInt = projectObject.teamInt ? projectObject.teamInt : [];
                submittedForm.teamExt = projectObject.teamExt ? projectObject.teamExt : [];
                submittedForm.description = projectObject.description ? projectObject.description : "";
                submittedForm.stages = projectObject.stages ? projectObject.stages : [];
                submittedForm.datePlannedStart = $rootScope.formatDate(projectObject.datePlannedStart);
                submittedForm.datePlannedEnd = $rootScope.formatDate(projectObject.datePlannedEnd);
                submittedForm.dateActualStart = $rootScope.formatDate(projectObject.dateActualStart);
                submittedForm.dateActualEnd = $rootScope.formatDate(projectObject.dateActualEnd);
                submittedForm.active = projectObject.active === "true";
                submittedForm.outputs = [];
                submittedForm.outputs[0] = projectObject.outputs ? projectObject.outputs : "";
                $log.debug("Submit program form");
                $log.debug(submittedForm);

                user.editProject(submittedForm).then(function (resolved) {
                    $scope.filterProjects();
                });
            }
        }
        else {
            window.alert("من فضلك تأكد من إكمال البيانات المطلوبة");
        }

    };


    var internalTeamSelect = $("#sel1");
    internalTeamSelect.select2();
    internalTeamSelect.change(function () {
        $scope.projectObject.teamInt = internalTeamSelect.val();
    });
    var externalTeamSelect = $("#sel2");
    externalTeamSelect.select2();
    externalTeamSelect.change(function () {
        $scope.projectObject.teamExt = externalTeamSelect.val();
    });


    $scope.setStageModel = function () {
        $scope.stageModel = {
            "name": '',
            "outputs": [],
            "indices": []
        };
    };
    $scope.onProgramStageSelected = function (stage, index) {
        $scope.selectedProjectStage = stage;
        $scope.selectedProjectStageIndex = index;
        $scope.stageName = stage.name;
    };
    $scope.addProjectStage = function () {
        delete $scope.selectedProjectStage;
        delete $scope.selectedProjectStageIndex;
        $scope.stageName = "";
    };
    $scope.editProjectStage = function () {
        if ($scope.selectedProjectStage == undefined) {
            $scope.setStageModel();
            var newStage = $scope.stageModel;
            newStage.name = $scope.stageName;
            $scope.projectObject.stages.push(newStage);
            $scope.onProgramStageSelected($scope.projectObject.stages[$scope.projectObject.stages.length - 1], $scope.projectObject.stages.length - 1);
        }
        else {
            $scope.projectObject.stages[$scope.selectedProjectStageIndex].name = $scope.stageName;
            $scope.stageName = "";
        }

    };
    $scope.deleteProjectStage = function () {
        if ($scope.selectedProjectStageIndex != undefined) {
            $scope.projectObject.stages.splice($scope.selectedProjectStageIndex, 1);
            $scope.stageName = "";
        }

    };
    $scope.addOutput = function () {
        $scope.outputName = "";
        delete $scope.selectedProjectStageOutput;
        delete $scope.selectedProjectStageOutputIndex;

    };
    $scope.onProgramStageOutputSelected = function (output, index) {
        $scope.selectedProjectStageOutput = output;
        $scope.selectedProjectStageOutputIndex = index;
        $scope.outputName = output.name;
    };
    $scope.deleteProjectStageOutput = function () {
        if ($scope.selectedProjectStageOutputIndex != undefined) {
            $scope.selectedProjectStage.outputs.splice($scope.selectedProjectStageOutputIndex, 1);
            $scope.outputName = "";
        }
    };
    $scope.editProjectStageOutput = function () {
        if ($scope.selectedProjectStageOutput == undefined) {
            var newOutput = {
                "name": $scope.outputName
            };
            $scope.selectedProjectStage.outputs.push(newOutput);
            $scope.outputName = "";
        }
        else {
            $scope.selectedProjectStage.outputs[$scope.selectedProjectStageOutputIndex].name = $scope.outputName;
            $scope.outputName = "";
        }
    };

    $scope.onIndicatorSelected = function (indicator, index) {
        $scope.selectedIndicator = indicator;
        $scope.selectedIndicatorIndex = index;
        $scope.indicatorName = indicator.name;
        $scope.goalValue = indicator.goal;
        $scope.actualValue = indicator.actual;
    };
    $scope.addIndicator = function () {
        $scope.indicatorName = "";
        $scope.goalValue = "";
        $scope.actualValue = "";
        delete $scope.selectedIndicator;
        delete $scope.selectedIndicatorIndex;
    };
    $scope.editIndicator = function () {
        if ($scope.selectedIndicator == undefined) {
            var newIndicator = {
                "name": $scope.indicatorName,
                "goal": $scope.goalValue,
                "actual": $scope.actualValue
            };
            $scope.selectedProjectStage.indices.push(newIndicator);
            $scope.indicatorName = "";
            $scope.goalValue = "";
            $scope.actualValue = "";

        }
        else {
            $scope.selectedProjectStage.indices[$scope.selectedIndicatorIndex].name = $scope.indicatorName;
            $scope.selectedProjectStage.indices[$scope.selectedIndicatorIndex].goal = $scope.goalValue;
            $scope.selectedProjectStage.indices[$scope.selectedIndicatorIndex].actual = $scope.actualValue;
            $scope.indicatorName = "";
            $scope.goalValue = "";
            $scope.actualValue = "";
        }
    };
    $scope.deleteIndicator = function () {
        if ($scope.selectedIndicatorIndex != undefined) {
            $scope.selectedProjectStage.indices.splice($scope.selectedIndicatorIndex, 1);
            $scope.indicatorName = "";
            $scope.goalValue = "";
            $scope.actualValue = "";
        }
    };

});