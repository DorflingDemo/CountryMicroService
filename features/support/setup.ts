import dotenv from 'dotenv';

// Load environment variables from .env file before any features or steps are loaded
const result = dotenv.config();

if (result.error) {
  console.warn('Warning: Could not load .env file. API_KEY might be missing.', result.error.message);
  // Depending on your setup, you might want to throw an error here
  // if the .env file is critical for tests to run.
  // For now, we just warn, assuming API_KEY might be set globally in CI.
} else {
  console.log('.env file loaded successfully.');
}
