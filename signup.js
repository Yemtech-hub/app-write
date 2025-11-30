// signup.js
import { Client, Account } from 'appwrite';

// ============================
// Initialize Appwrite client
// ============================
const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your API endpoint
    .setProject('692cae73000414b6d919'); // Your Project ID

const account = new Account(client);

// ============================
// Get form element
// ============================
const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ============================
    // Get form values
    // ============================
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const accountType = document.getElementById('account_type').value;

    // ============================
    // Password validation using pattern
    // ============================
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$_&%#@+\-]).{8,}$/;
    if (!passwordPattern.test(password)) {
        alert('Password must contain uppercase, lowercase, number, symbol, and at least 8 characters.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!accountType) {
        alert('Please select an account type.');
        return;
    }

    try {
        // ============================
        // Create user
        // ============================
        const user = await account.create('unique()', email, password, username);

        // Optional: store account type in preferences
        await account.updatePrefs({ accountType: accountType });

        // Send verification email
        await account.createVerification(email, window.location.href);

        alert('Sign up successful! Please check your email to verify your account.');

        // Reset the form
        signupForm.reset();
    } catch (error) {
        console.error('Sign up error:', error);
        alert('Sign up failed: ' + error.message);
    }
});