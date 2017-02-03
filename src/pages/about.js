var APP = window.APP || {};

APP.modules = (function(modules) {

    modules.About = (function() {

        return {
            init: function() {
                console.log('About.init()');
            }
        }

    })();

    return modules;
})(APP.modules || {});
