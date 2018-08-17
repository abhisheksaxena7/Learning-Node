module.exports = {
    "extends": "airbnb-base",
    "env": {
        "es6": true,
        "node": true,
        "jest": true
    },
    rules: {
        "no-console": 0,
        "indent": ["error", 2],
        "padded-blocks": ["error", {
            "classes": "always"
        }],
        "no-plusplus": ["error", {
            "allowForLoopAfterthoughts": true
        }]
    }
};
