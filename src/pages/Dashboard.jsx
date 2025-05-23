/**
 * Dashboard Component 
 * 
 * This manages the functionality for the dashboard page, which is shown after the user logs in / signs up.
 * On this page, a user is able to:
 *  -Logout
 *  -Add a contact
 *  -Edit or delete their existing contacts
 *  -Search their contacts 
 *  -Filter by tags and zip code and sort alphabetically or by date added
 *  -Favorite a contact, which automatically pins it to the top of their list
 *  -Toggle 'Show All Favorites' which only displays their favorite contacts
 * 
 * This project uses Firebase and Firestore to persist contact information across logins and has a responsive page
 * layout with separate sections for the header, contacts, and filters.
 * 
 * The Dashboard component uses several hooks. The first is useState, which handles the form and UI. It also uses 
 * useEffect, which fetches contacts, and useAuth, which accesses the current user. Finally, useNavigate is used
 * to move between page components.
 * 
 */

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
    const [searchTerm, setSearchTerm] = useState('');


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


    /**
     * handleLogout
     * 
     * This function is called when the user presses the 'Logout' button and uses the Firebase
     * signOut function to sign out the current user and navigates to the login page (navigating to 
     * dashboard first will automatically navigate to the login page since there is no longer a 
     * current user and the dashboard page is protected.)
     */
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/dashboard');
        }
        catch (err) {
            console.error("Logout Error: ", err.message);
        }
    };


    /**
     * handleEdit
     * 
     * This function is called when the 'Edit' button is pressed on a contact and it pre-fills the form
     * with the contact's current information so the user can easily edit whichever field they want without
     * having to refill the entire form. It then shows the form at the end.
     */
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


    /**
     * handleSubmit
     * 
     * This function is called when the Edit or Add Contact forms are submitted. It calls preventDefault to stop a page
     * reload, and then it creates a newContact with the fields from the form. If the form is in edit mode, it edits the
     * contact in Firestore and in the local contact list. If the form is in add mode, it creates a new contact and adds
     * it to the Firestore db and the local contact list. Finally, it clears and hides the form.
     */
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
            if (editContactID != null) {
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


    /**
     * handleDelete
     * 
     * This function is called when the 'Delete' button is pressed on a contact card. It uses the Firestore
     * deleteDoc function to remove the contact from Firestore, and it removes it from the local contact list
     * as well.
     */
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'contacts', id));
            setContacts((prev) => prev.filter(contact => contact.id !== id));
        } 
        catch (err) {
            console.error('Deleting contact caused error: ', err.message);
        }
    }

    //Gets a list of all the unique Zip code values from the current contacts
    const uniqueZips = [...new Set(
        contacts.map(c => c.address.zip).filter(Boolean))
    ];

    //Gets a list of all the unique tag values from the current contacts
    const uniqueTags = [...new Set(
        contacts.flatMap(c => c.tags?.split(',').map(t => t.trim().toLowerCase())).filter(Boolean)
    )];


    //Creates a filtered list of contacts based on the selected dropdown options/favorite toggle
    const filteredContacts = contacts.filter((contact) => {
            const zipMatch = filterZip === '' || contact.address.zip === filterZip;
            const tagMatch = filterTag === '' || contact.tags?.toLowerCase().split(',').map(t => t.trim()).includes(filterTag);
            const favoriteMatch = !showFavoritesOnly || contact.favorite;

            const search = searchTerm.toLowerCase();
            const searchMatch =
              contact.name.toLowerCase().includes(search) ||
              contact.email.toLowerCase().includes(search) ||
              (contact.tags && contact.tags.toLowerCase().includes(search));

            return zipMatch && tagMatch && favoriteMatch && searchMatch;
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


    /**
     * toggleFavorite
     * 
     * This function is called when the favorite star is pressed on a contact card. It updates that contact
     * locally and in Firestore so that its favorite field is set to the opposite of whatever it currently is
     */
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

      
    /**
     * Dashboard component structure:
     * - Header: logo, welcome message, logout button
     * - Main section:
     *   - Left column: filtering dropdowns
     *   - Right column:
     *     - 'Your Contacts', Add Contact button, and Search bar
     *     - Add/Edit contact form
     *     - Contact cards (with edit/delete/favorite buttons)
     */
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
                        <button className="add-contact-button" onClick={() => {
                                setEditContactID(null); 
                                setName('');
                                setPhone('');
                                setEmail('');
                                setTags('');
                                setPhotoURL('');
                                setStreet('');
                                setCity('');
                                setState('');
                                setZip('');
                                setShowForm(true); 
                            }}
                            >
                            Add Contact
                        </button>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search contacts"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {showForm && (
                        <div className="add-contact-overlay" onClick={() => {setShowForm(false); setEditContactID(null)}}>
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