const port = 8001;

export default {
  jwt: {
    secret: 'h8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROVh8566MNQ18oo5cMmHROV',
    accessExpires: 5,
    refreshExpires: 1440,
    iss: `http://localhost:${port}`,
    audience: `http://localhost:${port}`,

  },
  logger: {
    logToConsole: false,
    dir: 'dist/logs/',
  },
  baseURL: '/api/v1',
  port,
  database: {
    host: 'localhost',
    user: 'root',
    password: 'test123*',
    database: 'nfw_test',
    type: 'mysql',
    port: 3306,
    debug: false,
  },
  env: 'test',
  cors: {
    origin: 'http://localhost:4200',
  },
};
