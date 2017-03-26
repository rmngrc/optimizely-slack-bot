const diff = require('object-diff');

const api = require('../config/api');
const db = require('../config/db');


class Experiments {

  /**
   * Gets all experiments for a given project.
   *
   * @static
   * @param {any} projectId
   * @returns {promise}
   *
   * @memberOf Experiments
   */
  static get(projectId) {
    return api
      .get(`/projects/${projectId}/experiments`)
      .then((experiments) => experiments.data);
  }

  /**
   * Listens for changes in experiments.
   *
   * @static
   *
   * @memberOf Experiments
   */
  static listen() {
    setInterval(this.update.bind(this), global.listenInterval);
  }

  /**
   * Notifies any change to the slack channel.
   * We've got two options here:
   *
   *  - New experiment has been created.
   *  - Existing experiment has been modified.
   *
   * @static
   * @param {any} experiment
   * @param {any} project
   *
   * @memberOf Experiments
   */
  static notify(experiment, project) {
    db.experiments.findOne({ id: experiment.id }, (err, doc) => {

      // New experiment.
      if (!doc) {
        db.experiments.insert(experiment);
        notify(`:microscope: New experiment *${experiment.description}* has been added to ${project.project_name}.`);
      }

      // The experiment has been modified.
      else {
        const changes = this.findChanges(experiment, doc);
        if (changes) {
          db.experiments.update({ id: experiment.id }, experiment);
          notify(`:microscope: Experiment *${experiment.description}* from ${project.project_name} project - ${changes}.`);
        }
      }

    });
  }

  /**
   * Loops through all projects to get all their experiments
   * and notifies the slack channel if any change.
   *
   * @static
   *
   * @memberOf Experiments
   */
  static update() {
    db.projects.find({}, (err, projects) => {
      projects.map((project) => {
        this.get(project.id).then((experiments) => {
          experiments.map((experiment) => this.notify(experiment, project));
        });
      });
    });
  }

  /**
   * Keeps only the properties we want in the given experiment object.
   * Keep in mind this modifies the original object.
   *
   * @static
   * @param {any} experiment
   *
   * @memberOf Experiments
   */
  static cleanupExperiment(experiment) {
    // These are the properties on which we will track changes on.
    const keep = [
      'id',
      'status',
      'description',
      'last_modified',
      'percentage_included',
      'experiment_type',
      'edit_url',
    ];

    // Deleting all properties we are not interested in.
    Object.keys(experiment).map((k) => {
      if (keep.indexOf(k) === -1) {
        delete experiment[k];
      }
    });
  }

  /**
   * Finds what has changed for a given experiment.
   *
   * @static
   * @param {any} newExperiment
   * @param {any} oldExperiment
   * @returns
   *
   * @memberOf Experiments
   */
  static findChanges(newExperiment, oldExperiment) {
    this.cleanupExperiment(oldExperiment);
    this.cleanupExperiment(newExperiment);

    let changes = [];
    let differences = diff(oldExperiment, newExperiment);

    for (let k in differences) {
      changes.push(this.whatsChanged(k, newExperiment[k], oldExperiment[k]));
    }

    changes = changes.join(', ');
    changes = changes.substr(0, changes.lastIndexOf(','));
    return !!changes ? changes : null;
  }

  /**
   * Returns a nice string with what has changed for a given field.
   *
   * @static
   * @param {any} field
   * @param {any} newValue
   * @param {any} oldValue
   * @returns {string}
   *
   * @memberOf Experiments
   */
  static whatsChanged(field, newValue, oldValue) {
    return `${field} has changed from \`${oldValue}\` to \`${newValue}\``;
  }

}

module.exports = Experiments;
