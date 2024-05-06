// eslint-disable-next-line no-unused-vars
function copyAddress(event) {
    event.preventDefault();

    var copyInput = document.getElementById("address");
    var fullAddress = copyInput.getAttribute("data-full-address");

    // Using the Clipboard API
    navigator.clipboard.writeText(fullAddress).then(function() {
        console.log('Address copied to clipboard successfully!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });

    // Create and show a hint message
    var hint = document.createElement('span');
    hint.innerText = 'Copied to clipboard';
    hint.style.cssText = 'position: absolute; color: green; background-color: white; padding: 5px; border-radius: 5px; margin-left: 10px;';
    var button = document.querySelector('.address-container button');
    button.parentNode.insertBefore(hint, button.nextSibling);

    // Remove the hint after 2 seconds
    setTimeout(function() {
        hint.remove();
    }, 2000);
}
