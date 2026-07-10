module.exports = {
    projects: [
        {
            displayName: "unit",
            testEnvironment: "node",
            testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
        },
        {
            displayName: "integration",
            testEnvironment: "node",
            setupFiles: ["<rootDir>/tests/loadEnv.js"],
            globalSetup: "<rootDir>/tests/integration/setup.js",
            testMatch: ["<rootDir>/tests/integration/**/*.test.js"],
        },
    ],
};
