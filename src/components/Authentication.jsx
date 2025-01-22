import { useState } from "react";
import useAuth from "../hooks/useAuth";

function Authentication(props) {

    const { handleCloseModal } = props;

    // Determine whether the user is to sign in or sign up (by default sign in)
    const [isRegistration, setIsRegistration] = useState(false);
    // Store the email address for authentication or registration
    const [email, setEmail] = useState('');
    // Store the password for authentication or registration
    const [password, setPassword] = useState('');
    // Show a loading state while the user is being authenticated
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    // Store error message
    const [errorMessage, setErrorMessage] = useState('');

    
    const { signup, login } = useAuth();
    
    async function handleAuthenticate() {

        // Reset error message
        setErrorMessage('');
        
        // check whether authentication is being processed
        if (isAuthenticating) return;

        /**
         * Check for the appropriate input of email
         * OR
         * Check for the appropriate input of password
         */
        switch (true) {
            case !email:
                setErrorMessage('Email is required.');
                return;
            case !email.includes('@'):
                setErrorMessage('Invalid email adddress.');
                return;
            case !password:
                setErrorMessage('Password is required.');
                return;
            case password.length < 8:
                setErrorMessage('Password must be at least 8 characters long.');
                return;
            default:
                break;
        }

        try {
            setIsAuthenticating(true);
            
            // Register a user
            if (isRegistration) {
                await signup(email, password);
                
                // Authenticate a user
            } else {
                await login(email, password);
            }

            // Close the modal if either of the process above is successful
            handleCloseModal();
        } catch (error) {
            if (error) {
                setErrorMessage('Invalid Email Address or Password');
            }
        } finally {
            setIsAuthenticating(false);
        }
    }
    
    return (
        <>
            <h2 className="sign-up-text">{isRegistration ? 'Sign Up' : 'Login'}</h2>
            <p>{isRegistration ? 'Create an account!' : 'Sign in to your account!'}</p>

            {errorMessage && (<div className="error-message">{errorMessage}</div>)}

            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@domail.com" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*********" />
            <button onClick={handleAuthenticate} type="submit" disabled={isAuthenticating}>
                <p>{isAuthenticating ? 'Authenticating...' : 'Submit'}</p>
            </button>
            
            <hr />

            <div className="register-content">
                <p>{isRegistration ? 'Already have an account?' : 'Don\'t have an account?'}</p>
                <button onClick={() => setIsRegistration(!isRegistration)}>
                    <p>{isRegistration ? 'Log in' : 'Sign up'}</p>
                </button>
            </div>
        </>
    );
}

export default Authentication;