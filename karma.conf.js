module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        browsers: ['Firefox', 'PhantomJS'],
        files: ['build/test.js'],
        reporters: ['dots']
    });
};
