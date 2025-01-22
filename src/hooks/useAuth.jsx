import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Create a custom hook for this context to be readable from any other components
function useAuth() {

    // Create a custom hook for this context to be readable from any other components
    return useContext(AuthContext);
}

export default useAuth;