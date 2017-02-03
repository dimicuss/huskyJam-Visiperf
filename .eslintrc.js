var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "root": true,
    env: {
        'es6': true,        // We are writing ES6 code
        'browser': true,    // for the browser
        'commonjs': true    // and use require() for stylesheets
    },
    "parserOptions": {
        "ecmaFeatures": {
            "modules": true
        },
        "sourceType": "module"
    },
    "rules":{
        "no-console": OFF,
        "jsx-quotes": WARN,
        "no-unused-vars": WARN,
        "no-undef": WARN

    },
    "globals": {
        "$": true
    },

    "extends": ["eslint:recommended"]
};
