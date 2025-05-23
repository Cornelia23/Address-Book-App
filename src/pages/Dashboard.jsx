import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import addressBookIcon from '../assets/address-book.png';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';




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
    const [editContactID, setEditContactID] = useState(null); 
    const [filterZip, setFilterZip] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);




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

    const handleEdit = (contact) => {
        setEditContactID(contact.id);
        setName(contact.name);
        setEmail(contact.email);
        setPhone(contact.phone);
        setTags(contact.tags);
        setPhotoURL(contact.photoURL);
        setStreet(contact.address.street);
        setCity(contact.address.city);
        setState(contact.address.state);
        setZip(contact.address.zip);
        setShowForm(true);
    }

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
            createdAt: Date.now(),
            favorite: editContactID ? contacts.find(c => c.id === editContactID)?.favorite || false : false
        };

        try {
            if (editContactID) {
                const docRef = doc(db, 'contacts', editContactID);
                await updateDoc(docRef, newContact);

                setContacts((prev) => prev.map((c) => (c.id === editContactID ? {...newContact, id: editContactID} : c)));
            }
            else {
                await addDoc(collection(db, 'contacts'), newContact);

                // Add to contact list
                setContacts((prev) => [...prev, newContact]);
            }


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

    const uniqueZips = [...new Set(
        contacts.map(c => c.address.zip).filter(Boolean))
    ];

    const uniqueTags = [...new Set(
        contacts.flatMap(c => c.tags?.split(',').map(t => t.trim().toLowerCase())).filter(Boolean)
    )];

    const filteredContacts = contacts.filter((contact) => {
            const zipMatch = filterZip === '' || contact.address.zip === filterZip;
            const tagMatch = filterTag === '' || contact.tags?.toLowerCase().split(',').map(t => t.trim()).includes(filterTag);
            const favoriteMatch = !showFavoritesOnly || contact.favorite;
            return zipMatch && tagMatch && favoriteMatch;
        })
        .sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;

            if (sortBy === 'newest') return b.createdAt - a.createdAt;
            if (sortBy === 'oldest') return a.createdAt - b.createdAt;
            if (sortBy === 'a-z') return a.name.localeCompare(b.name);
            if (sortBy === 'z-a') return b.name.localeCompare(a.name);
            return 0;
    });


    const toggleFavorite = async (contact) => {
        try {
            const updated = { ...contact, favorite: !contact.favorite };
            await updateDoc(doc(db, 'contacts', contact.id), { favorite: updated.favorite });
        
            setContacts(prev =>
              prev.map(c => (c.id === contact.id ? { ...c, favorite: updated.favorite } : c))
            );
          } catch (err) {
            console.error("Error toggling favorite:", err.message);
          }
    };

      

    return (
        <>
        <div className="dashboard-header">
            <img src={addressBookIcon} alt="Address Book" className="logo-icon" />
            <h1>Welcome {currentUser?.displayName ? currentUser.displayName : currentUser.email}</h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
        <div className="dashboard-container">
            <div className="dashboard-main">
                <div className="dashboard-filters">
                    <div className="filter-group">
                        <label>Filter by Tag:</label>
                        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
                            <option value="">All</option>
                            {uniqueTags.map((tag, idx) => (
                            <option key={idx} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Filter by ZIP / Area Code:</label>
                        <select value={filterZip} onChange={(e) => setFilterZip(e.target.value)}>
                            <option value="">All</option>
                            {uniqueZips.map((zip, idx) => (
                            <option key={idx} value={zip}>{zip}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort Contacts:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Date Added: Newest First</option>
                            <option value="oldest">Date Added: Oldest First</option>
                            <option value="a-z">Alphabetical: A → Z</option>
                            <option value="z-a">Alphabetical: Z → A</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>
                            <input
                            type="checkbox"
                            checked={showFavoritesOnly}
                            onChange={() => setShowFavoritesOnly(prev => !prev)}
                            />
                            Show Favorites Only
                        </label>
                    </div>

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
                                <h2>
                                    {editContactID ? 'Edit Contact' : 'Add Contact'}
                                </h2>
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
                                    <button type="submit">
                                        {editContactID ? 'Save Changes' : 'Add Contact'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        )}
                    {contacts.length > 0 && (
                        <div className="contact-display">
                            {filteredContacts.map((contact) => (
                                <div className="contact-card" key={contact.id}>
                                    <button className="favorite-button" onClick={() => toggleFavorite(contact)}>
                                        {contact.favorite ? '★' : '☆'}
                                    </button>
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
                                    <div className="form-types">
                                        <button className="delete-button"
                                            onClick={() => handleDelete(contact.id)}
                                            >
                                            Delete
                                        </button>
                                        <button className="edit-button"
                                            onClick={() => handleEdit(contact)}
                                            >
                                            Edit 
                                        </button>
                                    </div>
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