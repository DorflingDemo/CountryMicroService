import express, { Request, Response, Application } from 'express';

// Create Express application
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Define the /countries route
app.get('/countries', (req: Request, res: Response) => {
    // Set content type to application/json
    res.setHeader('Content-Type', 'application/json');
    // Send a 200 OK status with an empty JSON array
    res.status(200).json([]);
});

// Start the server only if this script is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for potential testing or extension later
export default app;
