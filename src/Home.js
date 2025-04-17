import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './SearchBar.css';

const Home = () => {
    const [hotelList, setHotelList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]); // Changed to array of hotel details

    useEffect(() => {
        fetch('http://localhost:3000/hotels')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setHotelList(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching hotels:', error);
                setError(error);
                setLoading(false);
            });

        // Load favorites from local storage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const filteredHotels = hotelList.filter(hotel =>
        (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        hotel.pricePerNight >= minPrice &&
        hotel.pricePerNight <= maxPrice &&
        hotel.rating >= rating
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleMinPriceChange = (e) => {
        setMinPrice(Number(e.target.value));
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(Number(e.target.value));
    };

    const handleRatingChange = (e) => {
        setRating(Number(e.target.value));
    };

    const handleFavoriteToggle = (hotel) => {
        setFavorites(prevFavorites => {
            const newFavorites = prevFavorites.find(fav => fav.id === hotel.id) ? 
                prevFavorites.filter(fav => fav.id !== hotel.id) : 
                [...prevFavorites, hotel];
            return newFavorites;
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading hotels. Please try again later.</p>;

    return (
        <div className="home-container">
            <div className="filters-container">
                <h2>Filters</h2>
                <div className="filter">
                    <label htmlFor="min-price" className="filter-label">Min Price:</label>
                    <input
                        type="number"
                        id="min-price"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="filter-input"
                    />
                </div>
                <div className="filter">
                    <label htmlFor="max-price" className="filter-label">Max Price:</label>
                    <input
                        type="number"
                        id="max-price"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="filter-input"
                    />
                </div>
                <div className="filter">
                    <label htmlFor="rating" className="filter-label">Min Rating:</label>
                    <input
                        type="number"
                        id="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={rating}
                        onChange={handleRatingChange}
                        className="filter-input"
                    />
                </div>
            </div>

            <div className="content-container">
                <h1 className="text-center">Welcome to The Hotel</h1>

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by name or location"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>

                <div className="hotel-grid">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map(hotel => (
                            <div key={hotel.id} className="hotel-card">
                                <img src={hotel.imageUrl || '/default-image.jpg'} alt={hotel.name} className="hotel-image" />
                                <div className="hotel-info">
                                    <h3>{hotel.name}</h3>
                                    <p><strong>Location:</strong> {hotel.location}</p>
                                    <p><strong>Price per Night:</strong> ₹{hotel.pricePerNight}</p>
                                    <p><strong>Rating:</strong> {hotel.rating}</p>
                                    <div className="hotel-actions">
                                        <Link to={'/hotel/${hotel.id}'} className="btn btn-primary">
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleFavoriteToggle(hotel)}
                                            className="btn btn-primary"
                                        >
                                            {favorites.find(fav => fav.id === hotel.id) ? 'Unfavorite' : 'Favorite'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hotels available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;