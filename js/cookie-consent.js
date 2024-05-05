/* global $ */
$(document).ready(function() {
    function checkCookieConsent() {
        if (!localStorage.getItem('cookieConsent')) {
            // Set a timeout to delay the modal display by 3 seconds
            setTimeout(function() {
                $('#cookieConsentModal').modal('show');
            }, 5000);
        }
    }

    window.acceptCookies = function() {
        localStorage.setItem('cookieConsent', 'true');
        $('#cookieConsentModal').modal('hide');
    };

    window.declineCookies = function() {
        localStorage.setItem('cookieConsent', 'false');
        $('#cookieConsentModal').modal('hide');
        alert("You have declined the use of cookies. This may affect your user experience.");
    };

    checkCookieConsent();
});
