const port = 8000;

export default {
  jwt: {
    secret: 'h8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROV',
    accessExpires: 5,
    refreshExpires: 1440,
    iss: `http://localhost:${port}`,
    audience: `http://localhost:${port}`,
  },
  logger: {
    logToConsole: true,
    dir: 'dist/logs/',
  },
  baseURL: '/api/v1',
  port,
  database: {
    host: 'localhost',
    user: 'root',
    password: 'test123*',
    database: 'nfw',
    port: 3306,
    type: 'mysql',
    debug: true,
  },
  env: 'development',
  cors: {
    origin: 'http://localhost:4200',
  },
};
