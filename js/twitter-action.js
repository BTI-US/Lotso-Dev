const backendUrl = 'https://oauth.btiplatform.com';

document.addEventListener('DOMContentLoaded', function () {
    console.log('Twitter action script loaded');
    document.getElementById('start-auth').addEventListener('click', function() {
        const callbackUrl = encodeURIComponent('https://lotso.org/twitter-callback');
        const authUrl = `${backendUrl}/start-auth?callback=${callbackUrl}`;
        // Open a new tab with the OAuth URL
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = 500;
        const windowHeight = 600;
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;
        const authWindow = window.open(authUrl, 'TwitterLogin', `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes`);
        // Polling to check if the auth was successful
        const pollTimer = window.setInterval(function() {
            try {
                if (authWindow.closed) {
                    window.clearInterval(pollTimer);
                    checkAuthStatus();
                }
            } catch (e) {
                // Error handling
                console.log('Error:', e);
            }
        }, 500); // Check every 500 milliseconds
    });
    
    document.getElementById('retweet').addEventListener('click', function() {
        handleAction('retweet');
    });
    document.getElementById('like').addEventListener('click', function() {
        handleAction('like');
    });
    document.getElementById('bookmark').addEventListener('click', function() {
        handleAction('bookmark');
    });
    document.getElementById('follow-us').addEventListener('click', function() {
        handleAction('follow');
    });
});

// TODO: Need to be tested
function checkAuthStatus() {
    // Check URL parameters in current window (assuming user is redirected here with parameters)
    // FIXME: Display the params
    console.log('URL params:', window.location.search);
    const params = new URLSearchParams(window.location.search);
    const isAuthenticated = params.get('status') === 'success';

    if (isAuthenticated) {
        document.querySelectorAll('.price-table.disabled').forEach(element => {
            element.classList.remove('disabled');
        });
        console.log('View unlocked successfully.');
        // Hide the `twitterAuth` container
        document.getElementById('twitterAuth').style.display = 'none';
    } else {
        console.error('Authentication failed or was cancelled by the user.');
    }
}

function displayInfo(action, message, type) {
    let elementId;

    if (action === 'retweet') {
        elementId = 'repostMessage';
    } else if (action === 'like') {
        elementId = 'likeMessage';
    } else if (action === 'bookmark') {
        elementId = 'bookmarkMessage';
    } else if (action === 'follow') {
        elementId = 'followMessage';
    }

    // Set the message to the appropriate element and add relevant class
    if (elementId) {
        const element = document.getElementById(elementId);
        element.innerText = message;

        // Clear any existing message classes before adding new ones
        element.classList.remove('success-message', 'error-message');

        // Add the appropriate class based on the message type
        if (type === 'info') {
            element.classList.add('success-message'); // Assuming info messages are success messages
        } else if (type === 'error') {
            element.classList.add('error-message');
        }

        // Clear the message after 5 seconds
        setTimeout(() => {
            element.innerText = '';
            element.classList.remove('success-message', 'error-message'); // Remove class when clearing message
        }, 5000);
    }
}

function handleAction(action) {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const accessTokenSecret = urlParams.get('accessTokenSecret');

    // Simplify by integrating checkIfAuthorized directly here
    if (accessToken && accessTokenSecret) {
        console.log(`Performing ${action} with tokens`, accessToken, accessTokenSecret);
        performAction(action, accessToken, accessTokenSecret);
    } else {
        console.error(`No access tokens available for ${action}`);
        displayInfo(action, 'Please authorize the app first.', 'error');
    }
}

async function performAction(action, accessToken, accessTokenSecret) {
    try {
        // Fetch the tweetId from the configuration file
        const response = await fetch('../contract-config.json');
        if (!response.ok) {
            throw new Error("Failed to load configuration file.");
        }
        const jsonConfig = await response.json();
        const tweetId = jsonConfig.tweetId;

        if (!tweetId) {
            throw new Error("Required configuration value (tweetId) is missing.");
        }

        // If tweetId is fetched successfully, perform the action
        const actionResponse = await fetch(`${backendUrl}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessToken: accessToken,
                accessTokenSecret: accessTokenSecret,
                tweetId: tweetId
            })
        });

        const data = await actionResponse.json();
        console.log(`${action} action response:`, data);
        displayInfo(action, data.message, 'info');
    } catch (error) {
        console.error('Error performing action:', error);
        displayInfo(action, error.message, 'error');
    }
}