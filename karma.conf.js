module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        browsers: ['Firefox', 'PhantomJS'],
        files: ['build/test.js'],
        reporters: ['dots']
    });

    if (process.env.TRAVIS) {
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
                startConnect: false,
                testName: 'Loud',
                tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
            },
            customLaunchers: customLaunchers
        });
    }
};
