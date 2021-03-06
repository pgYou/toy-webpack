const Compiler = require('./compiler');
const path = require('path');
class ToyWebpack {
  constructor(options) {
    this.options = ToyWebpack.expandOptions(options);
    this.compiler = new Compiler(this.options);
  }
  run(onComplete, onError) {
    try {
      this.compiler.run();
      onComplete && onComplete();
    } catch (err) {
      onError && onError(err);
    }
  }
  static expandOptions(options) {
    const cwd = process.cwd();
    const entry = path.join(cwd, options.entry || './index.js');

    const newOptions = {
      ...options,
      output: {
        filename: options.output.filename || 'main.js',
        path: path.join(cwd, options.output.path || './dist'),
      },
      entry,
    };
    if (options.module?.rules) {
      const rules =
        options.module?.rules.map((rule) => {
          rule.use = path.join(cwd, rule.use);
          return rule;
        }) || [];
      console.log(rules);
      newOptions.module.rules = rules;
    }
    return newOptions;
  }
}

module.exports = ToyWebpack;
