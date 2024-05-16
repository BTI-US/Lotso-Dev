let authWebAddress = null;
let actionsEnabled = {};

window.addEventListener('message', function(event) {
    // Process the message data
    if (event.data.type === 'redirected' && event.data.status) {
        console.log('Received redirected status: ', event.data.status);
        //sessionStorage.setItem('sessionId', event.data.sessionId);
        checkAuthStatus();
    }
});

function getFullAddress() {
    // Try to find the element with ID 'address'
    const addressElement = document.getElementById('address');
    // Check if the element exists
    if (!addressElement) {
        console.log('Element with ID "address" not found.');
        return false;
    }
    // Try to get the attribute 'data-full-address' from the element
    const fullAddress = addressElement.getAttribute('data-full-address');
    // Check if the attribute exists and is not null
    if (fullAddress === null) {
        console.log('Attribute "data-full-address" not found on the element.');
        return false;
    }
    // If the element and attribute exist, return the attribute's value
    return fullAddress;
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Twitter action script loaded');

    fetch('../contract-config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonConfig => {
            // Access properties
            authWebAddress = jsonConfig.authWebAddress;

            // Access additional properties if needed
            actionsEnabled = {
                retweet: jsonConfig.retweetEnabled,
                retweet2: jsonConfig.retweet2Enabled,
                like: jsonConfig.likeEnabled,
                follow: jsonConfig.followEnabled
            };

            // Additional validation can be performed here as needed
            if (!authWebAddress) {
                throw new Error("Required configuration values (authWebAddress) are missing.");
            }

            // Check if any action is not enabled
            const isAnyActionDisabled = Object.entries(actionsEnabled).some(isEnabled => !isEnabled);

            if (isAnyActionDisabled) {
                throw new Error("Required configuration values (retweetEnabled or retweet2Enabled or likeEnabled or followEnabled) are missing.");
            }

            // Check if the user connect the wallet
            document.getElementById('start-auth').addEventListener('click', function() {
                if (!getFullAddress()) {
                    console.error('You need to connect your wallet first.');
                    displayInfo('authentication', 'You need to connect your wallet first.', 'error');
                    return;
                }

                const callbackUrl = encodeURIComponent('https://lotso.org/twitter-callback');
                const authUrl = `${authWebAddress}/start-auth?callback=${callbackUrl}`;
                // Open a new tab with the OAuth URL
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const windowWidth = 500;
                const windowHeight = 600;
                const left = (screenWidth - windowWidth) / 2;
                const top = (screenHeight - windowHeight) / 2;
                window.open(authUrl, 'TwitterLogin', `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes`);
            });
            
            ['retweet', 'like', 'retweet-2', 'follow-us'].forEach(action => {
                document.getElementById(action).addEventListener('click', () => {
                    handleAction(action);
                });
            });
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        });
});

