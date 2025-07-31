import { ApifyClient } from 'apify-client';

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_WVddNAUWdErztbcHfze2keqf6b9YqD1rbhTT',
});

// Prepare Actor input
const input = {
    "start_urls": [
        {
            "url": "https://danone.fr"
        }
    ],
    "max_depth": 1,
    "max_urls": 10,
    "search_engine": "Google"
};

(async () => {
    // Run the Actor and wait for it to finish
    const run = await client.actor("SpCYfVSDQ785Ewyhc").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    items.forEach((item) => {
        console.dir(item);
    });
})();