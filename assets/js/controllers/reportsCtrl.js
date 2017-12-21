app.controller('reportsCtrl', function ($log, $timeout, $scope, $rootScope, $location, user, $ngConfirm) {
    $log.debug("Reports view");
    $scope.reportForm = {};

    $scope.renderEntities = function () {
        user.getEntities().then(function (entities) {
            $scope.associations = entities;
        });
    };
    $scope.renderEntities();

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
debugger;
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

        if ($scope.selectedReport == undefined) {
            $.confirm({
                title: '',
                content: 'إضافة تقرير جديد؟',
                buttons: {
                    confirm: {
                        text: 'تأكيد',
                        action: function () {
                            var submitForm = $scope.initializeReportForm(report);
                            submitForm._id = new Date().getTime() + '';
                            $log.debug("Submitted report");
                            $log.debug(submitForm);
                            user.addReport(submitForm).then(function (resolved) {
                                $.alert("تمت الإضافة بنجاح");
                                $scope.newReportForm();
                                $scope.renderReports();
                            });
                        }
                    },
                    cancel: {
                        text: 'إلغاء',
                        action: function () {
                            console.log("Cancelled");
                        }
                    }

                }
            });


        }
        else {
            $.confirm({
                title: '',
                content: 'تعديل التقرير؟',
                buttons: {
                    confirm: {
                        text: 'تأكيد',
                        action: function () {
                            var submitForm = $scope.initializeReportForm(report);
                            submitForm._id = $scope.selectedReport._id;
                            $log.debug("Submitted report");
                            $log.debug(submitForm);
                            user.editReport(submitForm).then(function (resolved) {
                                $.alert("تم التعديل بنجاح");
                                $scope.newReportForm();
                                $scope.renderReports();
                            });
                        }
                    },
                    cancel: {
                        text: 'إلغاء',
                        action: function () {
                            console.log("Cancelled");
                        }
                    }

                }
            });
        }

    };
    $scope.deleteReport = function () {
        if ($scope.selectedReport) {
            $.confirm({
                title: '',
                content: 'حذف التقرير؟',
                buttons: {
                    confirm: {
                        text: 'تأكيد',
                        action: function () {
                            user.deleteReport($scope.selectedReport._id).then(function (resolved) {
                                $.alert("تم الحذف بنجاح");
                                $scope.newReportForm();
                                $scope.renderReports();
                            });
                        }
                    },
                    cancel: {
                        text: 'إلغاء',
                        action: function () {
                            console.log("Cancelled");
                        }
                    }

                }
            });

        } else {
            $.alert("لم يتم اختيار أي تقرير");
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
    $scope.exportReport = function (elem) {
        // if ($scope.selectedReport) {

            $ngConfirm({
                title: '',
                contentUrl: 'print-template.html',
                scope: $scope,
                rtl: true,
                onOpenBefore: function (scope) {
                    // scope.entity = "جامعة الحرمين | كلية المسجد النبوي | مكتب عميد الكلية";
                    debugger;
                    scope.entityl1 = '';
                    scope.entityl2 = '';
                    scope.entityl3 = '';
                    scope.entityl4 = '';
                    for (var x in $scope.associations) {
                        if ($scope.reportForm.entityl1 === $scope.associations[x]._id) {
                            scope.entityl1 = $scope.associations[x].name;
                            if ($scope.reportForm.entityl2 != undefined && $scope.reportForm.entityl2 != '') {
                                scope.entityl2 = "| " + $scope.associations[x].children[$scope.reportForm.entityl2].name;
                                if($scope.reportForm.entityl3 != undefined && $scope.reportForm.entityl3 != ''){
                                    scope.entityl3 = "| " + $scope.associations[x].children[$scope.reportForm.entityl2].children[$scope.reportForm.entityl3].name;
                                    if($scope.reportForm.entityl4 != undefined && $scope.reportForm.entityl4 != ''){
                                        scope.entityl4 = "| " + $scope.associations[x].children[$scope.reportForm.entityl2].children[$scope.reportForm.entityl3].children[$scope.reportForm.entityl4].name;
                                    }
                                }
                            }
                             
                        }
                    }
                    user.getHomeContents().then(function (resolved) {
                        for (var index in resolved) {
                            if (resolved[index]._id == "homeContents") {
                                scope.message = resolved[index].data.message;
                                scope.vision = resolved[index].data.vision;
                                scope.principles = resolved[index].data.principles;
                            }
                        }
                    });
                    user.getGoals().then(function (goals) {
                        $scope.strategicGoals = goals;
                        // $scope.flatGoals = {};
                        // if (goals) {
                        //     for (var goal in goals) {
                        //         $scope.flatGoals[goals[goal]._id] = goals[goal].name;
                        //         if (Object.keys(goals[goal].subgoals)) {
                        //             for (var subgoal in goals[goal].subgoals) {
                        //                 $scope.flatGoals[subgoal] = goals[goal].subgoals[subgoal].name;
                        //             }
                        //         }
                        //     }
                        //     $log.debug("flat goals");
                        //     $log.debug($scope.flatGoals);
                        // }
                    });
                    user.getPrograms(undefined).then(function (resolved) {
                        // $timeout(function () {
                        $scope.programs = resolved;
                        // $scope.$apply();
                        // });


                    });
                    user.getProjects(undefined).then(function (projects) {
                        // $timeout(function () {
                        $scope.projects = projects;
                        // $scope.$apply();
                        // });

                    });

                },
                buttons: {
                    add: {
                        text: 'طباعة',
                        btnClass: 'btn-blue',
                        action: function (scope, button) {
                            // $("#result").load("print-template.html");
                            // var template = document.getElementById("#result");

                            // debugger;
                            // var mywindow = window.open('', 'PRINT', 'height=400,width=600');

                            // mywindow.document.write(template.innerHTML);

                            // mywindow.document.close(); // necessary for IE >= 10
                            // mywindow.focus(); // necessary for IE >= 10*/

                            // mywindow.print();
                            // mywindow.close();

                        }
                    },
                    cancel: {
                        text: 'إلغاء',
                        btnClass: 'btn-red',
                        action: function (scope, button) {
                        }
                    },
                }
            });
        // } else {
            // $.alert("لم يتم اختيار أي تقرير");
        // }


    };

});