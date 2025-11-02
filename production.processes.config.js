const os = require('os');

module.exports = {
  name: 'mcp-server',
  script: 'dist/index.js',
  env: {
    NODE_ENV: "production",
    PORT: 8001,
  },
  log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
  max_memory_restart: `${Math.round(((os.totalmem() / (1024 * 1024)) * 3) / 4)}M`,
};