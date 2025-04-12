// This configuration tells Cucumber where to find the compiled JavaScript step definitions
module.exports = {
  // requireModule: ['ts-node/register'], // Removed: No longer needed as we compile first
  require: ['dist/features/step_definitions/**/*.js'], // Look for compiled JS step definitions in dist
  format: ['progress', 'json:reports/cucumber-report.json'], // Use 'progress' formatter for non-TTY CI environments
};
