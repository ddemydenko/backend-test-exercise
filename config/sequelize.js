module.exports = {
  'development': {
    'username': 'postgres',
    'password': 555666,
    'database': 'postgres',
    'host': 'localhost',
    'port': 5432,
    'dialect': 'postgres',
    'logging': console.log
  },
  'development_docker': {
    'use_env_variable': 'DATABASE_URL',
    'logging': console.log
  },
  'test': {
    'username': 'postgres',
    'password': 555666,
    'database': 'postgres',
    'host': 'localhost',
    'port': 5432,
    'dialect': 'postgres',
    'logging': false
  },
  'production': {
    'use_env_variable': 'DATABASE_URL',
    'logging': false
  }
};
