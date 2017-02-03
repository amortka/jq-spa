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
                  .when('test/:id/:name', {
                      templateUrl: 'pages/test.tmpl.html',
                      cb: function(state, params) {
                        console.log('test init with params');
                        console.log('id:', params.id);
                        console.log('name:', params.name);
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
