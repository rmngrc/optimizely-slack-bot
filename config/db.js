const datastore = require('nedb');
const fs = require('fs');
const path = require('path');


// Helper function.
const createDatastore = (filename) => new datastore({
  filename: path.resolve(process.cwd(), 'data', filename),
  autoload: true,
  timestampData: true,
});

// Keeping multiple databases in one single object.
const db = {
  experiments: createDatastore('experiments.db'),
  projects: createDatastore('projects.db'),
};

module.exports = db;
