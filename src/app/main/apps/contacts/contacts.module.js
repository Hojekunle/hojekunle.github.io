(function ()
{
    'use strict';

    angular
        .module('app.contacts',
            [
                // 3rd Party Dependencies
                'xeditable'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        msApiProvider.setBaseUrl('http://localhost:8000/api/v1/');
        $stateProvider.state('app.contacts', {
            url    : '/contacts',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/contacts/contacts.html',
                    controller : 'ContactsController as vm'
                }
            },
            resolve: {
                Contacts: function (msApi)
                {
                    return msApi.resolve('products.products@get');
                },
                User: function (msApi)
                {
                    return msApi.resolve('products.products@get');
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/contacts');

        // Api
        msApiProvider.register('contacts.contacts', ['app/data/contacts/contacts.json']);
        msApiProvider.register('contacts.user', ['app/data/contacts/user.json']);

        msApiProvider.register('products.products', ['products']);
        msApiProvider.register('users.users', ['app/data/contacts/user.json']);
        

        // Navigation
        msNavigationServiceProvider.saveItem('apps.contacts', {
            title : 'Contacts',
            icon  : 'icon-account-box',
            state : 'app.contacts',
            weight: 10
        });

    }

})();