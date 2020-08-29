import tsMorph = require("ts-morph");

let isInitialised = false;
const project = new tsMorph.Project({

});

/**
 * @return Project
 * @description Singleton like method
 */
export = (() => {
    if (!isInitialised) {
        project.addSourceFilesAtPaths(["src/**/*.ts","test/**/*.ts"]);
        isInitialised = true;
    }

    return project;
})();
