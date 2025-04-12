import express, { Request, Response, Application } from 'express';

// Create Express application
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Sample country data (replace with dynamic data source later)
const sampleCountries = [
    {
        countryName: "United States of America",
        isoAlpha2Code: "US",
        currencies: ["USD"]
    },
    {
        countryName: "Canada",
        isoAlpha2Code: "CA",
        currencies: ["CAD"]
    },
    {
        countryName: "United Kingdom",
        isoAlpha2Code: "GB",
        currencies: ["GBP"]
    },
    {
        countryName: "Germany",
        isoAlpha2Code: "DE",
        currencies: ["EUR"]
    },
    {
        countryName: "Japan",
        isoAlpha2Code: "JP",
        currencies: ["JPY"]
    }
];

// Define the /countries route
app.get('/countries', (req: Request, res: Response) => {
    // Set content type to application/json
    res.setHeader('Content-Type', 'application/json');
    // Send a 200 OK status with the sample country data
    res.status(200).json(sampleCountries);
});

// Start the server only if this script is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for potential testing or extension later
export default app;
