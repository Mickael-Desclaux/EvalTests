const path = require("path");

const esmDeps = [
    "msw",
    "@mswjs",
    "@open-draft",
    "@bundled-es-modules",
    "rettime",
    "until-async",
    "headers-polyfill",
    "strict-event-emitter",
    "outvariant",
    "is-node-process",
    "graphql",
    "tough-cookie",
    "cookie",
    "statuses",
    "path-to-regexp",
    "type-fest",
];

module.exports = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/**/*.test.js"],
    // Transform inline (pas de babel.config global) pour ne pas impacter le build Vite.
    transform: {
        "^.+\\.(js|jsx|mjs)$": [
            "babel-jest",
            {
                presets: [
                    ["@babel/preset-env", { targets: { node: "current" } }],
                ],
                // Babel n'interprète pas <rootDir> : chemin absolu vers le plugin local.
                plugins: [
                    path.resolve(
                        __dirname,
                        "jest/babel-transform-import-meta.cjs",
                    ),
                ],
            },
        ],
    },
    transformIgnorePatterns: [`/node_modules/(?!(${esmDeps.join("|")})/)`],
};
