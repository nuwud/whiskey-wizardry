module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
        node: true, // Allows process.env
    },
    extends: ["react-app", "eslint:recommended", "plugin:react/recommended"],
    rules: {
        "no-undef": "off", // Disable no-undef for process.env
        "react/react-in-jsx-scope": "off",
    },
};
