import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { base, baseSepolia, sepolia } from 'viem/chains';
import { reconnect, watchAccount, disconnect, getAccount, readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { Modal } from 'bootstrap';
import { Fireworks } from 'fireworks-js';

// 1. Get a project ID at https://cloud.walletconnect.com
let projectId, activeNetwork, contractAddress, authWebAddress, turnstileSiteKey;
let tweetId, tweetId2, userName;
let checkRetweetEnabled, checkRetweet2Enabled, checkLikeEnabled;

try {
    // Attempt to load the configuration file
    const jsonConfig = require('../contract-config.json');

    // Access properties
    activeNetwork = jsonConfig.activeNetwork;
    contractAddress = jsonConfig.contractAddress;
    authWebAddress = jsonConfig.authWebAddress;
    turnstileSiteKey = jsonConfig.turnstileSiteKey;
    projectId = jsonConfig.projectId;
    tweetId = jsonConfig.tweetId;
    tweetId2 = jsonConfig.tweetId2;
    userName = jsonConfig.userName;

    // Access additional properties for Twitter checks and actions
    checkRetweetEnabled = jsonConfig.checkRetweetEnabled;
    checkRetweet2Enabled = jsonConfig.checkRetweet2Enabled;
    checkLikeEnabled = jsonConfig.checkLikeEnabled;

    // Additional validation can be performed here as needed
    if (!activeNetwork || !contractAddress || !authWebAddress || !turnstileSiteKey || !projectId) {
        throw new Error("Required configuration values (activeNetwork or contractAddress or authWebAddress or turnstileSiteKey or projectId) are missing.");
    }

    if (!tweetId || !userName || !tweetId2) {
        throw new Error("Required configuration values (tweetId or tweetId2 or userName) are missing.");
    }

    if (!checkRetweetEnabled || !checkRetweet2Enabled || !checkLikeEnabled) {
        throw new Error("Required configuration values (checkRetweetEnabled or checkRetweet2Enabled or checkLikeEnabled) are missing.");
    }
} catch (error) {
    // Check if the error is due to missing file
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error("Error: Configuration file not found.");
        process.exit(1);
    }

    // Handle other errors
    console.error("Error loading configuration: ", error.message);
}

// 2. Create wagmiConfig
const metadata = {
    name: 'Lotso',
    description: 'Lotso NFT Website',
    url: 'https://lotso.org', // origin must match your domain & subdomain.
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

let chains;

if (activeNetwork === 'baseMainnet') {
    chains = [base];
} else if (activeNetwork === 'baseSepolia') {
    chains = [baseSepolia];
} else if (activeNetwork === 'sepolia') {
    chains = [sepolia];
} else {
    console.log('Invalid network selection');
    process.exit(1);
}

export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
});
reconnect(config);
console.log("Wagmi Config is:" + config);

// 3. Create modal
const modal = createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
    themeVariables: {
        '--w3m-z-index': 999
    }
});

function connect(param = 'dark') {
    if (getAccount(config).isConnected) {
        disconnect(config);

        // Clear the display information
        document.getElementById('claimAirdrop').innerText = 'Check Your Eligibility';
        //document.getElementById('airdropMessage').innerText = 'Press the button above to check for airdrop.';
    } else {
        modal.setThemeMode(param);
        modal.open();
    }
}

const connectBtn = document.getElementById('connectWallet');
const hint1 = document.getElementById('walletAddressHint1');
const hint2 = document.getElementById('walletAddressHint2');
const airdropHint1 = document.getElementById('airdropHint1');
const acceptBtn = document.getElementById('connectAccept');
const declineBtn = document.getElementById('connectDecline');
const connectTitle = document.getElementById('walletAddressTitle');
const airdrop = document.getElementById('airdropSection');
const gotoAirdrop = document.getElementById('gotoSection');

if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
        // Get the responsive menu element
        var responsiveMenu = document.querySelector('.navbar-collapse');

        // Close the responsive menu if it's open
        if (responsiveMenu.classList.contains('show')) {
            responsiveMenu.classList.remove('show');
            responsiveMenu.setAttribute('aria-expanded', 'false');
        }

        // Get the data-param attribute and proceed with the connect function
        var param = this.getAttribute('data-param');
        connect(param);
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
}

