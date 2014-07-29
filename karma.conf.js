module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        browsers: ['Firefox', 'PhantomJS'],
        files: [require.resolve('es5-shim'), 'build/test.js'],
        reporters: ['dots']
    });
};
