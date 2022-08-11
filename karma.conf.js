'use strict';

module.exports = function(config) {
    let browsers,
        reporters = ['dots'];

    if (process.env.KARMA_BROWSERS) {
        browsers = process.env.KARMA_BROWSERS.split(',');
    }

    config.set({
        frameworks: ['jasmine'],
        browsers,
        files: [
            'dist/loud.js',
            require.resolve('es5-shim'),
            require.resolve('html5shiv/dist/html5shiv'),
            'test/**/*.js'
        ]
    });

    if (process.env.CI && process.env.SAUCE_ACCESS_KEY) {
        let customLaunchers = {
            sauceLabsChrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                browserVersion: '87.0',
                platformName: 'Windows 10'
            },
            sauceLabsIOs: {
                base: 'SauceLabs',
                browserName: 'Safari',
                deviceName: 'iPhone X Simulator',
                platformVersion: '14.0',
                platformName: 'iOS'
            }
        };

        reporters.push('saucelabs');
        config.set({
            browsers: browsers.concat(Object.keys(customLaunchers)),
            captureTimeout: 120000,
            sauceLabs: {
                testName: 'Loud'
            },
            customLaunchers
        });
    }

    if (process.env.KARMA_COVERAGE) {
        reporters.push('coverage');
        config.set({
            preprocessors: {
                'dist/loud.js': ['sourcemap'],
                'lib/*.js': ['coverage']
            },
            coverageReporter: {
                type: process.env.KARMA_COVERAGE,
                dir: 'coverage/'
            }
        });
    }

    config.set({
        reporters
    });
};
