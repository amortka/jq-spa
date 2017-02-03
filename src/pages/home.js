var APP = window.APP || {};

APP.modules = (function(modules) {

  modules.Home = (function() {

    return {
      init: function() {
        console.log('hello world!');
      },
      unload: function() {
        console.log('bye bye world!');
      }
    }

  })();

  return modules;
})(APP.modules || {});
