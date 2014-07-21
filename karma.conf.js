module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        browsers: ['Firefox', 'PhantomJS'],
        files: ['build/test.js']
    });

    if (process.env.CI) {
        var customLaunchers = {
            'SauceLabs_Firefox': {
                base: 'SauceLabs',
                browserName: 'firefox'
            },
            'SauceLabs_Chrome': {
                base: 'SauceLabs',
                browserName: 'chrome'
            }
        };

        config.set({
            browsers: Object.keys(customLaunchers),
            reporters: ['progress', 'saucelabs'],
            captureTimeout: 120000,
            sauceLabs: {
                testName: 'Loud',
                tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
            },
            customLaunchers: customLaunchers
        });
    }
};
