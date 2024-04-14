const backendUrl = 'https://oauth.btiplatform.com';

window.addEventListener('message', function(event) {
    // Process the message data
    if (event.data.type === 'redirected' && event.data.status) {
        console.log('Received redirected status: ', event.data.status);
        //sessionStorage.setItem('sessionId', event.data.sessionId);
        checkAuthStatus();
    }
});

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
        window.open(authUrl, 'TwitterLogin', `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes`);
    });
    
    ['retweet', 'like', 'bookmark', 'follow-us'].forEach(action => {
        document.getElementById(action).addEventListener('click', () => {
            handleAction(action);
        });
    });
});

// Check the authentication status when the page loads
async function checkAuthStatus() {
    console.log('Checking authentication status...');
    try {
        // Fetch authentication status from a secure backend endpoint
        const response = await fetch(`${backendUrl}/check-auth-status`, {
            method: 'GET',
            credentials: 'include' // Ensures cookies or auth headers are sent with the request
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch authentication status. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received authentication status:', data);

        if (data.isAuthenticated) {
            // Remove the disabled class from the action buttons
            document.getElementById('retweet-section').classList.remove('disabled');
            document.getElementById('bookmark-section').classList.remove('disabled');
            document.getElementById('like-section').classList.remove('disabled');
            document.getElementById('follow-section').classList.remove('disabled');
            console.log('View unlocked successfully.');

            // Hide the `twitterAuth` container
            document.getElementById('twitterAuth').style.display = 'none';
        } else {
            console.error('Authentication failed or was not completed.');
            displayInfo('authentication', 'Please authorize the app first.', 'error');
        }
    } catch (error) {
        console.error('Failed to check authentication status:', error);
        displayInfo('authentication', 'Error checking authentication status.', 'error');
    }
}

function displayInfo(action, message, type) {
    let elementId;

    if (action === 'authentication') {
        elementId = 'twitterAuthMessage';
    } else if (action === 'retweet') {
        elementId = 'repostMessage';
    } else if (action === 'like') {
        elementId = 'likeMessage';
    } else if (action === 'bookmark') {
        elementId = 'bookmarkMessage';
    } else if (action === 'follow-us') {
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

async function handleAction(action) {
    let identifierKey, identifierValue;
    try {
        // Fetch the tweetId from the configuration file
        const configResponse = await fetch('../contract-config.json');
        if (!configResponse.ok) {
            throw new Error(`Failed to load configuration file. Status: ${configResponse.status}`);
        }
        const jsonConfig = await configResponse.json();
        // Determine which identifier to use based on the action
        if (action === 'follow-us') {
            identifierKey = 'userName';
            identifierValue = jsonConfig.userName; // Assuming userName is also stored in the config
            if (!identifierValue) {
                throw new Error("Required configuration value 'userName' is missing.");
            }
        } else {
            identifierKey = 'tweetId';
            identifierValue = jsonConfig.tweetId;
            if (!identifierValue) {
                throw new Error("Required configuration value 'tweetId' is missing.");
            }
        }

        // If tweetId is fetched successfully, perform the action
        const actionResponse = await fetch(`${backendUrl}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensure cookies are included with the request
            body: JSON.stringify({ [identifierKey]: identifierValue })
        });

        if (!actionResponse.ok) {
            throw new Error(`Failed to execute ${action}. Status: ${actionResponse.status}`);
        }

        const data = await actionResponse.json();
        if (data.error) {
            throw new Error(data.message);
        }

        console.log(`${action} action response:`, data);
        displayInfo(action, data.message, 'info');

        // Set the corresponding class to be disabled after success
        switch (action) {
            case 'retweet':
                document.getElementById('retweet-section').classList.add('disabled');
                break;
            case 'like':
                document.getElementById('like-section').classList.add('disabled');
                break;
            case 'bookmark':
                document.getElementById('bookmark-section').classList.add('disabled');
                break;
            case 'follow-us':
                document.getElementById('follow-section').classList.add('disabled');
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(`Error performing ${action}:`, error);
        displayInfo(action, `Action error: ${error.message}`, 'error');
    }
}