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
                version: '13.10586'
            },
            sauceLabsSafari: {
                base: 'SauceLabs',
                browserName: 'safari',
                version: '9.0'
            },
            sauceLabsOpera12: {
                base: 'SauceLabs',
                browserName: 'opera',
                version: '12.12'
            },
            sauceLabsAndroid: {
                base: 'SauceLabs',
                browserName: 'android',
                deviceName: 'Android Emulator',
                version: '5.1'
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