// listening for account changes
watchAccount(config,
    {
        onChange(account) {
            let truncatedAddress;
            if (hint2) {
                let address = account.address ?? '';
                // Check if the username length exceeds 15 characters
                if (address.length > 15) {
                    // Truncate the username to the first 5 characters, an ellipsis, and the last 5 characters
                    truncatedAddress = address.substring(0, 5) + '...' + address.substring(address.length - 5);
                } else {
                    // If the username is 15 characters or less, use it as is
                    truncatedAddress = address;
                }

                let addressHtml = '<div class="address-container">';
                addressHtml += '<input id="address" type="text" value="' + escapeHtml(address) + '" readonly data-full-address="' + escapeHtml(address) + '">';
                addressHtml += '<button onclick="copyAddress(event)"><i class="fa fa-copy"></i></button>';
                addressHtml += '</div>';

                hint2.innerHTML = addressHtml;
            }
            if (acceptBtn) {
                if (account.isConnected) {
                    hint1.innerText = 'Your wallet address is:';
                    acceptBtn.innerText = 'Disconnect';
                    connectBtn.innerText = truncatedAddress;
                    connectTitle.innerText = 'Account Information';
                    declineBtn.innerText = 'Close';
                    airdrop.style.display = 'block';
                    // TODO: Temporarily disable this button
                    gotoAirdrop.style.display = 'none';
                    // Hide the continue button after connecting the wallet
                    airdropHint1.style.display = 'none';
                } else {
                    hint1.innerHTML = 'To continue, please connect your Web3 wallet, such as <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> or <a href="https://walletconnect.org/" target="_blank" rel="noopener noreferrer">WalletConnect</a>. This allows our website to securely interact with your wallet.';
                    hint2.innerHTML = 'By clicking "Accept and Continue", you agree to our <a href="#" data-toggle="modal" data-target="#termsModal">terms and conditions</a> and <a href="#" data-toggle="modal" data-target="#privacyModal">privacy policy</a>. You will be prompted to connect your wallet via an external link. Ensure you\'re using a trusted and secure wallet service.';
                    acceptBtn.innerText = 'Accept and Continue';
                    connectBtn.innerText = 'Connect';
                    connectTitle.innerText = 'Notes Before Connecting';
                    declineBtn.innerText = 'Decline';
                    airdrop.style.display = 'none';
                    gotoAirdrop.style.display = 'none';
                    // Show the continue button before connecting the wallet
                    airdropHint1.style.display = 'block';
                }
            }
        }
    }
);

let airdropAmount = 0;
let twitterSteps = 0;

async function initiateTransaction() {
    // Updated contract ABI to include getAirdropAmount function
    const airdropAcquireABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "getAirdropAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    displayMessage('Waiting for user confirmation', 'info');

    try {
        // Ensuring activeNetwork is valid
        if (!['baseSepolia', 'baseMainnet', 'sepolia'].includes(activeNetwork)) {
            console.log('Invalid network selection');
            displayMessage('Invalid network selection', 'error');
            return;
        }

        // Acquire full address from the DOM element
        const fullAddress = document.getElementById('address').getAttribute('data-full-address');
        console.log('Full Address:', fullAddress);

        const contractReadResult = await readContract(config, {
            abi: airdropAcquireABI,
            address: contractAddress, // Replace with your contract address
            functionName: 'getAirdropAmount',
            args: [fullAddress] // Use the fullAddress here
        });

        console.log('Airdrop Amount:', contractReadResult);
        updateProgressBar(50, 'green');
        if (contractReadResult === BigInt(0)) {
            displayMessage('You have already claimed your airdrop.', 'info');
            updateProgressBar(100, 'red');
        } else {
            const divisor = BigInt("1000000000000000000");
            airdropAmount = addCommasToBigInt(((contractReadResult / divisor) + (contractReadResult % divisor > 0 ? 1n : 0n)).toString());
            displayMessage(`Your airdrop amount is: ${airdropAmount}, press the button above to confirm your airdrop.`, 'success');
            document.getElementById('claimAirdrop').textContent = 'Confirm Your Airdrop';
        }
    } catch (error) {
        console.error('Unable to get the current chain ID:', error);
        updateProgressBar(100, 'red');
        displayMessage('Error in retrieving chain ID', 'error');
    }
}

