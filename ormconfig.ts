/**
 * Environement file is now dynamic to the API , no need to a CLI to update it anymore
 */

import EnvironmentConfiguration from "./src/config/environment.config";
import { TypeORMConfiguration } from "./src/config/typeorm.config";

const env = EnvironmentConfiguration.guessCurrentEnvironment();

EnvironmentConfiguration.loadEnvironment(env);

module.exports = TypeORMConfiguration.ConfigurationObject;
