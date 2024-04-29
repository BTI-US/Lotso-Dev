let authWebAddress = null;

function checkPromotionCode(event) {
    event.preventDefault();

    var promotionCode = document.getElementById('promotion-code-input').value;
    // Show error if the length of the promotionCode is not equal to 16
    if (promotionCode && promotionCode.length !== 16) {
        document.getElementById('promotion-input-error').innerText = 'Promotion code must be 16 characters long.';
        setTimeout(function() {
            document.getElementById('promotion-input-error').innerText = '';
        }, 5000);
    } else {
        // Smoothly scroll to the desired section if the promotion code is correct
        var desiredSection = document.getElementById('airdrop');
        if (desiredSection) {
            desiredSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}

function copyPromotionCode(event) {
    event.preventDefault();

    var copyInput = document.getElementById("promotionCode");
    var fullAddress = copyInput.getAttribute("data-full-code");

    // Using the Clipboard API
    navigator.clipboard.writeText(fullAddress).then(function() {
        console.log('Code copied to clipboard successfully!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });

    // Create and show a hint message
    var hint = document.createElement('span');
    hint.innerText = 'Copied to clipboard';
    hint.style.cssText = 'position: absolute; color: green; background-color: white; padding: 5px; border-radius: 5px; margin-left: 10px;';
    var button = document.querySelector('.code-container button');
    button.parentNode.insertBefore(hint, button.nextSibling);

    // Remove the hint after 2 seconds
    setTimeout(function() {
        hint.remove();
    }, 2000);
}

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

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
}

// Reset the promotionCodeInfo to empty after refreshing the webpage
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('promotionCodeInfo').innerHTML = '';

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

            // Additional validation can be performed here as needed
            if (!authWebAddress) {
                throw new Error("Required configuration values (authWebAddress) are missing.");
            }

            document.getElementById('generatePromotionButton').addEventListener('click', function() {
                const address = getFullAddress();
                if (address) {
                    // Construct the URL with the address query parameter
                    const url = authWebAddress + `/generate-promotion-code?address=` + encodeURIComponent(address);

                    // Use HTTP GET Request to the backend to generate the promotion code
                    fetch(url, { credentials: 'include' })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error('Network response was not ok.');
                        })
                        // Handle the response to display the promotion code
                        .then(response => {
                            const promotionCode = response.data.promotion_code;
                            // Assuming the response returns the promotion code directly
                            let promotionCodeHtml = '<div class="address-container code-container">';
                            promotionCodeHtml += '<input id="promotionCode" type="text" value="' + escapeHtml(promotionCode) + '" readonly data-full-code="' + escapeHtml(promotionCode) + '">';
                            promotionCodeHtml += '<button onclick="copyPromotionCode(event)"><i class="fa fa-copy"></i></button>';
                            promotionCodeHtml += '</div>';
                            document.getElementById('promotionCodeInfo').innerHTML = promotionCodeHtml;
                        })
                        .catch(error => {
                            console.error('Error fetching the promotion code:', error);
                            document.getElementById('promotionCodeInfo').innerHTML = '<p>Error fetching promotion code.</p>';
                        });
                } else {
                    document.getElementById('promotionCodeInfo').innerHTML = '<p>You need to connect your wallet before generating the promotion code.</p>';
                }
            });
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        });
});
