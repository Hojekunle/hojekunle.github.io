(function ()
{
    'use strict';

    angular
        .module('app.questionsrepo')        
        .controller('questionsRepoController', questionsRepoController);
        

    /** @ngInject */
    function questionsRepoController($scope, msUtils, $mdDialog, $document, questionsrepository)
    {

      var vm=this;
      vm.questions = questionsrepository.data;
      vm.questionr = questionsrepository.data;
      
      vm.toggleSelectquestion = toggleSelectquestion;
      
      vm.answerSelected = {selected: ''};
      //vm.answerSelected = {selected: '1'}; sets answer for que 1 if md-radio-button d.id is in use
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
        vm.nextquestion = nextquestion;
        vm.previousquestion=previousquestion;
        vm.checkToggle=checkToggle;
        vm.indexOf = indexOf;


        vm.answer = {
            quenum:'',
            single_ans: '',
            multiple_ans: {},
            ordered_ans:{},
            text_ans:'',
            ques_type:'',
            options: {},
            user_id:''
         } 
        vm.answers = [];

         vm.currentque={
        selected: 1
      };

        vm.selectedId = 0;
        vm.selectedAns = function() {
      return $filter('filter')(vm.answer, { id: vm.selectedId })[0].Name;
    };
     
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
                controller         : 'questionDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/apps/questionsrepo/dialogs/question/question-dialog.html',
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

       function indexOf(id, items) {
           console.log('checking answers index');           
           //console.log(id);
           //console.log(items);
            var i = 0;
            var len = items.length;
            for (i = 0; i < len; i++) {
                if (id === items[i].quenum) {
                return i;
                }
            }
            return -1;
            }

         function indexOOf(item_name, items) {
           console.log('checking answers index');           
           //console.log(id);
           //console.log(items);
            var i = 0;
            var len = items.products.length;
            for (i = 0; i < len; i++) 
                {
                    
                        if (item_name === items.products[i].name)
                        {
                            return i;
                        }
                }
            
            return -1;
            }


        function nextquestion(sequence)
        {
           if (vm.questions.length> 0)
            {
               
                console.log("calling next...")
                
                //aniticipate the next que as the current but consider the existing as the current (the else stmt) if no answers for the next que et
                //for any n questions there a n-1 answers: avoid adding n+1 th answer
                if (vm.currentque.selected<vm.questions.length+1)
                {
                    if (indexOf(vm.currentque.selected, vm.answers)>-1)
                    {
                        vm.currentque.selected=vm.currentque.selected+1;
                        console.log('next existing...');
                        var stored_answer_next='';
                        
                        //vm.currentque.selected= vm.currentque.selected+1;
                        //console.log(vm.currentque.selected);
                        //console.log(vm.answers);
                        //console.log(vm.answers[vm.currentque.selected-1]); 

                        //check if user selects a new answer for the que n+1 when current que is n
                        //var stored_answer = ((vm.answers[vm.currentque.selected-2].single_ans!='' || vm.answers[vm.currentque.selected-2].single_ans!=undefined) ? vm.answers[vm.currentque.selected-2].single_ans : '');
                        if (!!vm.answers[vm.currentque.selected-1])
                        {
                                stored_answer_next = vm.answers[vm.currentque.selected-1].single_ans;
                        }

                        //console.log(vm.currentque.selected-1);
                        console.log(stored_answer_next);  
                        console.log(vm.answerSelected.selected);
                        
                        //set answer for previous que in case its changed now
                        vm.answers[vm.currentque.selected-2].single_ans=vm.answerSelected.selected;

                        //set answer for current que(showing on next) as that stored
                        vm.answerSelected.selected= stored_answer_next;

                        
                        //console.log(vm.answerSelected.selected);
                        //console.log(vm.answers[vm.currentque.selected-2]);
                        
                        
                        
                        
                        //console.log(vm.answerSelected.selected);                        
                        //vm.currentque.selected=sequence+1;
                        console.log(vm.answers);
                        console.log(vm.answerSelected.selected);
                        console.log(vm.currentque.selected);
                        
                    }
                    else{
                        console.log('next non-existing...');
                            /*
                                console.log(vm.currentque.selected); 
                                console.log(vm.questions.length);
                                //console.log(vm.questions[vm.currentque.selected].products[0].name); 
                                //console.log(vm.questions[vm.currentque.selected].id); 
                                console.log(vm.answerSelected.selected);
                                /* vm.questions.forEach(function (question)
                                    {
                                        console.log(question.products); 
                                    });  
                            */
                            //currentque.selected ref questionno in db to display next que. currentque starts 1, questions array starts 0
                            //reset current answer first                        
                        
                        //get and check if current question is answered: last que from prev(having -1 previously)+1:

                        
                        
                        vm.answer = {
                                quenum:vm.currentque.selected,            
                                single_ans: vm.answerSelected.selected,
                                multiple_ans: {},
                                ordered_ans:{},
                                text_ans:'',
                                ques_type:'',
                                options: vm.questions[vm.currentque.selected-1].products,
                                user_id:''
                            } 
                            vm.answers.push(vm.answer);
                            //console.log(vm.answers);

                            //reset previous answer after saving the answer
                             //vm.answerSelected.selected='';

                             //go to next que
                            //console.log(vm.answerSelected.selected);

                        //set answer for previous que in case its changed now
                        //vm.answers[vm.currentque.selected-2].single_ans=vm.answerSelected.selected;
                        console.log(vm.answerSelected.selected);
                        console.log(vm.currentque.selected);
                        console.log(vm.answers[vm.currentque.selected-2]);

                            vm.currentque.selected=sequence+1;  
                            vm.answer = null;
                      
                    }
                    
                
                }
                
                console.log('end of next');
            }
        }

        function previousquestion(sequence)
        {
           // vm.answerSelected.selected = vm.answers[vm.currentque.selected].single_ans;
            console.log(vm.answers[vm.currentque.selected]);
            if ( vm.currentque.selected > 1 )
            {
                console.log("calling previous...");
                console.log(vm.currentque.selected-1);
                

                //check if answer exist for current que n when previous is hit and add to answers array 
                if ((indexOf(vm.currentque.selected, vm.answers) <0)  && (vm.currentque.selected < vm.questions.length+1))
                {
                    console.log('Adding previous answer for que n+1');
                    vm.answer = {
                                quenum:vm.currentque.selected,            
                                single_ans: vm.answerSelected.selected,
                                multiple_ans: {},
                                ordered_ans:{},
                                text_ans:'',
                                ques_type:'',
                                options: vm.questions[vm.currentque.selected-1].products,
                                user_id:''
                            } 
                            vm.answers.push(vm.answer);
                }

                //get chosen answer next_stored_ans for que n+1 when current question is n if it exists.
                var next_stored_ans='';
                if (!!vm.answerSelected.selected && vm.answerSelected.selected!='')
                {
                    next_stored_ans=vm.answerSelected.selected;
                    console.log(vm.answerSelected.selected);
                }


                //set answer for this current que n to that previously stored: i.e answer[n-2]
                console.log('running');
                console.log(vm.answers);
                vm.answerSelected.selected= vm.answers[vm.currentque.selected-2].single_ans;
                console.log(vm.answerSelected.selected);
                
                
                //set answer for que n+1 before this current que n in case its changed now if it existed before
                //for n questions, answer does not exist for question n+1th. hence check to avoid exceptions
                if (vm.currentque.selected != vm.questions.length+1)
                {
                    console.log('former que');
                    //console.log(vm.currentque.selected-1);
                    console.log(vm.answers);
                    console.log(vm.currentque.selected-1);
                    
                    //if (Object.prototype.hasOwnProperty.call(vm.answers[vm.currentque.selected-1], 'single_ans')) .. toddmotto.com..
                    //doublebang !! cast values to False or True (!! returns True if property exist). hasOwnProperty can not check a non-existing object for a property
                    if (!!vm.answers[vm.currentque.selected-1])
                    {
                        //console.log(exists);
                        var prev_stored_ans= (vm.answers[vm.currentque.selected-1].single_ans ? vm.answers[vm.currentque.selected-1].single_ans: '');
                        
                    
                        if (prev_stored_ans!=vm.answerSelected.selected)
                        {
                            console.log('former que answer changed');
                            vm.answers[vm.currentque.selected-1].single_ans = next_stored_ans;
                            console.log(vm.answerSelected.selected);
                            console.log(next_stored_ans);
                            console.log(prev_stored_ans);
                        }
                        else
                        {
                            console.log('former que answer static');
                            //vm.answers[vm.currentque.selected-1].single_ans = prev_stored_ans;
                            //console.log(vm.answerSelected.selected);
                            
                            //console.log(prev_stored_ans);
                        }
                    }
                    
                   
                }

                //set question num for next que (n-1 if current que is n)
                //scope of vm.answerSelected.selected changes at this point as it defaults to the selected answer fetched from answer stored
                vm.currentque.selected=sequence-1;
                
            }
            
        }

        function checkToggle(que, num) 
        {         
            //console.log('change question'); 
            //console.log(num);
             
            return que.questionno==num;        
        }

        
      
     



    

//end Radio button
    }
})();