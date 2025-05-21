import { useState } from 'react';
import { auth } from '../firebase/config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


function Signup() {
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
          default:
            return 'Signup failed. Please try again.';
        }
      };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // stop the form from refreshing the page
      
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Created: ", user);
            navigate('/dashboard');

        }
        catch (err) {
            console.error("Signup Error: ", err.message);
            setError(formatError(err.code));
        }
      };

      return (
        <div className="signup-container">
          <div className="form-header">
            <h1>Sign Up</h1>
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
            </form>
          </div>
      
          <div className="form-footer">
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )      
}

export default Signup;