async function confirmTransaction() {    
    // Contract ABI for claimAirdrop
    const airdropContractABI = [
        {
            "inputs": [],
            "name": "claimAirdrop",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    displayMessage('Processing airdrop claim...', 'info');

    try {
        const transactionResponse = await writeContract(config, {
            abi: airdropContractABI,
            address: contractAddress, // Your contract's address
            functionName: 'claimAirdrop',
            args: [] // If the function requires arguments, list them here
        });
        const fullAddress = document.getElementById('address').getAttribute('data-full-address');

        const txHash = transactionResponse;
        console.log('Transaction Hash:', txHash);
        updateProgressBar(75, 'green');
        displayMessage('Transaction sent. Waiting for confirmation...', 'info');

        // Wait for the transaction receipt
        const transactionReceipt = await waitForTransactionReceipt(config, { hash: txHash });

        console.log('Transaction Receipt:', transactionReceipt);
        if (transactionReceipt && transactionReceipt.status === 'success') {

            // Log the record to the backend
            const airdropLog = await logAirdrop(fullAddress);
            if (airdropLog.success && !airdropLog.error) {
                console.log('Log successful for this airdrop claim, message:', airdropLog.message);
            } else if (!airdropLog.success && !airdropLog.error) {
                console.log('Log unsuccessful for this airdrop claim, message:', airdropLog.message);
            } else if (airdropLog.error) {
                throw new Error(airdropLog.message);
            }

            displayMessage('Transaction successful! Check Your Wallet For Airdrop', 'success');
            updateProgressBar(100, 'green');
            document.getElementById('claimAirdrop').textContent = 'Check Your Eligibility';

            // Send the airdrop reward if the current user uses the promotion code
            let promotionCode = document.getElementById('promotion-code-input').value;
            // Show error if the length of the promotionCode is not equal to 16
            if (promotionCode && promotionCode.length !== 16) {
                displayMessage('Promotion code must be 16 characters long.', 'error');
                console.log('Promotion code must be 16 characters long.');
                return;
            }
            let url = null;
            if (promotionCode && twitterSteps !== 0) {
                url = authWebAddress + `/send-airdrop-parent?address=${encodeURIComponent(fullAddress)}`;
                
                const response = await fetch(url, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            }

            var modalElement = document.getElementById('connectModal2');
            document.getElementById('congratulation-message').innerText = airdropAmount;

            // Initialize the Bootstrap Modal
            var bootstrapModal = new Modal(modalElement, {
                keyboard: false
            });

            // Show the modal
            bootstrapModal.show();

            // Set a timeout to close the modal after 5 seconds
            setTimeout(function() {
                bootstrapModal.hide();
            }, 5000);
            // Show fireworks animation for 10 seconds
            startFireworksForDuration(10000);
        } else {
            displayMessage('Transaction failed', 'error');
            updateProgressBar(100, 'red');
        }
    } catch (error) {
        console.error('Error in transaction:', error);
        let errorMessage = error.reason || 'Error in claiming airdrop';
        displayMessage(errorMessage, 'error');
        updateProgressBar(100, 'red');
    }
}

function displayMessage(message, type) {
    // Log the message to the console
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Update an element in the HTML
    const messageElement = document.getElementById('airdropMessage');
    if (messageElement) {
        messageElement.innerText = message;
        // Clear previous class names
        messageElement.className = '';

        // Add the appropriate class based on the message type
        if (type === 'info') {
            messageElement.classList.add('success-message'); // Assuming info messages are success messages
        } else if (type === 'error') {
            messageElement.classList.add('error-message');
        }

        // Clear the message after 10 seconds
        setTimeout(() => {
            messageElement.innerText = ''; // Clear the text
            messageElement.className = ''; // Also clear any class that was added
        }, 10000);
    }
}

function updateProgressBar(percentage, color) {
    // Select the progress bar element
    const progressBar = document.getElementById('current-progress');
    
    if (progressBar) {
        // Update the width, aria-valuenow, and text content
        progressBar.style.width = percentage + '%';
        progressBar.style.backgroundColor = color;
        progressBar.setAttribute('aria-valuenow', percentage);
        progressBar.textContent = percentage + '%';
    }
}

function addCommasToBigInt(bigIntStr) {
    let result = '';
    let length = bigIntStr.length;
    let counter = 0;

    for (let i = length - 1; i >= 0; i--) {
        counter++;
        result = bigIntStr.charAt(i) + result;
        if (counter % 3 === 0 && i !== 0) {
            result = ',' + result;
        }
    }
    return result;
}

async function checkUserEligibility() {
    try {
        displayMessage('Checking your eligibility...', 'info');
        const fullAddress = document.getElementById('address').getAttribute('data-full-address');
        console.log('Checking eligibility for address:', fullAddress);

        let promotionCode = document.getElementById('promotion-code-input').value;

        // Check if the user has purchased the first generation of $Lotso
        const lpCheck = await checkIfPurchased(fullAddress);
        if (!lpCheck.success) {
            console.log('User is not eligible for the airdrop, need to provide promotion code:', lpCheck.message);
            if (!promotionCode) {
                updateProgressBar(100, 'red');
                displayMessage('You need to provide the promotion code to claim the airdrop.', 'error');
                return;
            } else if (promotionCode.length !== 16) {
                // Show error if the length of the promotionCode is not equal to 16
                displayMessage('Promotion code must be 16 characters long.', 'error');
                console.log('Promotion code must be 16 characters long.');
                return;
            }
        }

        // Check if the user has interacted with the required steps
        const twitterCheck = await checkTwitterInteractions(tweetId, tweetId2);
        if (!twitterCheck.success) {
            console.log('Twitter interaction checks failed:', twitterCheck.message);
            updateProgressBar(100, 'red');
            displayMessage('Twitter interaction checks failed', 'error');
            return;
        }
        // If user input the promotion code, then pass this variable to the backend
        twitterSteps = twitterCheck.step;
        let url = null;
        if (promotionCode) {
            url = authWebAddress + `/check-airdrop-amount?address=${encodeURIComponent(fullAddress)}&step=${twitterSteps}&promotionCode=${encodeURIComponent(promotionCode)}`;
        } else {
            url = authWebAddress + `/check-airdrop-amount?address=${encodeURIComponent(fullAddress)}&step=${twitterSteps}`;
        }
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.code === 0 && data.message === 'Success' && !data.error) {
            const hasAirdropped = data.data.has_airdropped;
            const obtainedAddress = data.data.address;
            const airdropCount = BigInt(data.data.airdrop_count);
            const divisor = BigInt("1000000000000000000");
            const scheduledDelivery = new Date(data.data.scheduled_delivery);
            const now = new Date();

            // Compare the obtained address with the sent address
            if (obtainedAddress.toLowerCase() !== fullAddress.toLowerCase()) {
                throw new Error('The obtained address does not match the sent address, please refresh the browser cache and retry.');
            }

            // Check if the user has already claimed the airdrop
            const airdropCheck = await checkIfClaimedAirdrop(fullAddress);
            if (airdropCheck.success && !airdropCheck.error) {
                console.log('User has already claimed the airdrop');
                updateProgressBar(100, 'red');
                displayMessage('You have already claimed the airdrop with this user', 'info');
                return;
            } else if (!airdropCheck.success && !airdropCheck.error) {
                console.log('User has not claimed the airdrop yet');
            } else if (airdropCheck.error) {
                throw new Error(airdropCheck.message);
            }

            // Awaiting the result of Twitter interaction checks
            if (scheduledDelivery.toISOString() === "1970-01-01T08:00:00Z") {
                updateProgressBar(100, 'red');
                displayMessage('You do not have the eligibility to claim the airdrop', 'info');
            } else if (scheduledDelivery > now) {
                let airdropCnt = addCommasToBigInt(((airdropCount / divisor) + (airdropCount % divisor > 0n ? 1n : 0n)).toString());
                // Calculate time difference and display countdown
                let timeDiff = scheduledDelivery.getTime() - now.getTime();
                let days = Math.floor(timeDiff / (1000 * 3600 * 24));
                let hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
                let minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
                displayMessage(`Congratulations! You have been allocated ${airdropCnt} Lotso tokens for the airdrop. We have recorded your address and will distribute the airdrop to you in ${days} days, ${hours} hours, and ${minutes} minutes. You can come and claim the airdrop after we distribute it.`, 'info');
            } else {
                if (!hasAirdropped) {
                    console.log('Airdrop has not started yet. Please wait patiently.');
                    updateProgressBar(100, 'red');
                    displayMessage('Airdrop has not started yet. Please wait patiently.', 'info');
                } else {
                    console.log('User is eligible to claim the airdrop');
                    updateProgressBar(25, 'green');
                    displayMessage('You are eligible to claim the airdrop. Press the button above to check your airdrop amount.', 'info');
                    document.getElementById('claimAirdrop').textContent = 'Claim Your Airdrop';
                }
            }
        } else {
            throw new Error(data.error || data.message || 'Unknown error occurred');
        }
    } catch (err) {
        console.error('Error:', err);
        updateProgressBar(100, 'red');
        displayMessage(`Error: ${err.message}`, 'error');
    }
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', function () {
    const claimAirdropButton = document.getElementById('claimAirdrop');
    let isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Dynamically add Turnstile widget if not in a local environment
    if (!isLocal) {
        var widgetDiv = document.getElementById('turnstileWidget');
        var theme = document.getElementById('connectAccept').getAttribute('data-param');
        var turnstileElement = document.createElement('div');
        turnstileElement.className = 'cf-turnstile';
        turnstileElement.setAttribute('data-sitekey', turnstileSiteKey);
        turnstileElement.setAttribute('data-theme', theme);
        // Append the Turnstile element to the widget div
        widgetDiv.appendChild(turnstileElement);
    }

    if (claimAirdropButton) {
        if (claimAirdropButton.textContent === 'Claim Your Airdrop') {
            document.getElementById('airdropMessage').innerText = 'Press the button above to claim your airdrop.';
        } else if (claimAirdropButton.textContent === 'Confirm Your Airdrop') {
            document.getElementById('airdropMessage').innerText = 'Press the button above to confirm your airdrop.';
        }

        claimAirdropButton.addEventListener('click', function handleButtonClick() {
            if (connectBtn.textContent === 'Connect') {
                airdropHint1.innerText = 'You need to connect your wallet first!';
            } else {
                if (!isLocal) {
                    var response = document.querySelector('[name="cf-turnstile-response"]').value;
                    if (response) {
                        proceedWithAction(claimAirdropButton); // Proceed after CAPTCHA validation
                    } else {
                        displayMessage('Please complete the CAPTCHA', 'error');
                    }
                } else {
                    console.log('Running locally, skipping CloudFlare Turnstile verification');
                    proceedWithAction(claimAirdropButton); // Directly proceed as it's a local environment
                }
            }
        });
    }
});

function proceedWithAction(button) {
    if (button.textContent === 'Check Your Eligibility') {
        checkUserEligibility();
    } else if (button.textContent === 'Claim Your Airdrop') {
        initiateTransaction();
    } else if (button.textContent === 'Confirm Your Airdrop') {
        confirmTransaction();
    }
}

function startFireworksForDuration(duration) {
    const container = document.getElementById('fireworks-container'); // Use the body as the container
    container.style.display = 'block'; // Show the container
    const width = window.innerWidth; // Use the full viewport width
    const height = window.innerHeight; // Use the full viewport height

    const options = {
        maxRockets: 3, // max # of rockets to spawn
        rocketSpawnInterval: 150, // milliseconds to check if new rockets should spawn
        numParticles: 100, // number of particles to spawn when rocket explodes (+0-10)
        explosionMinHeight: 0.2, // percentage. min height at which rockets can explode
        explosionMaxHeight: 0.9, // percentage. max height before a particle is exploded
        explosionChance: 0.08, // chance in each tick the rocket will explode
        width: width, // override the width, defaults to container width
        height: height, // override the height, defaults to container height
        
        cannons: [{ x: width * 0.2 }, { x: width * 0.8 }],
        rocketInitialPoint: width * 0.5,
    };
    const fireworks = new Fireworks(container, options);
    fireworks.start();

    // Stop fireworks after the specified duration
    setTimeout(() => {
        fireworks.stop();
        container.style.display = 'none'; // Hide the container again
    }, duration);
}

async function logAirdrop(address) {
    try {
        const response = await fetch(`${authWebAddress}/log-airdrop?address=${address}`, { credentials: 'include' });
        // Use handleResponse to process the fetch response
        const result = await handleResponse(response);

        // Now proceed with your business logic
        if (result.data.isLogged) {
            return { success: true, error: false, message: 'Airdrop claim has been recorded successfully!' };
        } else {
            return { success: false, error: false, message: 'Airdrop claim has not beed recorded.' };
        }
    } catch (error) {
        console.error('Failed:', error.message);
        return { success: false, error: true, message: error.message };
    }
}

async function checkIfClaimedAirdrop(address) {
    try {
        const response = await fetch(`${authWebAddress}/check-airdrop?address=${address}`, { credentials: 'include' });
        // Use handleResponse to process the fetch response
        const result = await handleResponse(response);

        // Now proceed with your business logic
        if (result.data.hasClaimed) {
            return { success: true, error: false, message: 'All checks passed!' };
        } else {
            return { success: false, error: false, message: 'Airdrop has not been claimed.' };
        }
    } catch (error) {
        console.error('Failed:', error.message);
        return { success: false, error: true, message: error.message };
    }
}

async function checkIfPurchased(address) {
    try {
        const response = await fetch(`${authWebAddress}/check-purchase?address=${address}`, { credentials: 'include' });
        // Use handleResponse to process the fetch response
        const result = await handleResponse(response);

        // Check if the user has purchased the first generation of $Lotso tokens
        if (result.data.purchase) {
            return { success: true, error: false, message: 'All checks passed!' };
        } else {
            return { success: false, error: false, message: 'User is not eligible for the airdrop.' };
        }
    } catch (error) {
        console.error('Failed:', error.message);
        return { success: false, error: true, message: error.message };
    }
}

async function checkTwitterInteractions(tweetId, tweetId2) {
    try {
        let step_cnt = 0;
        if (checkRetweetEnabled === "true") {
            const isRetweeted2 = await checkRetweet(tweetId2);
            console.log('Retweet check:', isRetweeted2);
            if (!isRetweeted2) {
                console.log('Tweet2 has not been retweeted by the user.');
            } else {
                step_cnt++;
            }
        }

        if (checkRetweet2Enabled === "true") {
            const isLiked = await checkLike(tweetId);
            console.log('Like check:', isLiked);
            if (!isLiked) {
                console.log('Tweet is not liked by the user.');
            } else {
                step_cnt++;
            }
        }

        if (checkLikeEnabled === "true") {
            const isRetweeted = await checkRetweet(tweetId);
            console.log('Retweet check:', isRetweeted);
            if (!isRetweeted) {
                console.log('Tweet has not been retweeted by the user.');
            } else {
                step_cnt++;
            }
        }

        // const isBookmarked = await checkBookmark(tweetId);
        // console.log('Bookmark check:', isBookmarked);
        // if (!isBookmarked) {
        //     console.log('Tweet has not been bookmarked by the user.');
        // } else {
        //     step_cnt++;
        // }

        console.log('Checks passed steps: ', step_cnt);
        if (step_cnt === 0) {
            return { success: false, step: step_cnt, message: 'No checks passed' };
        } else {
            return { success: true, step: step_cnt, message: `Checks passed steps: ${step_cnt}`};
        }
    } catch (error) {
        console.error('Failed:', error.message);
        return { success: false, step: 0, message: error.message };
    }
}

// function checkFollow(targetUserName) {
//     return fetch(`${authWebAddress}/check-follow?userName=${targetUserName}`, { credentials: 'include' })
//         .then(handleResponse)
//         .then(response => response.data.isFollowing);
// }

// function checkBookmark(tweetId) {
//     return fetch(`${authWebAddress}/check-bookmark?tweetId=${tweetId}`, { credentials: 'include' })
//         .then(handleResponse)
//         .then(response => response.data.isBookmarked);
// }

function checkLike(tweetId) {
    return fetch(`${authWebAddress}/check-like?tweetId=${tweetId}`, { credentials: 'include' })
        .then(handleResponse)
        .then(response => response.data.isLiked);
}

function checkRetweet(tweetId) {
    return fetch(`${authWebAddress}/check-retweet?tweetId=${tweetId}`, { credentials: 'include' })
        .then(handleResponse)
        .then(response => response.data.isRetweeted);
}

function handleResponse(response) {
    if (response.status === 401) {
        // Throw an error that specifically handles 401 Unauthorized
        throw new Error('Authorization required: Please authorize your Twitter account via the following button.');
    }
    if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
    }
    return response.json();
}
