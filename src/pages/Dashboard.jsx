import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import addressBookIcon from '../assets/address-book.png';


function Dashboard() {

    const navigate = useNavigate();
    const {currentUser} = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [tags, setTags] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');



    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/dashboard');
        }
        catch (err) {
            console.error("Logout Error: ", err.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        const newContact = { name, email, phone, tags, photoURL,
            address: {
            street,
            city,
            state,
            zip,
          }};
        console.log('Contact submitted:', newContact);
      
        // Add logic here to save to Firestore or state list later
      
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setTags('');
        setPhotoURL('');
        setStreet('');
        setCity('');
        setState('');
        setZip('');

      
        // Hide form
        setShowForm(false);
      };
      

    return (
        <>
        <div className="dashboard-header">
            <img src={addressBookIcon} alt="Address Book" className="logo-icon" />
            <h1>Welcome {currentUser?.displayName}</h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
        <div className="dashboard-container">
            <div className="dashboard-content">
                <button className="add-contact-button" onClick={() => setShowForm(true)}>
                    Add Contact
                </button>
                {showForm && (
                    <div className="add-contact-overlay" onClick={() => setShowForm(false)}>
                        <div className="add-contact-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add Contact</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                />
                                 <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                />
                                <div className="address-group">
                                    <input
                                        type="text"
                                        placeholder="Street"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="ZIP / Area Code"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                    />
                                </div>
                                <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                />
                                <input
                                type="text"
                                placeholder="Photo URL"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                />
                                <button type="submit">Save Contact</button>
                            </form>
                        </div>
                    </div>
                    )}
            </div>
        </div>
        </>
    )
}

export default Dashboard;