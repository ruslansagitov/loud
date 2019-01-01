'use strict';

module.exports = function(config) {
    var browsers,
        reporters = ['dots'];

    if (process.env.KARMA_BROWSERS) {
        browsers = process.env.KARMA_BROWSERS.split(',');
    }

    config.set({
        frameworks: ['jasmine'],
        browsers: browsers,
        files: [
            'dist/loud.js',
            require.resolve('es5-shim'),
            require.resolve('html5shiv/dist/html5shiv'),
            'test/**/*.js'
        ]
    });

    if (process.env.CI && process.env.SAUCE_ACCESS_KEY) {
        var customLaunchers = {
            sauceLabsEdge: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                version: '16.16299'
            },
            sauceLabsSafari: {
                base: 'SauceLabs',
                browserName: 'safari',
                version: '12.0'
            },
            sauceLabsIOs: {
                base: 'SauceLabs',
                browserName: 'Safari',
                deviceName: 'iPhone X Simulator',
                platformVersion: '12.0',
                platformName: 'iOS'
            },
            sauceLabsAndroid: {
                base: 'SauceLabs',
                browserName: 'android',
                deviceName: 'Android GoogleAPI Emulator',
                version: '7.1'
            },
            sauceLabsIE8: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: 8
            }
        };

        reporters.push('saucelabs');
        config.set({
            browsers: browsers.concat(Object.keys(customLaunchers)),
            captureTimeout: 120000,
            sauceLabs: {
                testName: 'Loud'
            },
            customLaunchers: customLaunchers
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
        reporters: reporters
    });
};
