const CreateAPI = require('apisauce').create;


if (!process.env.OPTIMIZELY_TOKEN) {
  console.error('Missing `OPTIMIZELY_TOKEN` environment variable');
  process.exit(-1);
}

module.exports = CreateAPI({
  baseURL: 'https://www.optimizelyapis.com/experiment/v1',
  headers: {
    'Token': process.env.OPTIMIZELY_TOKEN,
  },
});
