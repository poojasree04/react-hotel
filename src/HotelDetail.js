import { useEffect, useState } from "react"; 
import { useParams, Link } from "react-router-dom"; 
import './HotelDetail.css'; // Optional: Add CSS for styling 

 const HotelDetail = () => { 
   const { id } = useParams(); // Get the hotel ID from the URL 
   const [hotel, setHotel] = useState(null); 
   const [loading, setLoading] = useState(true); 
   const [error, setError] = useState(null);
    
 useEffect(() => { 

    console.log(`Fetching details for hotel ID: ${id}`); 

       // Fetch the hotel details from the API 

        fetch(`http://localhost:3000/hotels/${id}`) 

            .then(response => { 

                console.log('Response received:', response); 

                if (!response.ok) throw new Error('Network response was not ok'); 

                return response.json(); 

            }) 

            .then(data => { 

                console.log('Hotel data received:', data); 

                setHotel(data); 

                setLoading(false); 

            }) 

            .catch(error => { 

                console.error('Error fetching hotel details:', error); 

                setError(error); 

                setLoading(false); 

            }); 

    }, [id]); 

 

    if (loading) return <p>Loading...</p>; 

    if (error) return <p>Error loading hotel details. Please try again later.</p>; 

    if (!hotel) return <p>Hotel not found.</p>; 

 

    return ( 

        <div className="hotel-detail"> 

            <h1>{hotel.name}</h1> 

            <img src={hotel.imageUrl} alt={hotel.name} className="hotel-image" /> 

            <p><strong>Location:</strong> {hotel.location}</p> 

            <p><strong>Description:</strong> {hotel.description}</p> 

            <p><strong>Price per Night:</strong> ₹{hotel.pricePerNight}</p> 

            <p><strong>Rating:</strong> {hotel.rating}</p> 

             

            <div className="hotel-amenities"> 

                <h3>Amenities:</h3> 

                <ul> 

                    {hotel.amenities && hotel.amenities.length > 0 ? ( 

                        hotel.amenities.map((amenity, index) => ( 

                            <li key={index}>{amenity}</li> 

                        )) 

                    ) : ( 

                        <li>No amenities listed</li> 

                    )} 

                </ul> 

            </div> 

             

            <div className="hotel-rooms"> 

                <h3>Available Rooms:</h3> 

                {hotel.rooms && hotel.rooms.length > 0 ? ( 

                    hotel.rooms.map((room, index) => ( 

                        <div key={index} className="room-details"> 

                            <h4>{room.type}</h4> 

                            <p><strong>Price:</strong> ₹{room.price}</p> 

                            <p><strong>Features:</strong> {room.features.join(', ')}</p> 

                        </div> 

                    )) 

                ) : ( 

                    <p>No rooms available</p> 

                )} 

            </div> 

             

            <div className="hotel-actions"> 

                <Link to={`/book/${hotel.id}`} className="book-button"> 

                    Book Now 

                </Link> 

            </div> 

        </div> 

    ); 

}; 

 

export default HotelDetail; 