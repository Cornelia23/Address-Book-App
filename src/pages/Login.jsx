/**
 * Login Component
 * 
 * This manages the functionality for the login page, which is the first page a user will see.
 * On this page, a user is able to:
 *  -Login using an email and password
 *  -Login using Google
 *  -Navigate to the Signin page if they don't already have an account
 * 
 * This uses a GoogleAuthProvider from Firebase to allow users to login through their Google accounts.
 */

import { useState } from 'react';
import { auth } from '../firebase/config'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

  

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const formatError = (code) => {
        switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already in use.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/account-exists-with-different-credential':
            return 'This account is already registered with a different method.';
        default:
            return 'Signup failed. Please try again.';
        }
    };

    const navigate = useNavigate();

    /**
     * handleSubmit
     * 
     * This function is called when the login form is submitted. It calls preventDefault to stop a page
     * reload, and then it uses the Firebase signInWithEmailAndPassword function to sign the user in. 
     * Upon success, it navigates the user to the dashboard.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // stop the form from refreshing the page
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Created: ", user);
            navigate('/dashboard');

        }
        catch (err) {
            console.error("Signup Error: ", err.message);
            setError(formatError(err.code));
        }
    };

    const googleProvider = new GoogleAuthProvider();

    /**
     * handleGoogleSignIn
     * 
     * This function is called when the sign in with Google button is pressed. It calls the 
     * signInWithPopup function on the googleProvider to allow the user to sign in with their
     * Google account and upon success navigates the user to the dashboard page.
     */
    const handleGoogleSignIn = async () => {
        try {
        await signInWithPopup(auth, googleProvider);
        navigate('/dashboard');
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <div className="signup-container">
        <div className="form-header">
            <h1>Login</h1>
        </div>
    
        <div className="form-body">
            <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
    
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
    
            <button type="submit">Submit</button>
            <p>
                Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
            <button className="google-signin-button" onClick={handleGoogleSignIn}>
                <span>Sign in with Google    </span>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
            </button>
            </form>
        </div>
    
        <div className="form-footer">
            {error && <div className="error-message">{error}</div>}
        </div>
        </div>
    )      
}

export default Login;