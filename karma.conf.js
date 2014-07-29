module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        browsers: ['Firefox', 'PhantomJS'],
        files: [require.resolve('es5-shim'), 'build/test.js'],
        reporters: ['dots']
    });

    if (process.env.CI && process.env.SAUCE_ACCESS_KEY) {
        var customLaunchers = {
            sauceLabsFirefox: {
                base: 'SauceLabs',
                browserName: 'firefox'
            },
            sauceLabsChrome: {
                base: 'SauceLabs',
                browserName: 'chrome'
            }
        };

        config.set({
            browsers: Object.keys(customLaunchers),
            reporters: ['dots', 'saucelabs'],
            captureTimeout: 120000,
            sauceLabs: {
                testName: 'Loud'
            },
            customLaunchers: customLaunchers
        });
    }
};
