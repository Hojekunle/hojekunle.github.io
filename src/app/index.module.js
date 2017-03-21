(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Common 3rd Party Dependencies
            
            'uiGmapgoogle-maps',
            'textAngular',
            'xeditable',
            'satellizer',
            'ui.router',
            'angular-growl',
            'ngAnimate',
            'permission',
            'permission.ui',
            // Core
            'app.core',
            'app.pages',
            'app.notes',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            // Apps
            'app.dashboards',
            'app.calendar',
            'app.e-commerce',
            'app.mail',
            'app.chat',
            'app.file-manager',
            'app.gantt-chart',
            'app.scrumboard',
            'app.todo',
            'app.tested',
            'app.questions',
            'app.questionsadmin',
            'app.questionsrepo',
            
            'app.contacts',
            

            // Pages
            

            // User Interface
            'app.ui',

            // Components
            'app.components'
        ]);
})();
