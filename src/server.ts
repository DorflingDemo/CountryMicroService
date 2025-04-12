import fs from 'fs';
import path from 'path';
import express, { Request, Response, Application } from 'express';

// Define Country interface (without currencies)
interface Country {
    countryName: string;
    isoAlpha2Code: string;
}

// Create Express application
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Define path to the data file - relative to the compiled JS file in 'dist'
const countriesDataPath = path.join(__dirname, '../data/countries.json');

// Load and parse country data from JSON file
let allCountries: Country[] = [];
try {
    const jsonData = fs.readFileSync(countriesDataPath, 'utf-8');
    allCountries = JSON.parse(jsonData);
    console.log(`Successfully loaded ${allCountries.length} countries from ${countriesDataPath}`);
} catch (error) {
    console.error(`Error loading country data from ${countriesDataPath}:`, error);
    // In a real app, you might want to exit or have better error handling
    // For now, log the error and continue with an empty array.
}

// Define the /countries route
app.get('/countries', (req: Request, res: Response) => {
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
