(function ()
{
    'use strict';

    angular
        .module('app.questions')
        .controller('questionDialogController', questionDialogController);

    /** @ngInject */
    function questionDialogController($mdDialog, question, questions, User, msUtils, msApi, dataFactory)
    {
        var vm = this;

        // Data
        vm.apiUrl=msApi.getBaseUrl() ;
        vm.title = 'Edit question';
        vm.question = angular.copy(question);
        vm.questions = questions;
        vm.user = User;
        vm.newquestion = false;
        vm.allFields = false;

        if ( !vm.question )
        {
            vm.question = {
                'id'      : msUtils.guidGenerator(),
                'name'    : '',
                'lastName': '',
                'avatar'  : 'assets/images/avatars/profile.jpg',
                'nickname': '',
                'company' : '',
                'jobTitle': '',
                'email'   : '',
                'phone'   : '',
                'address' : '',
                'birthday': null,
                'notes'   : ''
            };

            vm.title = 'New question';
            vm.newquestion = true;
            vm.question.tags = [];
        }

        // Methods
        vm.addNewquestion = addNewquestion;
        vm.savequestion = savequestion;
        vm.deletequestionConfirm = deletequestionConfirm;
        vm.closeDialog = closeDialog;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new question
         */
        function addNewquestion()
        {
            console.log('Adding new question....');
            
            if ( vm.question.name!='undefined' && vm.question.name!='')
                {         
                    console.log(vm.question.name);
					vm.questions.unshift(vm.question);					
                    dataFactory.httpRequest(vm.apiUrl+'products','POST',{},vm.question).then(function(data) {                    
                    vm.questions.unshift(vm.question);
                    });                
                }
            closeDialog();
        }

        /**
         * Save question
         */
        function savequestion()
        {
            // Dummy save action...saves the updated record in the array at the corresponding id 
            for ( var i = 0; i < vm.questions.length; i++ )
            {
                if ( vm.questions[i].id === vm.question.id )
                {
                    vm.questions[i] = angular.copy(vm.question);
                    break;
                }
            }          
            dataFactory.httpRequest(vm.apiUrl+'products/'+vm.question.id,'PUT',{},{                
                name: vm.question.name,
                description: vm.question.description,
                user_id: 1
            }).then(function(res) {
                //vm.question = res.data;
               
            });
            closeDialog();
        }

        /**
         * Delete question Confirm Dialog
         */
        function deletequestionConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the question?')
                .htmlContent('<b>' + vm.question.name + ' ' + vm.question.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete question')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.questions.splice(vm.questions.indexOf(question), 1);

            });
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();