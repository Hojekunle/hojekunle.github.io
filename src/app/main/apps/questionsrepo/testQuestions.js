(function ()
{
    'use strict';

    angular
        .module('app.tested', ['ngMaterial'])        
        .controller('testController', testController);
        

    /** @ngInject */
    function testController()
    {

        var self=this;
        self.data = {
      group1 : 'Mango',
      group2 : '2',
      group3 : 'avatar-1'
    };

    self.avatarData = [{
        id: "avatars:svg-1",
        title: 'avatar 1',
        value: 'avatar-1'
      },{
        id: "avatars:svg-2",
        title: 'avatar 2',
        value: 'avatar-2'
      },{
        id: "avatars:svg-3",
        title: 'avatar 3',
        value: 'avatar-3'
    }];

    self.radioData = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: '3', isDisabled: true },
      { label: '4', value: '4' }
    ];

 


      self.effects = [{'name':'None', 'value': 'one'},{'name':'Maybe', 'value': 'two'},{'name':'Yes', 'value': 'three'}];
   self.effectSelected = { selected:'one'}
   self.checkSelection = function () {
       console.log(self.effectSelected.selected);
   }


    self.submit = function() {
      alert('submit');
    };

    self.addItem = function() {
      var r = Math.ceil(Math.random() * 1000);
      self.radioData.push({ label: r, value: r });
    };

    self.removeItem = function() {
      self.radioData.pop();
    };

//end Radio button
    }
})();