"use strict";
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var environment_config_1 = require("./../../config/environment.config");
/**
 * Main controller contains properties/methods
 */
var BaseController = /** @class */ (function () {
    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     */
    function BaseController() {
        this.connection = typeorm_1.getConnection(environment_config_1.typeorm.name);
    }
    return BaseController;
}());
exports.BaseController = BaseController;
;
