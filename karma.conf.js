module.exports = function(config) {
    var browsers;

    if (process.env.KARMA_BROWSERS) {
        browsers = process.env.KARMA_BROWSERS.split(',');
    }

    config.set({
        frameworks: ['mocha'],
        browsers: browsers,
        files: ['build/test.js'],
        reporters: ['dots']
    });
};