// Check the authentication status when the page loads
async function checkAuthStatus() {
    console.log('Checking authentication status...');
    try {
        // Fetch authentication status from a secure backend endpoint
        const response = await fetch(`${authWebAddress}/check-auth-status`, {
            method: 'GET',
            credentials: 'include' // Ensures cookies or auth headers are sent with the request
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch authentication status. Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Received authentication status:', result);

        if (result.data.isAuthenticated) {
            // Map of enabled flags to their corresponding element IDs
            const actionElementMap = {
                retweet: 'retweet-section',
                retweet2: 'retweet-section-2',
                like: 'like-section',
                follow: 'follow-section'
            };
            // Remove the disabled class from the action buttons
            Object.entries(actionsEnabled).forEach(([action, isEnabled]) => {
                if (isEnabled === "true") {
                    document.getElementById(actionElementMap[action]).classList.remove('disabled');
                }
            });
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
    // Map the action to the corresponding element ID
    const actionElementMap = {
        'authentication': 'twitterAuthMessage',
        'retweet': 'repostMessage',
        'like': 'likeMessage',
        'retweet-2': 'repostMessage2',
        'follow-us': 'followMessage'
    };

    let elementId = actionElementMap[action];

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
    try {
        const actionConfig = {
            'follow-us': { configKey: 'userName', actionType: 'follow-us', info: 'follow-info', progress: 'follow-progress', section: 'follow-section' },
            'retweet-2': { configKey: 'tweetId2', actionType: 'retweet', info: 'retweet-2-info', progress: 'retweet-2-progress', section: 'retweet-section-2' },
            'retweet': { configKey: 'tweetId', actionType: 'retweet', info: 'retweet-info', progress: 'retweet-progress', section: 'retweet-section' },
            'like': { configKey: 'tweetId', actionType: 'like', info: 'like-info', progress: 'like-progress', section: 'like-section' },
        };

        // Fetch the tweetId from the configuration file
        const configResponse = await fetch('../contract-config.json');
        if (!configResponse.ok) {
            throw new Error(`Failed to load configuration file. Status: ${configResponse.status}`);
        }
        const jsonConfig = await configResponse.json();

        const configKey = actionConfig[action].configKey;
        const configValue = jsonConfig[configKey];
        if (!configValue) {
            throw new Error(`Required configuration value '${configKey}' is missing.`);
        }
        const queryParams = `${configKey}=${encodeURIComponent(configValue)}`;
        const actionType = actionConfig[action].actionType;

        const actionResponse = await fetch(`${authWebAddress}/${actionType}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensure cookies are included with the request
        });

        if (!actionResponse.ok) {
            const responseBody = await actionResponse.json();
            const responseData = JSON.parse(responseBody.data);
            const errorMessage = responseData.errors[0].message;
            throw new Error(`Failed to execute ${action}. Status: ${actionResponse.status}. Error: ${errorMessage}`);
        }

        const response = await actionResponse.json();

        console.log(`${action} action response:`, response);

        const infoElementId = actionConfig[action].info;
        const progressElementId = actionConfig[action].progress;
        const sectionElementId = actionConfig[action].section;

        if (response.error && (response.code == 10017 || response.code == 10018)) {
            console.log(`You have already ${actionType} this tweet.`);
            displayInfo(action, `You have already ${actionType} this tweet.`, 'error');
        } else if (!response.error && response.code == 0) {
            console.log(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful.`);
            displayInfo(action, `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful.`, 'info');
        } else {
            throw new Error(`Error ${actionType} the tweet:`, response.error);
        }

        hideElement(infoElementId);
        animateProgress(progressElementId);
        setTimeout(() => {
            document.getElementById(sectionElementId).classList.add('disabled');
        }, 2000);

        setTimeout(() => {
            checkAllActionsDisabled();
        }, 3000);
    } catch (error) {
        console.error(`Error performing ${action}:`, error);
        displayInfo(action, `Error: ${error.message}`, 'error');
    }
}

function checkAllActionsDisabled() {
    const actionElementMap = {
        retweet: 'retweet-section',
        like: 'like-section',
        retweet2: 'retweet-section-2',
        follow: 'follow-section'
    };

    const areAllActionsDisabled = Object.values(actionElementMap).every(id => document.getElementById(id).classList.contains('disabled'));

    if (areAllActionsDisabled) {
        Object.values(actionElementMap).forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        document.getElementById('promotionCodeInput').style.display = 'block';
    }
}

function animateProgress(progressId) {
    const progressContainer = document.getElementById(progressId);
    const progressElement = progressContainer.querySelector('.chart');
    const percentText = progressContainer.querySelector('h5');
    let percent = 0;
    const totalDuration = 2000; // 2 seconds in milliseconds
    const intervalTime = 20; // update every 20 milliseconds
    const increment = 100 * (intervalTime / totalDuration); // calculate increment per update

    // Make the progress container visible at the start of the animation
    progressContainer.style.display = 'block';

    const interval = setInterval(() => {
        percent += increment;
        if (percent >= 100) {
            percent = 100;
            progressElement.setAttribute('data-percent', percent.toFixed(0));
            percentText.textContent = `${percent.toFixed(0)}%`;

            clearInterval(interval); // stop the interval

            // Optional: Set the progress container to be invisible after reaching 100%
        } else {
            progressElement.setAttribute('data-percent', percent.toFixed(0));
            percentText.textContent = `${percent.toFixed(0)}%`;
        }
    }, intervalTime);
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const paragraphs = element.getElementsByTagName('p'); // Get all <p> tags within the element
        for (const paragraph of paragraphs) {
            paragraph.innerHTML = ''; // Set the inner HTML to an empty string
        }
    } else {
        console.log('Element not found with ID:', elementId); // Optional: log an error if the element is not found
    }
}