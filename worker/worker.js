addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // Modify the request URL
    const url = new URL(request.url);
    url.protocol = 'https:';

    // Check the request hostname and set the corresponding backend host and port
    if (url.hostname === 'api.btiplatform.com') {
        url.hostname = 'btiplatform.com';
        url.port = '__TWITTER_SERVER_HTTP_PORT__';
    } else if (url.hostname === 'api-dev.btiplatform.com') {
        url.hostname = 'btiplatform.com';
        url.port = '__TWITTER_SERVER_HTTP_PORT2__';
    } else if (url.hostname === 'ganache.btiplatform.com') {
        url.hostname = 'btiplatform.com';
        url.port = '__GANACHE_HTTP_PORT__';
    }

    // Fetch the data from the modified URL
    const response = await fetch(url.toString(), request);

    // Create a new response with CORS headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", request.headers.get("Origin")); // Adjust as needed for security
    newHeaders.set("Access-Control-Allow-Methods", "GET, POST");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    newHeaders.set("Access-Control-Allow-Credentials", "true"); // Allow sending session cookie

    // Return the response with the new headers
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}