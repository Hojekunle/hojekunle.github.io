(function ()
{
    'use strict';

    angular
        .module('app.questionsrepo',
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
        $stateProvider.state('app.questionsrepo', {
            url    : '/questionsrepo',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/questionsrepo/questionsrepo.html',
                    controller : 'questionsRepoController as vm'
                }
            },
            resolve: {
                questionsrepository: function (msApi)
                {
                    //console.log(msApi.resolve('products.products@get@5'));
                    return msApi.resolve('clients.clients@get@50');                   
                    
                },
                /*User: function (msApi)
                {
                    return msApi.resolve('users.users@get');
                }*/
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/questionsrepo');

        // Api
        msApiProvider.register('questions.questions', ['app/data/contacts/contacts.json']);
        //msApiProvider.register('questions.user', ['app/data/contacts/user.json']);

        msApiProvider.register('clients.clients', ['clients/res']);
        //msApiProvider.register('users.users', ['app/data/contacts/user.json']);
        

        // Navigation
        msNavigationServiceProvider.saveItem('apps.questionsrepo', {
            title : 'Questions',
            icon  : 'icon-account-box',
            state : 'app.questionsrepo',
            weight: 10
        });

    }

})();
