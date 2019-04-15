"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const environment_config_1 = require("./../../config/environment.config");
/**
 * Main controller contains properties/methods
 * @abstract
 */
class BaseController {
    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     * @constructor
     */
    constructor() { this.connection = typeorm_1.getConnection(environment_config_1.typeorm.name); }
}
exports.BaseController = BaseController;
;
