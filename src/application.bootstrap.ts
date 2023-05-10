import { Application } from './application.js';
import { container } from '@triptyk/nfw-core';

const app = container.resolve(Application);

await app.setup();
await app.listen();

export default app;
