'use strict';

const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const WPGenerator = require('../../common/generator.js');

module.exports = class extends WPGenerator {

  constructor(args, opts) {
    super(args, opts);
  }

  // Try to get parent project config or exit
  initializing() {
    this.defaults();
  }

  prompting() {
    const prompts = [{
      type: 'input',
      name: 'description',
      message: 'How you would describe this widget?',
      default: ['The', _.startCase(this.options.name), 'widget description.'].join(' ')
    }];

    return this.prompt(prompts).then(props => {
      this.props = _.merge(this.props, props);
    });
  }

  configuring() {
    // The subgenerator name
    this.name = path.basename(__dirname);

    // Sub generator properties overrides
    this.props.id = _.snakeCase(this.options.name);
    this.props.title = _.startCase(this.options.name);
    this.props.childClassName = _.upperFirst(_.camelCase(this.options.name));
  }

  // Call the parent writing method
  writing() {
    super.writing()
  }

  // Used internally to dinamic update the main class
  conflicts() {

    try {

      const ast = this.getMainClassFile();
      const classObject = ast.findClass(this.props.className);

      // Exit if the class object does not exist
      if (!classObject) {
        throw new Error(`The ${this.props.className} class does not exist.`);
      }

      // Get the widgets array
      const widgets = classObject.getProperty('widgets');

      // Exit if the widget property does not exist
      if (!widgets) {
        throw new Error('The $widgets array property was not found.');
      }

      const childClass = `${this.props.childClassName}_Widget`;

      const index = widgets.ast.value.items.findIndex(e => {
        return e.key.value === childClass;
      });

      // Exit if entry is already in
      if( index > -1 ) {
        this.log(chalk.cyan('identical'), `class name ${childClass} inside widgets array.`)
        return;
      }

      // Add the new widget to the array
      widgets.ast.value.items.push({
        kind: 'entry',
        key: {
          kind: 'string',
          value: `${this.props.childClassName}_Widget`,
          isDoubleQuote: false
        },
        value: {
          kind: 'string',
          value: `/widget/class-${_.kebabCase(this.options.name)}.php`,
          isDoubleQuote: false
        }
      });

      // Write the file back
      this.setMainClassFile(ast.toString());

    } catch (err) {
      this.log(chalk.bold.red(err.toString()));
      super.warningMessage();
    }

  }

  end() {
    super.end();
  }

};
