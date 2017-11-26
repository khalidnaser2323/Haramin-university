/**
 * Created by Khalid on 11/13/2017.
 */
//implement main user services
/**
 * Created by Khalid on 11/6/2017.
 */
/**
 * @ngdoc factory
 * @name user
 * @description Responsible for:  <br />
 * &nbsp;&nbsp; get user data to be passed to controllers
 */

app.factory('user', function ($q, $rootScope, $log, $timeout, connector) {
    return {
        'getGoals': function () {
            var $this = this;
            var deferred = $q.defer();
            connector.send(undefined, '/goal/list', 'POST', null).then(function (resolvedGoals) {
                $log.debug('Resolved goals');
                $log.debug(resolvedGoals.data);
                deferred.resolve(resolvedGoals.data);
            }, function (rejected) {

            });
            return deferred.promise;
        },
        'deleteGoal': function (id) {
            var $this = this;
            var deferred = $q.defer();
            connector.send(null, '/goal/' + id, 'DELETE', null).then(function (resolved) {
                $log.debug('delete goal response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'addGoal': function (goalName) {
            var $this = this;
            var deferred = $q.defer();
            var data = {
                "_id": new Date().getTime() + '',
                "name": goalName,
                "subgoals": {}
            };
            connector.send(data, '/goal', 'POST', null).then(function (resolved) {
                $log.debug('Add goal response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
                debugger;
            });
            return deferred.promise;
        },
        'updateGoal': function (goalObject) {
            var $this = this;
            var deferred = $q.defer();
            debugger;

            connector.send(goalObject, '/goal', 'PUT', null).then(function (resolved) {
                $log.debug('Update goal response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
                debugger;
            });
            return deferred.promise;

        },
        'getEntities': function () {
            var $this = this;
            var deferred = $q.defer();
            connector.send(undefined, '/entity/list', 'POST', null).then(function (resolvedGoals) {
                $log.debug('Resolved entities');
                $log.debug(resolvedGoals.data);
                deferred.resolve(resolvedGoals.data);
            }, function (rejected) {

            });
            return deferred.promise;
        },
        'addEntity': function (entityName) {
            var $this = this;
            var deferred = $q.defer();
            var data = {
                "_id": new Date().getTime() + '',
                "name": entityName,
                "children": {}
            };
            connector.send(data, '/entity', 'POST', null).then(function (resolved) {
                $log.debug('Add entity response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
                debugger;
            });
            return deferred.promise;
        },
        'updateEntity': function (entityObject) {
            var $this = this;
            var deferred = $q.defer();
            debugger;

            connector.send(entityObject, '/entity', 'PUT', null).then(function (resolved) {
                $log.debug('Update entity response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
                debugger;
            });
            return deferred.promise;

        },
        'deleteEntity': function (id) {
            var $this = this;
            var deferred = $q.defer();
            connector.send(null, '/entity/' + id, 'DELETE', null).then(function (resolved) {
                $log.debug('delete entity response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'getPrograms': function (filterObject) {
            var $this = this;
            var deferred = $q.defer();

            if (filterObject) {
                var filter = angular.copy(filterObject);
                if (filterObject.entities.$elemMatch.l1 == undefined && filterObject.entities.$elemMatch.l2 == undefined && filterObject.entities.$elemMatch.l3 == undefined && filterObject.entities.$elemMatch.l4 == undefined) {
                    filter.entities = undefined;
                }
                if (filterObject.goals.$elemMatch.l1 == undefined && filterObject.goals.$elemMatch.l2 == undefined) {
                    filter.goals = undefined;
                }
            }
            connector.send(filter, '/program/list', 'POST', null).then(function (resolved) {
                $log.debug('get programs response');
                $log.debug(resolved.data);
                deferred.resolve(resolved.data);

            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'addProgram': function (program) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(program, '/program', 'POST', null).then(function (resolved) {
                $log.debug('Add program response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'editProgram': function (program) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(program, '/program', 'PUT', null).then(function (resolved) {
                $log.debug('Edit program response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'deleteProgram': function (programId) {
            var $this = this;
            var deferred = $q.defer();
            connector.send(null, '/program/' + programId, 'DELETE', null).then(function (resolved) {
                $log.debug('delete programs response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'getUsers': function (filterObject) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(filterObject, '/user/list', 'POST', null).then(function (resolved) {
                $log.debug('get users response');
                $log.debug(resolved.data);
                deferred.resolve(resolved.data);

            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'addUser': function (user) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(user, '/user', 'POST', null).then(function (resolved) {
                $log.debug('Add user response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
                debugger;
            });
            return deferred.promise;
        },
        'deleteUser': function (id) {
            var $this = this;
            var deferred = $q.defer();
            connector.send(null, '/user/' + id, 'DELETE', null).then(function (resolved) {
                $log.debug('delete user response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'updateUser': function (user) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(user, '/user', 'PUT', null).then(function (resolved) {
                $log.debug('update user response');
                $log.debug(resolved.data);
                debugger;
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
                debugger;
            });
            return deferred.promise;
        },
        'getProjects': function (filterObject) {
            var $this = this;
            var deferred = $q.defer();
            connector.send(filterObject, '/project/list', 'POST', null).then(function (resolved) {
                $log.debug('get projects response');
                $log.debug(resolved.data);
                deferred.resolve(resolved.data);

            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'deleteProject': function (projectId) {
            var $this = this;
            var deferred = $q.defer();
            connector.send(null, '/project/' + projectId, 'DELETE', null).then(function (resolved) {
                $log.debug('delete programs response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'addProject': function (project) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(project, '/project', 'POST', null).then(function (resolved) {
                $log.debug('Add Project response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        },
        'editProject': function (project) {
            var $this = this;
            var deferred = $q.defer();

            connector.send(project, '/project', 'PUT', null).then(function (resolved) {
                $log.debug('edit Project response');
                $log.debug(resolved.data);
                if (resolved.data.message === "OK") {
                    deferred.resolve(resolved.data);
                }
            }, function (rejected) {
                $log.debug(rejected);
                deferred.reject(rejected);
            });
            return deferred.promise;
        }


    };
});