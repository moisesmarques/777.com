module.exports = function override(config, env) {

    if (env === 'production') {        
        config.optimization.minimize = false;
        config.optimization.minimizer = [];
        config.module.rules[1].oneOf[3].loader = require.resolve('ts-loader');
        config.module.rules[1].oneOf[3].options = {};
        config.module.rules[1].oneOf[4].loader = require.resolve('ts-loader');
        config.module.rules[1].oneOf[4].options = {};
    }

    return config;
  }