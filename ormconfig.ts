/**
 * Environement file is now dynamic to the API , no need to a CLI to update it anymore
 */
import "reflect-metadata";
import { container } from "tsyringe";
import TypeORMService from "./src/core/services/typeorm.service";

process.env.CLI = "true";

const configObject = container.resolve(TypeORMService).ConfigurationObject;

module.exports = configObject;
