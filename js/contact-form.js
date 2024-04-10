document.getElementById('contactForm').addEventListener('submit', function(event) {    
    event.preventDefault(); // Prevent the form from submitting

    // Clear existing errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
    document.getElementById('messageSuccess').textContent = '';

    let hasError = false;

    // Check Name
    if (document.getElementById('userName').value.trim() === '') {
        document.getElementById('nameError').textContent = 'Please enter your name.';
        hasError = true;
    }

    // Check Email
    const userEmail = document.getElementById('userEmail').value.trim();
    if (userEmail === '') {
        document.getElementById('emailError').textContent = 'Please enter your email address.';
        hasError = true;
    } else {
        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(userEmail)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            hasError = true;
        }
    }

    // Check Message
    if (document.getElementById('userMessage').value.trim() === '') {
        document.getElementById('messageError').textContent = 'Please enter your favorite Disney character.';
        hasError = true;
    }

    if (!hasError) {
        var successMessageDiv = document.getElementById('messageSuccess');
        successMessageDiv.textContent = "Your action was successfully completed! We'll reply to you soon.";
        successMessageDiv.style.display = 'block';
        // Email sending for subscription
        sendSubscriptionEmail(userEmail)
            .then(() => {
                console.log('Email sent successfully');
                document.getElementById('contactForm').submit(); // Submit the form after the email is sent
            })
            .catch(error => {
                console.log('Failed to send email: ' + error);
            });

        setTimeout(function() {
            successMessageDiv.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    }
});

document.getElementById('subscriptionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Clear existing errors
    document.getElementById('subscriptionEmailError').textContent = '';
    document.getElementById('subscriptionSuccess').textContent = '';

    var email = document.getElementById('subscriptionEmail').value;
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    if (email.trim() === '') {
        document.getElementById('subscriptionEmailError').textContent = 'Please enter your email address.';
    }
    else if (!emailRegex.test(email)) {
        document.getElementById('subscriptionEmailError').textContent = 'Please enter a valid email address.';
    }
    else {
        // If email is valid
        document.getElementById('subscriptionSuccess').textContent = 'Email is valid! Proceeding with subscription.';
        // Email sending for subscription
        sendSubscriptionEmail(email)
            .then(() => {
                console.log('Email sent successfully');
                document.getElementById('subscriptionForm').submit(); // Submit the form after the email is sent
            })
            .catch(error => {
                console.log('Failed to send email: ' + error);
            });
    }
});

// Get an email token at https://emailjs.com/
function loadConfig() {
    return fetch('../contract-config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load configuration.");
            }
            return response.json();
        });
}

function sendSubscriptionEmail(userEmail) {
    return Promise.all([
        loadConfig(),
        fetch('../email/index.html').then(response => response.text())
    ])
    .then(([config, htmlBody]) => {
        const templateParams = {
            to_email: userEmail,
            reply_to: userEmail,
            message_html: htmlBody
        };

        return fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: 'lotso_email',
                template_id: 'lotso_email_template',
                user_id: config.emailToken,
                template_params: templateParams,
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        return response;
    });
}
