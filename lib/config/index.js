let config;

if (process.env.NODE_ENV === 'production') {
    config = require('./prod_config');
} else if (process.env.NODE_ENV === 'test') {
	config = require('./test_config');
} else {
    config = require('./dev_config');
}

export default config;