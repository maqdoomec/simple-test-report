import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// --------------------------------------------------
// TOKEN CACHE
// --------------------------------------------------

let accessToken: string | null = null;
let tokenExpiry: number = 0;

// --------------------------------------------------
// CONFIG
// --------------------------------------------------

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

const BASE_URL =
    `${config.host}/TestDataService/v${config.version}/repositories/${config.repo}/types`;

const PAGE_SIZE = 500;


// --------------------------------------------------
// FETCH TOKEN
// --------------------------------------------------

async function fetchToken(): Promise<string> {

    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const url = `${config.host}${config.tokenEndpoint}`;

    const credentials = Buffer
        .from(`${process.env.TDS_CLIENT_ID}:${process.env.TDS_CLIENT_SECRET}`)
        .toString("base64");

    const response = await axios.post(
        url,
        new URLSearchParams({
            grant_type: "client_credentials"
        }).toString(),
        {
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    accessToken = response.data.access_token;

    if (!accessToken) {
        throw new Error("Token not returned from TDS");
    }

    try {

        const base64Url = accessToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        const jwtData = JSON.parse(jsonPayload);

        tokenExpiry = (jwtData.exp - 60) * 1000;

    } catch {

        tokenExpiry = Date.now() + (3600 - 60) * 1000;

    }

    return accessToken as string;

}


// --------------------------------------------------
// GET ITEMS WITH FILTER + PAGINATION
// --------------------------------------------------

async function getItems(typeName: string, runId: string) {

    const token = await fetchToken();

    let allItems: any[] = [];
    let offset = 0;

    const filter = `{'run_id':'${runId}'}`;

    while (true) {

        const url =
            `${BASE_URL}/${typeName}/items?filter=${encodeURIComponent(filter)}&limit=${PAGE_SIZE}&offset=${offset}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        });

        const items = response.data.items || [];

        allItems.push(...items);

        if (items.length < PAGE_SIZE) break;

        offset += PAGE_SIZE;

    }

    return allItems;

}


// --------------------------------------------------
// DELETE ITEM
// --------------------------------------------------

async function deleteItem(typeName: string, itemId: string) {

    const token = await fetchToken();

    await axios.delete(
        `${BASE_URL}/${typeName}/items/${itemId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

}


// --------------------------------------------------
// DELETE ITEMS FOR TYPE
// --------------------------------------------------

async function deleteTypeItems(typeName: string, runId: string) {

    console.log(`\nProcessing ${typeName}`);

    const items = await getItems(typeName, runId);

    console.log(`Found ${items.length} items`);

    for (const item of items) {

        await deleteItem(typeName, item.id);

        console.log(`Deleted ${typeName} → ${item.id}`);

    }

}


// --------------------------------------------------
// MAIN CLEANUP
// --------------------------------------------------

async function deleteRunData(runId: string) {

    console.log(`\nStarting cleanup for run: ${runId}`);

    const types = Object.values(config.types);

    for (const type of types) {

        await deleteTypeItems(type, runId);

    }

    console.log(`\nCleanup completed for run: ${runId}`);

}


// --------------------------------------------------
// RUN SCRIPT
// --------------------------------------------------

const runId = process.argv[2];

if (!runId) {

    console.log("Usage: ts-node cleanup.ts RUN-ID");
    process.exit(1);

}

deleteRunData(runId);