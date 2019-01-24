import * as Fs from "fs";
import * as HTTPS from "https";

import { logger as Logger } from "./config/logger.config";
import { port, env, https, typeorm } from "./config/environment.config";
import { TypeORMConfiguration } from "./config/typeorm.config";

/** Connection to Database server before app configuration */
TypeORMConfiguration.connect().then( (connection) => {
  Logger.info(`Connection to ${typeorm.type} server established on port ${typeorm.port} (${env})`);
});

import { app as App } from "./config/app.config";

/**
 * HTTPS configuration
 */
if(https.isActive === 1)
{
  let credentials = {  
    key: Fs.readFileSync(https.key, "utf8"),
    cert: Fs.readFileSync(https.cert, "utf8")
  };
  
  HTTPS
    .createServer(credentials, App)
    .listen(port, function() {
      Logger.info(`HTTPS server is now running on port ${port} (${env})`)
    });
}
else 
{
  App.listen( port, () => Logger.info(`HTTP server is now running on port ${port} (${env})`));
}


/** Exports Express */
export { App };