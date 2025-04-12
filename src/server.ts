import fs from 'fs';
import path from 'path';
import express, { Request, Response, Application, NextFunction } from 'express'; // Added NextFunction

// Load environment variables from .env file
import dotenv from 'dotenv';
const envLoadResult = dotenv.config(); // Store result

if (envLoadResult.error) {
  console.warn(`Warning: Server could not load .env file. API_KEY might be missing. Error: ${envLoadResult.error.message}`);
  // Consider if the server should exit if .env is critical
} else {
  console.log('Server: .env file loaded successfully.');
}

// Define Country interface (without currencies)
interface Country {
    countryName: string;
    isoAlpha2Code: string;
}

// Create Express application
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Define path to the data file - relative to the compiled JS file in 'dist/src'
const countriesDataPath = path.join(__dirname, '../../data/countries.json'); // Adjusted path: ../../

// Load and parse country data from JSON file
let allCountries: Country[] = [];
console.log(`Attempting to load country data from: ${countriesDataPath}`); // Added log
if (fs.existsSync(countriesDataPath)) { // Added check
    console.log(`File found at: ${countriesDataPath}`);
    try {
        const jsonData = fs.readFileSync(countriesDataPath, 'utf-8');
        allCountries = JSON.parse(jsonData);
        console.log(`Successfully loaded ${allCountries.length} countries.`);
    } catch (error) {
        console.error(`Error parsing JSON data from ${countriesDataPath}:`, error);
        // Decide how to handle parsing errors - exit or continue with empty data?
    }
} else {
    console.error(`Error: Data file not found at ${countriesDataPath}`);
    // In a real app, you might want to exit or have better error handling
    // For now, log the error and continue with an empty array.
}

// --- Authentication Middleware ---
const authenticateAPIKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = process.env.API_KEY;
    const providedKey = req.headers['x-api-key']; // Check for key in X-API-Key header

    if (!apiKey) {
        // Should not happen if .env is set up correctly, but good practice to check
        console.error('FATAL: API_KEY environment variable is not set.');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!providedKey || providedKey !== apiKey) {
        console.warn(`Unauthorized access attempt: Missing or incorrect API key. Provided: ${providedKey}`);
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    // Key is valid, proceed to the next middleware or route handler
    next();
};

// --- Routes ---

// Apply authentication middleware to the /countries route
app.get('/countries', authenticateAPIKey, (req: Request, res: Response) => {
    // Set content type to application/json
    res.setHeader('Content-Type', 'application/json');
    // Send a 200 OK status with the loaded country data
    res.status(200).json(allCountries);
});

// Start the server only if this script is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for potential testing or extension later
export default app;
