
function validateForm(name, email, message) {
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!name || !email || !message) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = 'All fields are required.';
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.style.display = 'block';
        errorDiv.innerText = 'Please enter a valid email address.';
        return false;
    }

    return true;
}

function submitForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!validateForm(name, email, message)) {
        return;
    }

    fetch('/api/v1/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
    }).then(response => {
        if (response.ok) {
            document.getElementById('success').style.display = 'block';
            document.getElementById('success').innerText = 'Message sent successfully!';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
            return;
        }
        else {
            response.text().then(text => {
                document.getElementById('error').style.display = 'block';
                document.getElementById('error').innerText = text || 'Something went wrong. Please try again later.';
            });
        }
    }).catch(error => {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerText = 'Something went wrong. Please try again later.';
        console.error('Error:', error);
    });

}

