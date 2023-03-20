import { Application } from './application.js';

const app = new Application();

await app.setup();
await app.listen();

export default app;
