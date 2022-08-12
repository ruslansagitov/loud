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
            'test/**/*.js'
        ]
    });

    if (process.env.CI && process.env.SAUCE_ACCESS_KEY) {
        let customLaunchers = {
            sauceLabsAndroid: {
                base: 'SauceLabs',
                browserName: 'Chrome',
                'appium:deviceName': 'Google Pixel 4 GoogleAPI Emulator',
                'appium:platformVersion': '12.0'
            },
            sauceLabsIOs: {
                base: 'SauceLabs',
                browserName: 'Safari',
                deviceName: 'iPhone 13 Simulator',
                platformVersion: '15.4',
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
                dir: 'coverage/',
                subdir(browser) {
                    return browser.toLowerCase().split(/[ /-]/)[0];
                }
            }
        });
    }

    config.set({
        reporters
    });
};
