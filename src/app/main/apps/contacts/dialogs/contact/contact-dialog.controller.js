(function ()
{
    'use strict';

    angular
        .module('app.contacts')
        .controller('ContactDialogController', ContactDialogController);

    /** @ngInject */
    function ContactDialogController($mdDialog, Contact, Contacts, User, msUtils, msApi, dataFactory)
    {
        var vm = this;

        // Data
        vm.apiUrl=msApi.getBaseUrl() ;
        vm.title = 'Edit Contact';
        vm.contact = angular.copy(Contact);
        vm.contacts = Contacts;
        vm.user = User;
        vm.newContact = false;
        vm.allFields = false;

        if ( !vm.contact )
        {
            vm.contact = {
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

            vm.title = 'New Contact';
            vm.newContact = true;
            vm.contact.tags = [];
        }

        // Methods
        vm.addNewContact = addNewContact;
        vm.saveContact = saveContact;
        vm.deleteContactConfirm = deleteContactConfirm;
        vm.closeDialog = closeDialog;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new contact
         */
        function addNewContact()
        {
            console.log('Adding new contact....');
            
            if ( vm.contact.name!='undefined' && vm.contact.name!='')
                {         
                    console.log(vm.contact.name);
					vm.contacts.unshift(vm.contact);					
                    dataFactory.httpRequest(vm.apiUrl+'products','POST',{},vm.contact).then(function(data) {                    
                    vm.contacts.unshift(vm.contact);
                    });                
                }
            closeDialog();
        }

        /**
         * Save contact
         */
        function saveContact()
        {
            // Dummy save action...saves the updated record in the array at the corresponding id 
            for ( var i = 0; i < vm.contacts.length; i++ )
            {
                if ( vm.contacts[i].id === vm.contact.id )
                {
                    vm.contacts[i] = angular.copy(vm.contact);
                    break;
                }
            }          
            dataFactory.httpRequest(vm.apiUrl+'products/'+vm.contact.id,'PUT',{},{                
                name: vm.contact.name,
                description: vm.contact.description,
                user_id: 1
            }).then(function(res) {
                //vm.contact = res.data;
               
            });
            closeDialog();
        }

        /**
         * Delete Contact Confirm Dialog
         */
        function deleteContactConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the contact?')
                .htmlContent('<b>' + vm.contact.name + ' ' + vm.contact.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete contact')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.contacts.splice(vm.contacts.indexOf(Contact), 1);

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