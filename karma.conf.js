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
            },
            sauceLabsIE11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: 11
            },
            sauceLabsIE10: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: 10
            },
            sauceLabsIE9: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: 9
            },
            sauceLabsIE8: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: 8
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
