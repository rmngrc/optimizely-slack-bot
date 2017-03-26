const api = require('../config/api');
const db = require('../config/db');


class Projects {

  /**
   * Gets all projects from the API.
   *
   * @static
   * @returns
   *
   * @memberOf Projects
   */
  static get() {
    return api
      .get('/projects')
      .then((projects) => projects.data);
  }

  /**
   * Listens for project updates.
   *
   * @static
   *
   * @memberOf Projects
   */
  static listen() {
    setInterval(this.update.bind(this), global.listenInterval);
  }

  /**
   * Notifies to the slack channel if the project not found in DB.
   *
   * @static
   * @param {any} project
   *
   * @memberOf Projects
   */
  static notifyIfNewProject(project) {
    db.projects.findOne({ id: project.id }, (err, doc) => {
      if (!doc) {
        db.projects.insert(project);
        notify(`:bar_chart: New project *${project.project_name}* has been added.`);
      }
    });
  }

  /**
   * Updates the slack channel with changes in the projects.
   *
   * @static
   *
   * @memberOf Projects
   */
  static update() {
    this.get().then((projects) => {
      projects.map(this.notifyIfNewProject);
    });
  }

}

module.exports = Projects;
