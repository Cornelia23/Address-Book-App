import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import addressBookIcon from '../assets/address-book.png';




function Dashboard() {

    const navigate = useNavigate();
    const {currentUser} = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/dashboard');
        }
        catch (err) {
            console.error("Logout Error: ", err.message);
        }
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
                <p>This is where your contact list and form will go.</p>
            </div>
        </div>
        </>
    )
}

export default Dashboard;