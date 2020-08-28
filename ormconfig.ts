/**
 * Environement file is now dynamic to the API , no need to a CLI to update it anymore
 */

import EnvironmentConfiguration from "./src/config/environment.config";
import { container } from "tsyringe";
import TypeORMService from "./src/api/services/typeorm.service";

const env = EnvironmentConfiguration.guessCurrentEnvironment();

EnvironmentConfiguration.loadEnvironment(env);

module.exports = container.resolve(TypeORMService).ConfigurationObject;
