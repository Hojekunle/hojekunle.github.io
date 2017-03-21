(function ()
{
    'use strict';

    angular
        .module('app.questionsadmin',
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
        $stateProvider.state('app.questionsadmin', {
            url    : '/questions_portal',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/questionsadmin/questionsadmin.html',
                    controller : 'questionsAdminController as vm'
                }
            },
            resolve: {
                questions: function (msApi)
                {
                    return msApi.resolve('products.products@get');
                },
                /*User: function (msApi)
                {
                    return msApi.resolve('users.users@get');
                }*/
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/questionsadmin');

        // Api
        msApiProvider.register('questions.questions', ['app/data/contacts/contacts.json']);
        //msApiProvider.register('questions.user', ['app/data/contacts/user.json']);

        msApiProvider.register('products.products', ['products']);
        //msApiProvider.register('users.users', ['app/data/contacts/user.json']);
        

        // Navigation
        msNavigationServiceProvider.saveItem('apps.questionsadmin', {
            title : 'Questions Portal',
            icon  : 'icon-account-box',
            state : 'app.questionsadmin',
            weight: 10
        });

    }

})();
