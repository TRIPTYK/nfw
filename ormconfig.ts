/**
 * Environement file is now dynamic to the API , no need to a CLI to update it anymore
 */
import { TypeORMService } from "@triptyk/nfw-core";
import "reflect-metadata";
import { container } from "tsyringe";

process.env.CLI = "true";

const configObject = container.resolve(TypeORMService).ConfigurationObject;

module.exports = configObject;
