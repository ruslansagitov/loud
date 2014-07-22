module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        browsers: ['Firefox', 'PhantomJS'],
        files: ['build/test.js'],
        reporters: ['dots']
    });

    if (process.env.TRAVIS) {
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
