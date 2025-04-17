import { useEffect, useState } from "react";
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        const userId = 'pooja'; // Example user ID, replace with actual ID or fetch from authentication context

        // Fetch user details
        fetch(`http://localhost:3000/user?id=${userId}`)
            .then(response => response.json())
            .then(data => {
                setUser(data[0]);
                setEditedUser(data[0]); // Initialize editedUser with current user data
            })
            .catch(error => console.error('Error fetching user details:', error));

        // Fetch recent searches
        fetch('http://localhost:3000/recentsearches')
            .then(response => response.json())
            .then(data => setRecentSearches(data))
            .catch(error => console.error('Error fetching recent searches:', error));

        // Fetch bookings
        fetch('http://localhost:3000/bookings')
            .then(response => response.json())
            .then(data => setBookings(data))
            .catch(error => console.error('Error fetching bookings:', error));

        // Fetch favorites
        fetch('http://localhost:3000/favorites')
            .then(response => response.json())
            .then(data => setFavorites(data))
            .catch(error => console.error('Error fetching favorites:', error));
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveClick = () => {
        const userId = 'pooja'; // Example user ID, replace with actual ID or fetch from authentication context

        fetch(`http://localhost:3000/user?id=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedUser),
        })
        .then(response => {
            if (response.ok) {
                setUser(editedUser);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Error updating profile. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        });
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`sidebar-button ${activeTab === 'profile' ? 'active' : ''}`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('favourites')}
                    className={`sidebar-button ${activeTab === 'favourites' ? 'active' : ''}`}
                >
                    Favourites
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`sidebar-button ${activeTab === 'bookings' ? 'active' : ''}`}
                >
                    Bookings
                </button>
            </div>
            <div className="content">
                {activeTab === 'profile' && user && (
                    <div className="profile-section">
                        <h2>User Profile</h2>
                        {isEditing ? (
                            <div className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={editedUser.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone:</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={editedUser.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country:</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={editedUser.country}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address:</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={editedUser.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button onClick={handleSaveClick} className="save-button">Save</button>
                                <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                            </div>
                        ) : (
                            <div className="profile-details">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                                <p><strong>Country:</strong> {user.country}</p>
                                <p><strong>Address:</strong> {user.address}</p>
                                <button onClick={handleEditClick} className="edit-button">Edit</button>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'favourites' && (
                    <div className="favourites-section">
                        <h2>Your Favourites</h2>
                        {favorites.length > 0 ? (
                            <ul>
                                {favorites.map(fav => (
                                    <li key={fav.id}>
                                        <p><strong>Hotel ID:</strong> {fav.hotelId}</p>
                                        <p><strong>Hotel Name:</strong> {fav.hotelName}</p>
                                        <p><strong>Location:</strong> {fav.location}</p>
                                        <p><strong>Price per Night:</strong> ₹{fav.pricePerNight}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No favorites found.</p>
                        )}
                    </div>
                )}
                {activeTab === 'bookings' && (
                    <div className="bookings-section">
                        <h2>Your Bookings</h2>
                        {bookings.length > 0 ? (
                            <ul>
                                {bookings.map(booking => (
                                    <li key={booking.id}>
                                        <p><strong>Hotel ID:</strong> {booking.hotelId}</p>
                                        <p><strong>Guest Name:</strong> {booking.guestName}</p>
                                        <p><strong>Check-In:</strong> {booking.checkInDate}</p>
                                        <p><strong>Check-Out:</strong> {booking.checkOutDate}</p>
                                        <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No bookings found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
