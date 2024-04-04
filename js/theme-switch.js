document.body.setAttribute("data-theme", "dark");

function updateTurnstileTheme(theme) {
    let isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
        fetch('../contract-config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load configuration file.");
                }
                return response.json();
            })
            .then(jsonConfig => {
                const turnstileSiteKey = jsonConfig.turnstileSiteKey;

                if (!turnstileSiteKey) {
                    throw new Error("Required configuration values (turnstileSiteKey) are missing.");
                }

                var widgetDiv = document.getElementById('turnstileWidget');
                widgetDiv.innerHTML = ''; // Clear the existing content

                // Explicitly render the new Turnstile widget
                if (window.turnstile && window.turnstile.render) {
                    turnstile.render('#turnstileWidget', {
                        sitekey: turnstileSiteKey,
                        theme: theme,  // Set the theme
                        callback: function(token) {
                            console.log("Turnstile token received:", token);
                        }
                    });
                } else {
                    console.log("Turnstile API is not loaded yet.");
                }
            })
            .catch(error => {
                console.error("Error loading configuration: ", error.message);
            });
    }
}

document.querySelector('.theme-switch-button').addEventListener('click', function() {
    var themeLink = document.getElementById('theme-link');
    var themeLinkResponsive = document.getElementById('theme-link-responsive');
    var connectAcceptButton = document.getElementById('connectAccept');
    var particlesElement = document.getElementById('particles-js');
    
    if (themeLink.getAttribute('href').includes('css/style.css') &&
        themeLinkResponsive.getAttribute('href').includes('css/responsive.css')) {
        themeLink.setAttribute('href', 'css/light-version/style.css');
        themeLinkResponsive.setAttribute('href', 'css/light-version/responsive.css');
        document.body.setAttribute("data-theme", "light"); // Set data-theme to light
        connectAcceptButton.setAttribute('data-param', 'light');
        particlesElement.style.visibility = 'hidden';
        updateTurnstileTheme('light');
    } else {
        themeLink.setAttribute('href', 'css/style.css');
        themeLinkResponsive.setAttribute('href', 'css/responsive.css');
        document.body.setAttribute("data-theme", "dark"); // Set data-theme to dark
        connectAcceptButton.setAttribute('data-param', 'dark');
        particlesElement.style.visibility = 'visible';
        updateTurnstileTheme('dark');
    }
});