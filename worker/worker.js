addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // Modify the request URL
    const url = new URL(request.url);
    url.protocol = 'http:';
    url.hostname = 'host.btiplatform.com';
    url.port = '8080';

    // Fetch the data from the modified URL
    const response = await fetch(url.toString(), request);

    // Create a new response with CORS headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*"); // Adjust as needed for security
    newHeaders.set("Access-Control-Allow-Methods", "GET, POST");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Return the response with the new headers
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}