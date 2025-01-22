import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore/lite";

// Initialize the context hook
export const AuthContext = createContext();

function AuthProvider(props) {

    const { children } = props;

    // Store the current authenticated user
    const [globalUser, setGlobalUser] = useState(null);
    // Store related authenticated user data
    const [globalData, setGlobalData] = useState(null);
    // Determine loading state while a user is being authenticated
    const [isLoading, setIsLoading] = useState(false);

    // ----------------------------------------------------------------

    // Register a new user
    function signup(email, password) {
        
        // The returned invoked function is async
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Authenticate an existing suer
    function login(email, password) {
        
        // The returned invoked function is async
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Deaunthenticate the logged in user
    function logout() {
        
        // Flush temporarily stored user data
        setGlobalUser(null);
        setGlobalData(null);

        return signOut(auth);
    }

    // Request a password reset through email link
    // function resetPassword(email) {
        
    //     return sendPasswordResetEmail(auth, email);
    // }

    // Store the context values to be passed down (or becomes a global state)
    const value = { 
                    globalUser, 
                    globalData, 
                    setGlobalData, 
                    isLoading,
                    signup,
                    login,
                    logout
                };

    // ----------------------------------------------------------------

    // Listen for authentication events
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            // Store the authenticated user if any
            setGlobalUser(user);

            // If there is no user returned, then empty the user state and return from this listener 
            // [ User logged out ]
            if (!user) {
                // console.log('No active user');
                return
            };

            /**
             * If there is a user returned, then check if the user has data in the database
             * If the data exist, then fetch the data and update the global state
             * [ User logged in or new user registered ]
             */
            try {
                setIsLoading(true);

                /**
                 * Create a reference to the corresponding user's document (labelled json object) 
                 * by informing Firebase which collection to access from the initialized database connection
                 * based on the user's UID
                 */
                const docRef = doc(db, 'users', user.uid);

                // Get a snapshot of the document belonging to the user from the referenced document
                const docSnap = await getDoc(docRef);
                
                // Declare the variable to store either the retrieved snapshot data or an empty data
                let firebaseData = {};

                // Check if the snapshot data is NOT empty
                if (docSnap.exists()) {
                    // Store the data from the snapshot
                    firebaseData = docSnap.data();

                    // console.log('Found user data', firebaseData);
                } // Otherwise an empty object is assigned below

                // Store the data (if exist) from the snapshot
                setGlobalData(firebaseData);

            } catch (error) {
                console.log(error.message);
            } finally {
                setIsLoading(false);
            }
        });
        
        // A cleanup to discard the event listener, 'unsubcribe', above to prevent data leakages upon closing the application
        return () => {
            unsubscribe
        };
    }, []);

    // ----------------------------------------------------------------

    // Return a secondary React component that is created above
    return (
        // Wrapper for appending any components that will inherit the context values
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;