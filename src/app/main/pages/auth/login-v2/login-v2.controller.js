(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login-v2')
        .config(function($authProvider, msApiProvider) {
            $authProvider.facebook({
            clientId: 'Facebook App ID'
            });

            // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
            $authProvider.facebook({
            clientId: 'Facebook App ID',
            responseType: 'token'
            });

            $authProvider.google({
            clientId: 'Google Client ID'
            });

            $authProvider.loginUrl = msApiProvider.getBaseUrl()+'authenticate';
                console.log('Auth details loading...');
                console.log(msApiProvider.getBaseUrl());
        })
        .controller('LoginV2Controller', LoginV2Controller);

    /** @ngInject */
    function LoginV2Controller($scope, $rootScope, $state, $auth , $http, msApi)
    {
        // Data
        var vm=this;
     
        vm.apiUrl=msApi.getBaseUrl() ;
        vm.user="";
        vm.auth = {};

        vm.reload = function($location) {
            reload();
        }

        vm.login = function() 
        {
            vm.loginError = false;
            vm.loginErrorText;

                var credentials = {
                    email: vm.form.email,
                    password:vm.form.password
                }

                console.log('Auth details...');
                console.log(vm.apiUrl);
                $auth.login(credentials).then(function() {
                    $http.get(vm.apiUrl + 'authenticate/user').success(function(res){
                        var user = JSON.stringify(res.user.username);
                        var username = res.user.username;
                        console.log('username...');
                        //console.log(res);
                        
                        
                        localStorage.setItem('user', user);
                        $rootScope.currentUser = user;
                        $rootScope.username = username;
                        vm.loginError = false;  
                        console.log($rootScope.currentUser);                
                        $state.go('app.dashboards_project', {});
                    })
                    .error(function(){
                        vm.loginError = true;
                        vm.loginErrorText = error.data.error;
                        
                        console.log(vm.loginErrorText);
                    })
                })
                .catch(function(response) {
                    console.log('hi login');
                    vm.loginError = true;
                });
             }
            
            }

                // Methods

                //////////
            
    })();