module.exports = function () {
    return {
        name: "transform-import-meta-env",
        visitor: {
            MetaProperty(path) {
                path.replaceWithSourceString("({ env: process.env })");
            },
        },
    };
};
