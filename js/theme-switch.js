document.querySelector('.theme-switch-button').addEventListener('click', function() {
    var themeLink = document.getElementById('theme-link');
    var themeLinkResponsive = document.getElementById('theme-link-responsive');
    
    if (themeLink.getAttribute('href').includes('css/style.css') &&
        themeLinkResponsive.getAttribute('href').includes('css/responsive.css')) {
        themeLink.setAttribute('href', 'css/light-version/style.css');
        themeLinkResponsive.setAttribute('href', 'css/light-version/responsive.css');
        document.body.setAttribute("data-theme", "light"); // Set data-theme to light
    } else {
        themeLink.setAttribute('href', 'css/style.css');
        themeLinkResponsive.setAttribute('href', 'css/responsive.css');
        document.body.setAttribute("data-theme", "dark"); // Set data-theme to dark
    }
});