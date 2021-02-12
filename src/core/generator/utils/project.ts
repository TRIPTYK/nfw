import tsMorph = require("ts-morph");

let isInitialised = false;
const project = new tsMorph.Project({
    tsConfigFilePath: "tsconfig.json"
});

/**
 * @return Project
 * @description Singleton like method
 */
export default (() => {
    if (!isInitialised) {
        project.addSourceFilesAtPaths(["src/**/*.ts", "test/**/*.ts"]);
        isInitialised = true;
    }

    return project;
})();
