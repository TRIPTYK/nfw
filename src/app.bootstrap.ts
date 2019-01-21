import * as Logger from "./config/logger.config";
import { port, env } from "./config/environment.config";
import * as App from "./config/app.config";

/** Listen to requests */
App.listen( port, () => Logger.info(`HTTP server is now running on port ${port} (${env})`));

/**
 * Exports Express
 */
module.exports = App;