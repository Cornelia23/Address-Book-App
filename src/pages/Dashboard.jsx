import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import addressBookIcon from '../assets/address-book.png';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';




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
    const [contacts, setContacts] = useState([]);


    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const q = query (
                    collection(db, 'contacts'),
                    where('userID', '==', currentUser.uid)
                );

                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setContacts(data);
            }
            catch (err) {
                console.error('Error caused by fetching contacts: ', err.message);
            }
        };

        if (currentUser?.uid) {
            fetchContacts();
        }

    }, [currentUser]);



    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/dashboard');
        }
        catch (err) {
            console.error("Logout Error: ", err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const newContact = { 
            name, 
            email, 
            phone, 
            tags, 
            photoURL,
            address: {street, city, state, zip,},
            userID: currentUser.uid,
            createdAt: Date.now()
        };

        try {
            await addDoc(collection(db, 'contacts'), newContact);

            // Add to contact list
            setContacts((prev) => [...prev, newContact]);

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
        }
        catch (err) {
            console.error('Adding contact caused error: ', err.message);
        }    
      };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'contacts', id));
            setContacts((prev) => prev.filter(contact => contact.id !== id));
        } 
        catch (err) {
            console.error('Deleting contact caused error: ', err.message);
        }
    }
      

    return (
        <>
        <div className="dashboard-header">
            <img src={addressBookIcon} alt="Address Book" className="logo-icon" />
            <h1>Welcome {currentUser?.displayName}</h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
        <div className="dashboard-container">
            <div className="dashboard-main">
                <div className="dashboard-filters">
                    {/* Dropdowns go here */}
                </div>
                <div className="dashboard-contacts">
                    <div className="contacts-header">
                        <h3>Your Contacts</h3>
                        <button className="add-contact-button" onClick={() => setShowForm(true)}>
                            Add Contact
                        </button>
                    </div>
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
                    {contacts.length > 0 && (
                        <div className="contact-display">
                            {contacts.map((contact, index) => (
                                <div className="contact-card" key={contact.id}>
                                    {contact.photoURL && (
                                        <img
                                            src={contact.photoURL}
                                            alt={contact.name}
                                            className="contact-photo"
                                        />
                                    )}
                                    <div className="contact-info">
                                        <h4>{contact.name}</h4>
                                        <p><strong>Phone: </strong>{contact.phone}</p>
                                        <p><strong>Email: </strong>{contact.email}</p>
                                        <p><strong>Tags: </strong>{contact.tags}</p>
                                        <p>
                                            <strong>Address: </strong>{' '}
                                            {contact.address.street}, {contact.address.city}, {contact.address.state} {contact.address.zip}
                                        </p>
                                    </div>
                                    <button className="delete-button"
                                        onClick={() => handleDelete(contact.id)}
                                        >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}    
                </div>
            </div> 
        </div>
        </>
    )
}

export default Dashboard;