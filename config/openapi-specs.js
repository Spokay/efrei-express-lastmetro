
const fs = require('fs');
const path = require('path');

const openApiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../openapi.json'), 'utf8'));

module.exports = openApiSpec;