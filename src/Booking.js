import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Booking.css'; // Import the CSS file for styling

const Booking = () => {
    const { id } = useParams(); // Get the hotel ID from the URL
    const [hotel, setHotel] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState(''); // State for selected room type
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guestName, setGuestName] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch hotel details from the API
        fetch('http://localhost:3000/hotels/${id}')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setHotel(data);
                if (data.rooms.length > 0) {
                    setSelectedRoomType(data.rooms[0].type); // Set default room type
                }
            })
            .catch(error => setError(error.message));
    }, [id]);

    useEffect(() => {
        if (hotel) {
            const selectedRoom = hotel.rooms.find(room => room.type === selectedRoomType);
            if (selectedRoom && checkInDate && checkOutDate) {
                const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
                setTotalPrice(selectedRoom.price * nights);
            }
        }
    }, [selectedRoomType, checkInDate, checkOutDate, hotel]);

    const handleBooking = () => {
        if (hotel && selectedRoomType && checkInDate && checkOutDate && guestName) {
            if (new Date(checkOutDate) <= new Date(checkInDate)) {
                alert('Check-Out date must be after Check-In date.');
                return;
            }
            
            const bookingDetails = {
                hotelId: hotel.id,
                hotelName: hotel.name,
                guestName,
                checkInDate,
                checkOutDate,
                totalPrice,
                roomType: selectedRoomType,
            };

            fetch('http://localhost:3000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            })
            .then(response => {
                if (response.ok) {
                    alert('Booking confirmed!');
                    navigate('/dashboard'); // Navigate to the dashboard after booking
                } else {
                    throw new Error('Error confirming booking');
                }
            })
            .catch(error => {
                console.error('Error confirming booking:', error);
                alert('Error confirming booking. Please try again.');
            });
        } else {
            alert('Please fill all fields.');
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!hotel) return <p>Loading...</p>;

    return (
        <div className="booking-container">
            <h1>Book Your Stay at {hotel.name}</h1>
            <img src={hotel.imageUrl} alt={hotel.name} className="hotel-image" />
            <div className="booking-details">
                <div className="form-group">
                    <label htmlFor="roomType">Select Room Type:</label>
                    <select
                        id="roomType"
                        value={selectedRoomType}
                        onChange={e => setSelectedRoomType(e.target.value)}
                    >
                        {hotel.rooms.map(room => (
                            <option key={room.type} value={room.type}>
                                {room.type} - ₹{room.price} per night
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="checkInDate">Check-In Date:</label>
                    <input
                        type="date"
                        id="checkInDate"
                        value={checkInDate}
                        onChange={e => setCheckInDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="checkOutDate">Check-Out Date:</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        value={checkOutDate}
                        onChange={e => setCheckOutDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="guestName">Guest Name:</label>
                    <input
                        type="text"
                        id="guestName"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <p><strong>Total Price:</strong> ₹{totalPrice}</p>
                </div>
                <button onClick={handleBooking} className="book-button">Confirm Booking</button>
            </div>
        </div>
    );
};

export default Booking;