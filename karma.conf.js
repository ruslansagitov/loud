module.exports = function(config) {
    var browsers;

    if (process.env.KARMA_BROWSERS) {
        browsers = process.env.KARMA_BROWSERS.split(',');
    }

    config.set({
        frameworks: ['mocha'],
        browsers: browsers,
        files: [
            require.resolve('es5-shim'),
            require.resolve('html5shiv/dist/html5shiv'),
            'build/test.js'
        ],
        reporters: ['dots']
    });

    if (process.env.CI && process.env.SAUCE_ACCESS_KEY) {
        var customLaunchers = {
            sauceLabsIE11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: 11
            },
            sauceLabsChrome: {
                base: 'SauceLabs',
                browserName: 'chrome'
            }
        };

        config.set({
            browsers: browsers.concat(Object.keys(customLaunchers)),
            reporters: ['dots', 'saucelabs'],
            captureTimeout: 120000,
            sauceLabs: {
                testName: 'Loud'
            },
            customLaunchers: customLaunchers
        });
    }
};
