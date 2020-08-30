/**
 * Environement file is now dynamic to the API , no need to a CLI to update it anymore
 */
import { container } from "tsyringe";
import TypeORMService from "./src/api/services/typeorm.service";

module.exports = container.resolve(TypeORMService).ConfigurationObject;
