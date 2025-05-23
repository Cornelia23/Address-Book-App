/**
 * AuthContext
 * 
 * This makes a React context to store the current user. It uses AuthProvider to wrap
 * the app and to manage the Firebase auth state. It also exports the useAuth hook
 * which allows any component to easily access the current user.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
  
      return unsubscribe; 
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
          {!loading && children}
        </AuthContext.Provider>
      );
}  

export function useAuth() {
    return useContext(AuthContext);
}
  