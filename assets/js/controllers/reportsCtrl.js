app.controller('reportsCtrl', function ($log, $timeout, $scope, $rootScope, $location, user) {
    $log.debug("Reports view");
    // $scope.entitiesModel = {};
    $scope.reportForm = {};
    // $scope.filterationModel = {
    //     "entities": { "$elemMatch": { "l1": undefined, "l2": undefined, "l3": undefined, "l4": undefined } },
    //     "goals": { "$elemMatch": { "l1": undefined, "l2": undefined } }
    // };

    // $scope.updateFilterationModel = function () {
    //     $scope.filterationModel.entities.$elemMatch.l1 = angular.isDefined($scope.selectedFirstLevelObject) ? $scope.selectedFirstLevelObject._id : undefined;
    //     $scope.filterationModel.entities.$elemMatch.l2 = $scope.entitiesModel.secondLevel == '' ? undefined : $scope.entitiesModel.secondLevel;
    //     $scope.filterationModel.entities.$elemMatch.l3 = $scope.entitiesModel.thirdLevel == '' ? undefined : $scope.entitiesModel.thirdLevel;
    //     $scope.filterationModel.entities.$elemMatch.l4 = $scope.entitiesModel.fourthLevel == '' ? undefined : $scope.entitiesModel.fourthLevel;
    //     $scope.filterationModel.goals.$elemMatch.l1 = angular.isDefined($scope.selectedStrategicGoal) ? $scope.selectedStrategicGoal._id : undefined;
    //     $scope.filterationModel.goals.$elemMatch.l2 = $scope.goalsModel.secondaryGoal == '' ? undefined : $scope.goalsModel.secondaryGoal;

    //     $log.debug("new filter object");
    //     $log.debug($scope.filterationModel);
    // };
    $scope.renderEntities = function () {
        user.getEntities().then(function (entities) {
            $scope.associations = entities;
        });
    };
    $scope.renderEntities();
    // $scope.onAssociationSelected = function (entityLevel) {

    //     switch (entityLevel) {
    //         case 'level1':
    //             $scope.selectedFirstLevelObject = $scope.associations[parseInt($scope.entitiesModel.firstLevel)];
    //             $scope.entitiesModel.secondLevel = '';
    //             $scope.entitiesModel.thirdLevel = '';
    //             $scope.entitiesModel.fourthLevel = '';
    //             if ($scope.entitiesModel.firstLevel === "") {
    //                 $scope.disableSecondLevel = true;
    //                 $scope.disablethirdLevel = true;
    //                 $scope.disableFourthLevel = true;
    //             }
    //             else {
    //                 $scope.disableSecondLevel = false;
    //             }

    //             break;
    //         case 'level2':
    //             $scope.selectedSecondLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel];
    //             $scope.entitiesModel.thirdLevel = '';
    //             $scope.entitiesModel.fourthLevel = '';
    //             if ($scope.entitiesModel.secondLevel === "") {
    //                 $scope.disablethirdLevel = true;
    //                 $scope.disableFourthLevel = true;
    //             }
    //             else {
    //                 $scope.disablethirdLevel = false;
    //             }
    //             break;
    //         case 'level3':
    //             $scope.selectedThirdLevelObject = $scope.selectedFirstLevelObject.children[$scope.entitiesModel.secondLevel].children[$scope.entitiesModel.thirdLevel];
    //             $scope.entitiesModel.fourthLevel = '';
    //             if ($scope.entitiesModel.thirdLevel === "") {
    //                 $scope.disableFourthLevel = true;
    //             }
    //             else {
    //                 $scope.disableFourthLevel = false;
    //             }
    //             break;
    //         case 'level4':
    //             $scope.fourthLevelKey = $scope.entitiesModel.fourthLevel;
    //             break;
    //     }
    //     // $scope.updateFilterationModel();
    //     // $scope.renderPrograms($scope.filterationModel);

    // };
    $scope.onEntitySelected = function (type) {
        debugger;
        switch (type) {
            case 'level1':
                debugger;
                for (var index = 0; index < $scope.associations.length; index++) {
                    if ($scope.associations[index]._id == $scope.reportForm.entityl1) {
                        $scope.selectedUniversity = $scope.associations[index];
                    }
                }
                $scope.reportForm.entityl2 = '';
                $scope.reportForm.entityl3 = '';
                $scope.reportForm.entityl4 = '';


                break;
            case 'level2':
                $scope.selectedFaculty = $scope.selectedUniversity.children[$scope.reportForm.entityl2];
                $scope.reportForm.entityl3 = '';
                $scope.reportForm.entityl4 = '';
                break;
            case 'level3':
                $scope.selectedSector = $scope.selectedUniversity.children[$scope.reportForm.entityl2].children[$scope.reportForm.entityl3];
                $scope.reportForm.entityl4 = '';
                break;
            case 'level4':
                $scope.selectedDepartmentKey = $scope.reportForm.entityl4;
                break;
        }
    };
    $scope.setUserEntities = function () {
        for (var index = 0; index < $scope.associations.length; index++) {
            if ($scope.associations[index]._id == $scope.reportForm.entityl1) {
                $scope.selectedUniversity = $scope.associations[index];
            }
        }
        $scope.selectedFaculty = $scope.selectedUniversity.children[$scope.reportForm.entityl2];

        if ($scope.selectedUniversity.children[$scope.reportForm.entityl2]) {
            $scope.selectedSector = $scope.selectedUniversity.children[$scope.reportForm.entityl2].children[$scope.reportForm.entityl3];
        }
    };
    $scope.setReportForm = function (report) {
        if (report) {
            $scope.reportForm.name = report.name;
            $scope.reportForm.vision = report.vision;
            $scope.reportForm.message = report.message;
            $scope.reportForm.principles = report.principles;

            $scope.reportForm.goals = report.goals;
            $scope.enableGoals = $scope.reportForm.goals != '';
            $scope.reportForm.programs = report.programs;
            $scope.enablePrograms = $scope.reportForm.programs != '';
            $scope.reportForm.projects = report.projects;
            $scope.enableProjects = $scope.reportForm.projects != '';
            $scope.reportForm.tasks = report.tasks;
            $scope.enableTasks = $scope.reportForm.tasks != '';
            $scope.reportForm.kpis = report.kpis;
            $scope.enableKPIs = $scope.reportForm.kpis != '';
            $scope.reportForm.entityl1 = report.entityl1;
            $scope.reportForm.entityl2 = report.entityl2;
            $scope.reportForm.entityl3 = report.entityl3;
            $scope.reportForm.entityl4 = report.entityl4;
            $scope.setUserEntities();
        }
    };
    $scope.onReportSelected = function () {
        $log.debug("Selected Report");
        $log.debug($scope.selectedReport);
        // $scope.selectedReport = $scope.selectedReport;
        $scope.setReportForm($scope.selectedReport);
    };
    $scope.renderReports = function () {
        user.getReports().then(function (resolvedReports) {

            $timeout(function () {
                //debugger;
                $scope.reports = resolvedReports;
                $scope.$apply();
            });
        });

    };
    $scope.renderReports();
    $scope.newReportForm = function () {
        $scope.reportForm = {};
        $scope.entitiesModel = {};
        delete $scope.selectedReport;
        $scope.enableGoals = false;
        $scope.enablePrograms = false;
        $scope.enableKPIs = false;
        $scope.enableTasks = false;
        $scope.enableProjects = false;
    };

    $scope.submitReport = function (report) {

        var submitForm = $scope.initializeReportForm(report);
        if ($scope.selectedReport == undefined) {
            submitForm._id = new Date().getTime() + '';
            $log.debug("Submitted report");
            $log.debug(submitForm);
            user.addReport(submitForm).then(function (resolved) {
                $.alert("تمت الإضافة بنجاح");
                $scope.newReportForm();
                $scope.renderReports();
            });

        }
        else {
            submitForm._id = $scope.selectedReport._id;
            $log.debug("Submitted report");
            $log.debug(submitForm);
            user.editReport(submitForm).then(function (resolved) {
                $.alert("تم التعديل بنجاح");
                $scope.newReportForm();
                $scope.renderReports();
            });

        }

    };
    $scope.deleteReport = function () {
        if ($scope.selectedReport) {
            user.deleteReport($scope.selectedReport._id).then(function (resolved) {
                $.alert("تم الحذف بنجاح");
                $scope.newReportForm();
                $scope.renderReports();
            });
        }
    };

    $scope.initializeReportForm = function (report) {
        var form = {};
        form.name = report.name;
        form.vision = report.vision ? report.vision : false;
        form.message = report.message ? report.message : false;
        form.principles = report.principles ? report.principles : false;
        form.goals = $scope.enableGoals && report.goals != undefined ? report.goals : "";
        form.programs = $scope.enablePrograms && report.programs != undefined ? report.programs : "";
        form.projects = $scope.enableProjects && report.projects != undefined ? report.projects : "";
        form.tasks = $scope.enableTasks && report.tasks != undefined ? report.tasks : "";
        form.kpis = $scope.enableKPIs && report.kpis != undefined ? report.kpis : "";
        form.entityl1 = report.entityl1 ? report.entityl1 : "";
        form.entityl2 = report.entityl2 ? report.entityl2 : "";
        form.entityl3 = report.entityl3 ? report.entityl3 : "";
        form.entityl4 = report.entityl4 ? report.entityl4 : "";

        return form;

    };

});