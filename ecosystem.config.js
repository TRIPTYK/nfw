// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps : [{
    name: 'NFW_API',
    script: './dist/src/app.bootstrap.js',
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      user : 'amaury',
      host : '172.16.20.193',
      ref  : 'origin/develop',
      repo : 'https://github.com/TRIPTYK/nfw.git',
      path : '/var/www/prod-nfw',
      'post-setup': 'npm run setup',
      'post-deploy' : 'npm run deploy production'
    }
  }
};
