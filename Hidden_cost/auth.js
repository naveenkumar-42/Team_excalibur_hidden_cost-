// auth.js

document.addEventListener('DOMContentLoaded', function () {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('Logged in:', userCredential.user);
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify({ email: userCredential.user.email }));
                window.location.href = "popup.html"; // Redirect to popup.html
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                alert("Error logging in: " + error.message);
            });
        });
    }


    // Toggle password visibility for login
    const togglePasswordLogin = document.getElementById('toggle-password');
    const passwordFieldLogin = document.getElementById('password');
    const eyeIconLogin = document.getElementById('eye-icon-login');

    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener('click', function () {
            const isPasswordVisible = passwordFieldLogin.getAttribute('type') === 'password';
            passwordFieldLogin.setAttribute('type', isPasswordVisible ? 'text' : 'password');
            eyeIconLogin.src = isPasswordVisible ? 'eye-closed-icon.png' : 'eye-icon.png';
        });
    }

    // Toggle password visibility for register
    const togglePasswordRegister = document.getElementById('toggle-register-password');
    const passwordFieldRegister = document.getElementById('register-password');
    const eyeIconRegister = document.getElementById('eye-icon-register');

    if (togglePasswordRegister) {
        togglePasswordRegister.addEventListener('click', function () {
            const isPasswordVisible = passwordFieldRegister.getAttribute('type') === 'password';
            passwordFieldRegister.setAttribute('type', isPasswordVisible ? 'text' : 'password');
            eyeIconRegister.src = isPasswordVisible ? 'eye-closed-icon.png' : 'eye-icon.png';
        });
    }

    // Toggle confirm password visibility
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordField = document.getElementById('confirm-password');
    const eyeIconConfirm = document.getElementById('eye-icon-confirm');

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function () {
            const isPasswordVisible = confirmPasswordField.getAttribute('type') === 'password';
            confirmPasswordField.setAttribute('type', isPasswordVisible ? 'text' : 'password');
            eyeIconConfirm.src = isPasswordVisible ? 'eye-closed-icon.png' : 'eye-icon.png';
        });
    }
    
    // Google sign-in
    const googleSignin = document.getElementById('google-signin');
    if (googleSignin) {
        googleSignin.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();

            auth.signInWithPopup(provider)
            .then((result) => {
                console.log('Google sign-in:', result.user);
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify({ email: result.user.email }));
                window.location.href = "popup.html"; // Redirect to popup.html
            })
            .catch((error) => {
                console.error('Error during Google sign-in:', error);
                alert("Error during Google sign-in: " + error.message);
            });
        });
    }
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Validate the email using ZeroBounce API
            const isEmailValid = await validateEmailWithZeroBounce(email);
            console.log('Is email valid:', isEmailValid); // Debugging line
            if (!isEmailValid) {
                alert('Invalid email address. Please use a valid email.');
                return;
            }

            try {
                // Check if user already exists
                const userDoc = db.collection("users").doc(email);
                const userSnapshot = await userDoc.get();

                if (userSnapshot.exists) {
                    alert("User already registered. Please log in.");
                    return;
                }

                // Create user in Firebase Authentication
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);

                // Create user document in Firestore
                await userDoc.set({
                    email: email,
                    uid: userCredential.user.uid,
                });

                console.log('Registered:', userCredential.user);
                alert("Registration successful! Redirecting to the main page...");

                // Redirect to popup.html after successful registration
                window.location.href = "popup.html";
            } catch (error) {
                console.error('Error registering:', error);
                alert("Error registering: " + error.message);
            }
        });
    }

    // Function to validate email using ZeroBounce API
    async function validateEmailWithZeroBounce(email) {
        const apiKey = '9cf987ac3b14492e8eef38e9f07124b2'; // Replace with your ZeroBounce API Key
        const apiUrl = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Email validation response:', data); // Log the response for debugging

            // Check the status of the email
            if (data.status === 'valid') {
                return true;
            } else {
                console.log('Email validation status:', data.status); // Log the status for debugging
                return false; // Invalid or invalid email
            }
        } catch (error) {
            console.error('Error validating email:', error);
            alert("Error validating email: " + error.message);
            return false;
        }
    }
});