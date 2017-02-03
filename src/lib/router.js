(function(global) {

    var Router = function() {
        var self = this;
        this.rootEl;
        this.hash = '#/';
        this.states = {};
        this.internal = false;
        this.currentState = null;

        var PARAMETER_REGEXP = /([:*])(\w+)/g;
        var WILDCARD_REGEXP = /\*/g;
        var REPLACE_VARIABLE_REGEXP = '([^\/]+)';
        var REPLACE_WILDCARD = '(?:.*)';
        var FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';

        this.init = function() {
            createEvent();
        }

        this.go = function(state) {
            self.route(state);
        }

        this.route = function(state) {
            var stateName = state && (state.name || state);

            var viewElement = this.rootEl;
            var states = this.states;

            var route = findRoute(stateName);
            console.log('route', route);

            if (!route) {

                stateName = _.find(this.states, 'default').name;
            }

            var cb = route.state.cb || (function(stateName) {});
            if (route.state.templateUrl) {
                if (this.currentState && route.state.unload) {
                    route.state.unload(stateName, function() {
                        viewElement.load(route.state.templateUrl, function(dom) {
                            console.log('params', getParams(route));
                            cb(stateName);
                        });
                    });
                } else {
                    viewElement.load(route.state.templateUrl, function(dom) {
                        console.log('params', getParams(route));
                        self.currentState = stateName;
                        cb(stateName);
                    })
                };
            }
        }

        this.config = function(configure, options) {
            configure(this);

            return this;
        }

        this.when = function(stateName, stateConfig) {
            self.states[stateName] = stateConfig
            self.states[stateName].name = stateName;
            return self;
        }

        this.other = function(stateName) {
            if (!self.states[stateName]) {
                var stateName = Object.keys(self.states)[0];
            }
            self.states[stateName].default = true;
        }

        this.on = function() {
            return this;
        }

        this.start = function() {
            initView();
        }

        this.root = function(el) {
            this.rootEl = $(el || 'RouterView');
            return this;
        }

        function findRoute(stateName) {
          var found = _.chain(self.states)
          .map(function(state) {
            var dynamicParams = replaceDynamicParams(state.name);
            console.log('dynamicParams', dynamicParams);
            var match = stateName.match(dynamicParams.regex);
            return match ? {
              match: match,
              state: state,
              dynamicParams: dynamicParams.params
            } : false;
          })
          .filter(function(state) {
            return !!state;
          })
          .value();

          return found.length > 0 ? _.first(found) : null;
        }

        function setUrl(state) {
            var path = window.location.pathname;
            var url = path + self.hash + state;

            window.location.href = url;
        }

        function getParams(route) {
          console.log('getting params for route', route);
          var params = {}
          if (route.dynamicParams.length > 0) {
            params = {
              foo: 'bar'
            };
          }

          return params;

        }

        function replaceDynamicParams(state) {
            console.log('state', state);

            var params = [];
            var regex = new RegExp(
                clean(state)
                .replace(PARAMETER_REGEXP, function(full, dots, name) {
                    params.push(name);
                    return REPLACE_VARIABLE_REGEXP;
                })
                .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP
              );

            return {
                regex: regex,
                params: params
            }
        }

        function initView() {
            var currentState = getCurrentState();
            if (!!currentState && self.states[currentState] !== 'undefined') {
                self.route(self.states[currentState] || currentState);
            } else {
                var defaultState = _.find(self.states, 'default');
                self.route(defaultState);
            }
        }

        function getCurrentState() {
            return window.location.href.split(self.hash)[1];
        }

        function createEvent() {
            var params = {
                prevUrl: '',
                prevState: '',
                nextUrl: '',
                nextState: ''
            }

            var routerEvent = new CustomEvent('routerChanged', {
                'params': params
            });

            window.addEventListener('hashchange', function(e) {
                params.oldUrl = e.oldURL || '';
                params.oldState = e.oldURL.split(self.hash)[1] || '';
                params.newUrl = e.newURL || '';
                params.newState = e.newURL.split(self.hash)[1] || '';

                window.dispatchEvent(routerEvent);

                var currStateName = getCurrentState(); //window.location.href.split(self.hash)[1];
                if (!self.isInternal) {
                    self.route(currStateName);
                }
            })

        }

        function clean(s) {
          if (s instanceof RegExp) return s;
          return s.replace(/\/+$/, '').replace(/^\/+/, '/');
        }

        this.init();
    }

    window.router = typeof window.router === 'undefined' ? new Router() : window.router;
})(window);
