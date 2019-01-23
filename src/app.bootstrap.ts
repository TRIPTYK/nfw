import { logger as Logger } from "./config/logger.config";
import { port, env, typeorm } from "./config/environment.config";
import { TypeORMConfiguration } from "./config/typeorm.config";

/** Connection to Database server before app configuration */
TypeORMConfiguration.connect().then( (connection) => {
  Logger.info(`Connection to ${typeorm.type} server established on port ${typeorm.port} (${env})`);
});

import { app as App } from "./config/app.config";

/** Listen to requests */
App.listen( port, () => Logger.info(`HTTP server is now running on port ${port} (${env})`));

/** Exports Express */
export { App };