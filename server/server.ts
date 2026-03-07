import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Token Cache
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Configs derived from environment variables
const config = {
    host: process.env.TDS_HOST,
    repo: process.env.TDS_REPO,
    version: process.env.TDS_VERSION,
    tokenEndpoint: process.env.TDS_TOKEN_ENDPOINT,
    types: {
        runs: 'ExecutionRuns',
        testCases: 'TestCases',
        processes: 'RunProcesses',
        subProcesses: 'RunSubProcesses',
        validations: 'RunValidations'
    }
};

const BASE_URL = `${config.host}/TestDataService/v${config.version}/repositories/${config.repo}/types`;

/**
 * Fetch token logic from TDS authorization endpoint
 */
async function fetchToken(): Promise<string> {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const url = `${config.host}${config.tokenEndpoint}`;
    const credentials = Buffer.from(`${process.env.TDS_CLIENT_ID}:${process.env.TDS_CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post(url, new URLSearchParams({
            'grant_type': 'client_credentials'
        }).toString(), {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        accessToken = response.data.access_token;

        try {
            // Decode JWT to find exact expiration
            if (accessToken) {
                const base64Url = accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
                const jwtData = JSON.parse(jsonPayload);

                if (jwtData.exp) {
                    tokenExpiry = (jwtData.exp - 60) * 1000;
                } else {
                    tokenExpiry = Date.now() + (3600 - 60) * 1000;
                }
            }
        } catch (e) {
            console.warn("Could not decode JWT to find expiration, falling back to 1 hour cache");
            tokenExpiry = Date.now() + (3600 - 60) * 1000;
        }

        return accessToken as string;
    } catch (error: any) {
        console.error('Error fetching token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to obtain access token');
    }
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

/**
 * Endpoint for frontend to fetch the non-sensitive configuration
 */
app.get('/api/config', (req: Request, res: Response) => {
    res.json(config);
});

/**
 * Aggregated endpoint to fetch all 5 data feeds concurrently
 * This proxies the request to the TDS API so the frontend doesn't need tokens.
 */
app.get('/api/execution-data', async (req: Request, res: Response): Promise<void> => {
    try {
        const token = await fetchToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        const [runs, testCases, processes, subProcesses, validations] = await Promise.all([
            axios.get(`${BASE_URL}/${config.types.runs}/items`, { headers }).catch(e => ({ data: { items: [] }, status: e.response?.status })),
            axios.get(`${BASE_URL}/${config.types.testCases}/items`, { headers }).catch(e => ({ data: { items: [] }, status: e.response?.status })),
            axios.get(`${BASE_URL}/${config.types.processes}/items`, { headers }).catch(e => ({ data: { items: [] }, status: e.response?.status })),
            axios.get(`${BASE_URL}/${config.types.subProcesses}/items`, { headers }).catch(e => ({ data: { items: [] }, status: e.response?.status })),
            axios.get(`${BASE_URL}/${config.types.validations}/items`, { headers }).catch(e => ({ data: { items: [] }, status: e.response?.status }))
        ]);

        // Check if any request failed with 401 (token expired/rejected)
        if ([runs, testCases, processes, subProcesses, validations].some(r => r.status === 401)) {
            console.warn("Token rejected (401) by TDS API. Triggering cache clear.");
            accessToken = null;
            tokenExpiry = 0;
            res.status(401).json({ error: 'Token expired, please retry' });
            return;
        }

        res.json({
            runs: runs.data.items || runs.data,
            testCases: testCases.data.items || testCases.data,
            processes: processes.data.items || processes.data,
            subProcesses: subProcesses.data.items || subProcesses.data,
            validations: validations.data.items || validations.data
        });

    } catch (error: any) {
        console.error('Error fetching execution data:', error.message);
        res.status(500).json({ error: 'Failed to fetch execution data' });
    }
});

/**
 * Reset Types endpoint to delete and re-create TDS types
 */
app.post('/api/types/reset', async (req: Request, res: Response): Promise<void> => {
    try {
        const token = await fetchToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const REQUIRED_TYPES = Object.values(config.types);

        // 1) Delete
        await Promise.all(REQUIRED_TYPES.map(async typeName => {
            try {
                await axios.delete(`${BASE_URL}/${typeName}`, { headers });
            } catch (e: any) {
                // Ignore errors for deletion (e.g. 404 if it didn't exist)
                if (e.response && e.response.status !== 404) {
                    console.error(`Failed to delete type ${typeName}: ${e.response.status}`);
                }
            }
        }));

        // 2) Create
        const createResults = await Promise.all(REQUIRED_TYPES.map(async typeName => {
            try {
                await axios.post(BASE_URL, { name: typeName }, { headers });
                return { typeName, ok: true };
            } catch (e: any) {
                console.error(`Failed to create type ${typeName}:`, e.message);
                return { typeName, ok: false };
            }
        }));

        const createFailed = createResults.filter(r => !r.ok);
        if (createFailed.length) {
            res.status(500).json({ error: `Create failed for: ${createFailed.map(r => r.typeName).join(', ')}` });
            return;
        }

        res.json({ success: true, message: `${REQUIRED_TYPES.length} type(s) recreated` });

    } catch (error: any) {
        console.error('Error during types reset:', error.message);
        res.status(500).json({ error: 'Failed to reset types' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
