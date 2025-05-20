import { useState } from 'react';


function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (     
        <div>
            <h1>Sign Up</h1>

            <form>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                <br />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                <br />
                <button type="submit" placeholder="Submit" />
            </form>
        </div>
    )
}

export default Signup;