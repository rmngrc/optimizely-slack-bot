const Experiments = require('./experiments');
const Projects = require('./projects');


class OptimizelyBot {

  static run() {
    Experiments.listen();
    Projects.listen();
  }

}

module.exports = OptimizelyBot;
