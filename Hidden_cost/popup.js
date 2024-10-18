// popup.js

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');

    if (user) {
        const username = user.email.split('@')[0];
        welcomeMessage.textContent = `Hi 🙋‍♂️, ${username}`; // Assuming user.email contains the user's email
        logoutButton.style.display = 'block';
    } else {
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }

    // Logout functionality
    logoutButton.addEventListener('click', function () {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('user'); // Clear user session
            window.location.href = 'login.html'; // Redirect to login page
        }).catch((error) => {
            console.error('Error during logout:', error);
            alert("Error during logout: " + error.message);
        });
    });

    // Existing code for submitUrl button
    document.getElementById('submitUrl').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const url = tabs[0].url;
            chrome.runtime.sendMessage({ action: 'openNewTab', url: url });
        });
    });
});


