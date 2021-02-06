/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint. 
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    rules: {
        "no-console": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/naming-convention": "off",
        "getter-return": "error",
        "no-promise-executor-return": "error",
        "no-template-curly-in-string": "error",
        "block-scoped-var": "error",
        curly: "warn",
        "default-case-last": "error",
        "default-case": "error",
        "dot-notation": "warn",
        eqeqeq: "error",
        "no-alert": "error",
        "no-caller": "error",
        "no-constructor-return": "error",
        "no-else-return": "error",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "warn",
        "no-floating-decimal": "warn",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "warn",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-proto": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": "error",
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-void": "error",
        "no-warning-comments": "warn",
        "vars-on-top": "error",
        "wrap-iife": "error",
        yoda: "error",
        "comma-dangle": "warn",
        "comma-spacing": "warn",
        "comma-style": "warn",
        "consistent-this": "error",
        "no-new-object": "error",
        "no-unneeded-ternary": "error",
        "prefer-object-spread": "error",
        "no-confusing-arrow": "warn",
        "no-var": "error",
        "object-shorthand": "warn",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error"
    }
};
