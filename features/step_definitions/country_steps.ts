import { Given, When, Then, DataTable, setDefaultTimeout } from '@cucumber/cucumber';
import axios, { AxiosResponse, AxiosError } from 'axios';
import assert from 'assert';

// Increase default timeout for potential API calls
setDefaultTimeout(10 * 1000);

// Define the interface for the expected country data structure (matching server.ts)
interface Country {
    countryName: string;
    isoAlpha2Code: string;
}

// Define the base URL for the API. Replace with environment variable or configuration later.
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Example placeholder

// Use 'this' context to store state between steps
interface ICustomWorld {
    response?: AxiosResponse;
    error?: AxiosError | Error | unknown; // Store potential errors
    responseData?: any; // Store parsed response data
}

// --- Step Definitions ---

Given('the Country/Currency service is running', function () { // Reverted slash escaping
    // This step is often used to ensure preconditions are met.
    // For now, we assume the service is running externally.
    // Later, this could involve health checks or setup steps.
    console.log(`Assuming service is running at ${API_BASE_URL}`);
});

When('I send a GET request to {string}', async function (this: ICustomWorld, path: string) {
    try {
        const url = `${API_BASE_URL}${path}`;
        console.log(`Sending GET request to: ${url}`);
        this.response = await axios.get(url, {
            validateStatus: () => true, // Accept all status codes, validate in 'Then' steps
        });
        // Attempt to parse JSON response data
        if (this.response.headers['content-type']?.includes('application/json')) {
            this.responseData = this.response.data;
        } else {
            this.responseData = null; // Or handle non-JSON responses differently
        }
        this.error = undefined; // Clear previous errors
        console.log(`Received status code: ${this.response.status}`);
    } catch (err) {
        console.error('Error during GET request:', err);
        this.error = err;
        this.response = undefined;
        this.responseData = undefined;
    }
});

Then('the response status code should be {int}', function (this: ICustomWorld, expectedStatusCode: number) {
    assert.ok(this.response, 'Response was not received');
    assert.strictEqual(this.response.status, expectedStatusCode, `Expected status code ${expectedStatusCode}, but got ${this.response.status}`);
});

Then('the response content type should be {string}', function (this: ICustomWorld, expectedContentType: string) {
    assert.ok(this.response, 'Response was not received');
    const actualContentType = this.response.headers['content-type'];
    assert.ok(actualContentType?.includes(expectedContentType), `Expected content type to include "${expectedContentType}", but got "${actualContentType}"`);
});

Then('the response body should be a JSON array', function (this: ICustomWorld) {
    assert.ok(this.response, 'Response was not received');
    assert.ok(this.responseData !== undefined, 'Response data is not defined');
    assert.ok(this.responseData !== null, 'Response data is null');
    assert.ok(Array.isArray(this.responseData), `Expected response body to be a JSON array, but got type ${typeof this.responseData}`);
});

Then('each item in the JSON array should have a {string} string field', function (this: ICustomWorld, fieldName: string) {
    assert.ok(Array.isArray(this.responseData), 'Response data is not an array');
    assert.ok(this.responseData.length > 0, 'Response array is empty, cannot check items'); // Ensure there's something to check

    for (const item of this.responseData) {
        assert.ok(item.hasOwnProperty(fieldName), `Item missing property "${fieldName}": ${JSON.stringify(item)}`);
        assert.strictEqual(typeof item[fieldName], 'string', `Expected field "${fieldName}" to be a string, but got ${typeof item[fieldName]} in item: ${JSON.stringify(item)}`);
    }
});

Then('each item in the JSON array should have an {string} string field matching the format {string}', function (this: ICustomWorld, fieldName: string, format: string) {
    assert.ok(Array.isArray(this.responseData), 'Response data is not an array');
    assert.ok(this.responseData.length > 0, 'Response array is empty, cannot check items');
    const regex = new RegExp(`^${format}$`); // Anchor the regex

    for (const item of this.responseData) {
        assert.ok(item.hasOwnProperty(fieldName), `Item missing property "${fieldName}": ${JSON.stringify(item)}`);
        assert.strictEqual(typeof item[fieldName], 'string', `Expected field "${fieldName}" to be a string, but got ${typeof item[fieldName]} in item: ${JSON.stringify(item)}`);
        assert.ok(regex.test(item[fieldName]), `Expected field "${fieldName}" ("${item[fieldName]}") to match format "${format}" in item: ${JSON.stringify(item)}`);
    }
});

// Replace the old step definition with this one:
Then('the response list should contain an entry with {string} {string}', function (this: ICustomWorld, key: string, value: string) {
    assert.ok(Array.isArray(this.responseData), 'Response data is not an array');

    const found = this.responseData.some((item: any) => {
        // Check if item has the key and the value matches
        return item.hasOwnProperty(key) && item[key] === value;
    });

    assert.ok(found, `Expected to find an item with ${key}="${value}", but none found.`);
});
