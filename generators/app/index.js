'use strict';

const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const chalk = require('chalk');
const yosay = require('yosay');
const Generator = require('yeoman-generator');

// Common functions
const utils = require('../../common/utils');

// The main generator is indipendent from all
// it initiate the project creating also a configuration file
// for later submodules generation -- all the submodules requires this file
module.exports = class extends Generator {
  // Ask user for project details
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the first-rate ' + chalk.green('wordpress-plugin') + ' generator!'
    ));

    // Main project setup prompt questions
    // this details are stored into yo-rc config file
    const prompts = [
      {
        type: 'text',
        name: 'projectName',
        message: 'What slug do you want to use for this project?',
        default: _.kebabCase(this.appname),
        validate: utils.validateSlug
      },
      {
        name: 'projectTitle',
        message: 'What is the full name for this project?',
        default: function (answers) {
          return _.startCase(_.toLower(answers.projectName));
        },
        validate: utils.validateRequired
      },
      {
        type: 'text',
        name: 'projectDescription',
        message: 'What is the project description?',
        default: function (answers) {
          return 'This is the ' + answers.projectTitle + ' description.';
        }
      },
      {
        type: 'text',
        name: 'projectManager',
        message: 'Do you want to use grunt or gulp as your build system?',
        default: 'grunt',
        validate: utils.validateProjectManager
      },
      {
        type: 'text',
        name: 'projectVersion',
        message: 'The version to initialize this project.',
        default: '0.0.1',
        validate: utils.validateVresion
      },
      {
        type: 'text',
        name: 'projectAuthor',
        message: 'The name of the author for this project?',
        default: this.user.git.name() || ''
      },
      {
        type: 'text',
        name: 'projectLicense',
        message: 'What license do you want to use?',
        default: 'ISC',
        validate: utils.validateRequired
      }
    ];

    // Prompt the questions to the user
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  // Configure the project folder and context
  configuring() {
    // Create the root folder if not exists
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.projectName + '\n' +
        'I\'ll automatically create this folder.'
      );

      // Try to create the folder
      if( !mkdirp.sync(this.props.projectName) ) {
        // Exit with error since project root can't be created
      }

      // Change the project root to newly created directory
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }

    // Build project prefixes/namespaces
    this.props.className = _.upperFirst(_.camelCase(this.props.projectName));
    this.props.definePrefix = this.props.className.toUpperCase();
  }

  // Save the project details into configuration file
  savings() {
    // Store the main project configurations
    this.config.set(this.props);
    // Create a configuration file
    this.config.save();
  }

  // Compile and write the project files
  writing() {
    this.fs.copyTpl(
      this.templatePath('plugin/include/*'),
      this.destinationPath('include/'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('plugin/_plugin.php'),
      this.destinationPath(this.props.projectName + '.php'),
      this.props
    );
  }

  // Install project dependencies
  install() {
    this.installDependencies();
  }
};
