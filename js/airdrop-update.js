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
    let webAddress, airdropPerTransaction;

    fetch('../contract-config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonConfig => {
            // Access properties
            webAddress = jsonConfig.authWebAddress + '/v1/info/recipients_count';
            airdropPerTransaction = parseInt(jsonConfig.airdropPerTransaction, 10);

            // Additional validation can be performed here as needed
            if (!webAddress || !airdropPerTransaction) {
                throw new Error("Required configuration values (webAddress or airdropPerTransaction) are missing.");
            }

            console.log(`Web Address: ${webAddress}`);
            console.log(`Airdrop Per Transaction: ${airdropPerTransaction}`);

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

            const airdropsClaimed = airdropPerTransaction * data.data;
            const formattedCount = addCommasToBigInt(airdropsClaimed.toString());
            document.getElementById('airdropCount').innerText = formattedCount;
            console.log(`Airdrops Claimed: ${formattedCount}`);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('Failed to fetch data:', error);
        });
});
