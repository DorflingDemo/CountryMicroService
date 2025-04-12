// This configuration tells Cucumber where to find step definitions and how to run them with ts-node
module.exports = {
  default: {
    requireModule: ['ts-node/register'], // Use ts-node to run TypeScript files
    require: ['features/step_definitions/**/*.ts'], // Look for step definitions here
    format: ['progress-bar', 'json:reports/cucumber-report.json'], // Output formats
    // publishQuiet: true, // Removed as it's deprecated and no longer needed
  }
};
