  $(function() {

      var APP = window.APP || {};

      router
          .config(function(state) {
              state
                  .root('main')
                  .when('home', {
                      templateUrl: 'pages/home.tmpl.html',
                      cb: function(state) {
                          console.log('loaded state:', state);
                          APP.modules.Home.init();
                      },
                      unload: function(nextState, cb) {
                          APP.modules.Home.unload();
                          cb();
                      }
                  })
                  .when('about', {
                      templateUrl: 'pages/about.tmpl.html',
                      cb: function(state) {
                          console.log('loaded state:', state);
                          APP.modules.About.init();
                      }
                  })
                  .when('test/:id', {
                      templateUrl: 'pages/test.tmpl.html',
                      cb: function(state) {
                        console.log('test init!');
                      }
                  })
                  .when('test/:id:/:number', {
                      templateUrl: 'pages/test.tmpl.html',
                      cb: function(state) {
                        console.log('test init!');
                      }
                  })
                  .other('home');
          })
          .on('routerChanged', function(ev, params) {
              // console.log('route has changed!:', ev, params);
          })
          .start();

      $('button').on('click', function() {
          router.go('about');
      })
  });
