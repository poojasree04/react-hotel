import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            showmenuupdateupdate(false);
        } else {
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('username');
            if (username === '' || username === null) {
                usenavigate('/login');
            } else {
                displayusernameupdate(username);
            }
        }
    }, [location, usenavigate]);

    return (
        <div>
            {showmenu && (
                <div className="header">
                    <Link to="/">Home</Link>
                    <Link to="/dashboard" style={{ marginLeft: '20px' }}>Dashboard</Link>
                    <span style={{ marginLeft: '70%' }}>Welcome <b>{displayusername}</b></span>
                    <Link to="/login" style={{ float: 'right' }}>Logout</Link>
                </div>
            )}
        </div>
    );
};

export default Appheader;