(function ()
{
    'use strict';

    angular
        .module('app.questions',
            [
                // 3rd Party Dependencies
                'xeditable'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, $mdIconProvider)
    {
        $mdIconProvider.iconSet("avatars", 'assets/angular-material-assets/icons/avatar-icons.svg',128);
        msApiProvider.setBaseUrl('http://localhost:8000/api/v1/');
        $stateProvider.state('app.questions', {
            url    : '/questions',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/questions/questions.html',
                    controller : 'questionsController as vm'
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
        $translatePartialLoaderProvider.addPart('app/main/apps/questions');

        // Api
        msApiProvider.register('questions.questions', ['app/data/contacts/contacts.json']);
        //msApiProvider.register('questions.user', ['app/data/contacts/user.json']);

        msApiProvider.register('products.products', ['products']);
        //msApiProvider.register('users.users', ['app/data/contacts/user.json']);
        

        // Navigation
        msNavigationServiceProvider.saveItem('apps.questions', {
            title : 'Questions',
            icon  : 'icon-account-box',
            state : 'app.questions',
            weight: 10
        });

    }

})();
