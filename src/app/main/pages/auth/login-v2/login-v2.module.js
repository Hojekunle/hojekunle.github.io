(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login-v2', [])
        .config(config)
        .run(function ($rootScope, $auth, $stateParams, PermRoleStore, PermPermissionStore) {
               
                PermRoleStore
                .defineRole('ANON', function (stateParams) {        
                    return true; // Is anonymous        
                });
            
                PermRoleStore
                .defineRole('ADMIN', function (stateParams) {
                    
                    return false;
                });

                PermPermissionStore
                .definePermission('isLoggedIn', function () {
                    console.log('hello');
                    console.log($auth.isAuthenticated())
                    if ($auth.isAuthenticated()) {
                    return true; // Is loggedin
                        }
                    return false;
                    }
                );

                PermPermissionStore
                .definePermission('anonymous', function () {        
                    return false;        
                });
                        
            });

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        msApiProvider.setBaseUrl('http://localhost:8000/api/v1/');
        $stateProvider.state('app.pages_auth_login-v2', {
            url      : '/login',
            data: {
                permissions: {
                except: ['isLoggedIn'],
                redirectTo: 'app.dashboards_project'
                  }
            },
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-with-toolbar.html',
                    controller : 'MainController as vm'
                },
                'toolbar@app.pages_auth_login-v2'   : {
                        templateUrl: 'app/toolbar/layouts/content-toolbar-guest/toolbar.html',
                        controller : 'ToolbarController as vm'
                    },
                'content@app.pages_auth_login-v2': {
                    templateUrl: 'app/main/pages/auth/login-v2/login-v2.html',
                    controller : 'LoginV2Controller as vm'
                }
            },
            bodyClass: 'login-v2'
            
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/login-v2');
     

        // Navigation
        msNavigationServiceProvider.saveItem('pages.auth.login-v2', {
            title : 'Login v2',
            state : 'app.pages_auth_login-v2',
            weight: 2
        });
    }

})();