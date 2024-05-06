// Function to add commas for formatting
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

document.addEventListener('DOMContentLoaded', function() {
    let webAddress;

    fetch('../contract-config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonConfig => {
            // Access properties
            webAddress = jsonConfig.authWebAddress + '/v1/info/recipient_info';

            // Additional validation can be performed here as needed
            if (!webAddress) {
                throw new Error("Required configuration values (webAddress) are missing.");
            }

            console.log(`Web Address: ${webAddress}`);

            // Nested fetch using the webAddress
            return fetch(webAddress);
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                console.log('Success:', data.message);
                console.log('Number of recipients:', data.data);
            } else {
                console.error('Error:', data.message);
                console.log('Error code:', data.code);
                console.log('Error details:', data.error);
                console.log('Last successful data:', data.data);
            }

            const airdropsClaimed = data.data.airdrop_amount;
            const participantCount = data.data.recipient_count;
            const formattedCount = addCommasToBigInt(airdropsClaimed.toString());
            document.getElementById('airdropCount').innerText = formattedCount;
            document.getElementById('participantCount').innerText = participantCount;
            console.log(`Airdrops Claimed: ${formattedCount}, participant number: ${participantCount}`);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('Failed to fetch data:', error);
        });
});
