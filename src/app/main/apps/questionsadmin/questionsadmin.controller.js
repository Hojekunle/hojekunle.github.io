(function ()
{
    'use strict';

    angular
        .module('app.questionsadmin')
        .controller('questionsAdminController', questionsAdminController);

    /** @ngInject */
    function questionsAdminController($scope, $mdSidenav, questions, msUtils, $mdDialog, $document, msApi, growl)
    {

        var vm = this;
        vm.apiUrl=msApi.getBaseUrl() ;
        // Data
        vm.questions = questions.data;
        //vm.user = User.data;
        vm.filterIds = null;
        vm.listType = 'all';
        vm.listOrder = 'name';
        vm.listOrderAsc = false;
        vm.selectedquestions = [];
        vm.newGroupName = '';
        vm.user=
               {
                    "data": {
                    "id": "5725a6802d10e277a0f35724",
                    "name": "John Doue",
                    "avatar": "./../assets/images/avatars/profile.jpg",
                    "starred": [
                        "5725a680ae1ae9a3c960d487",
                        "5725a6801146cce777df2a08",
                        "5725a680bbcec3cc32a8488a",
                        "5725a680bc670af746c435e2",
                        "5725a68009e20d0a9e9acf2a"
                    ],
                    "groups": [
                        {
                            "id": "5725a6802d10e277a0f35739",
                            "name": "Friends",
                            "contactIds": [
                                "5725a680bbcec3cc32a8488a",
                                "5725a680e87cb319bd9bd673",
                                "5725a6802d10e277a0f35775"
                            ]
                        }
                    ]
                }
             }
            

        // Methods
        vm.filterChange = filterChange;
        vm.openquestionDialog = openquestionDialog;
        vm.deletequestionConfirm = deletequestionConfirm;
        vm.deletequestion = deletequestion;
        vm.deleteSelectedquestions = deleteSelectedquestions;
        vm.toggleSelectquestion = toggleSelectquestion;
        vm.deselectquestions = deselectquestions;
        vm.selectAllquestions = selectAllquestions;
        vm.deletequestion = deletequestion;
        vm.addNewGroup = addNewGroup;
        vm.deleteGroup = deleteGroup;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        
        /**
         * Change questions List Filter
         * @param type
         */
        function filterChange(type)
        {

            vm.listType = type;

            if ( type === 'all' )
            {
                vm.filterIds = null;
            }
            else if ( type === 'frequent' )
            {
                vm.filterIds = vm.user.frequentquestions;
            }
            else if ( type === 'starred' )
            {
                vm.filterIds = vm.user.starred;
            }
            else if ( angular.isObject(type) )
            {
                vm.filterIds = type.questionIds;
            }

            vm.selectedquestions = [];

        }

        /**
         * Open new question dialog
         *
         * @param ev
         * @param question
         */
        function openquestionDialog(ev, question)
        {
            $mdDialog.show({
                controller         : 'questionAdminDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/apps/questionsadmin/dialogs/question/questionadmin-dialog.html',
                parent             : angular.element($document.find('#content-container')),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    question : question,
                    User    : vm.user,
                    questions: vm.questions
                }
            });
        }

        /**
         * Delete question Confirm Dialog
         */
        function deletequestionConfirm(question, ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the question?')
                .htmlContent('<b>' + question.name + ' ' + question.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete question')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {
                console.log("Before delete");
                deletequestion(question);
                vm.selectedquestions = [];
                growl.success("Successfully Deleted", {ttl: 2000});

            }, function ()
            {

            });
        }

        /**
         * Delete question
         */
        function deletequestion(question)
        {
            
            //msApi.request('products.products@delete', question.id, '', '');
            console.log("deleting...");
            console.log(vm.apiUrl);
            dataFactory.httpRequest(vm.apiUrl+'products/'+question.id,'DELETE').then(function(data) {
                //$scope.allitems.splice(index,1);
                vm.questions.splice(vm.questions.indexOf(question), 1);  
            });
            
                      
        }

        /**
         * Delete Selected questions
         */
        function deleteSelectedquestions(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the selected questions?')
                .htmlContent('<b>' + vm.selectedquestions.length + ' selected</b>' + ' will be deleted.')
                .ariaLabel('delete questions')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.selectedquestions.forEach(function (question)
                {
                    deletequestion(question);
                });

                vm.selectedquestions = [];

            });

        }

        /**
         * Toggle selected status of the question
         *
         * @param question
         * @param event
         */
        function toggleSelectquestion(question, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            if ( vm.selectedquestions.indexOf(question) > -1 )
            {
                vm.selectedquestions.splice(vm.selectedquestions.indexOf(question), 1);
            }
            else
            {
                vm.selectedquestions.push(question);
            }
        }

        /**
         * Deselect questions
         */
        function deselectquestions()
        {
            vm.selectedquestions = [];
        }

        /**
         * Sselect all questions
         */
        function selectAllquestions()
        {
            vm.selectedquestions = $scope.filteredquestions;
        }

        /**
         *
         */
        function addNewGroup()
        {
            if ( vm.newGroupName === '' )
            {
                return;
            }

            var newGroup = {
                'id'        : msUtils.guidGenerator(),
                'name'      : vm.newGroupName,
                'questionIds': []
            };

            vm.user.groups.push(newGroup);
            vm.newGroupName = '';
        }

        /**
         * Delete Group
         */
        function deleteGroup(ev)
        {
            var group = vm.listType;

            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the group?')
                .htmlContent('<b>' + group.name + '</b>' + ' will be deleted.')
                .ariaLabel('delete group')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.user.groups.splice(vm.user.groups.indexOf(group), 1);

                filterChange('all');
            });

        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

    }

})();
